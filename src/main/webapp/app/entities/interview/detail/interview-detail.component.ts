import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { InterviewDetailsDTO } from '../interview.model';
import { InterviewService } from '../service/interview.service';
import { take } from 'rxjs';
import { UsersDTO } from '../../users/users.model';
import { QuestionService } from '../../question/service/question.service';
import { NewQuestionDTO, QuestionAttributesDTO } from '../../question/question.model';
import { AttributeService } from '../../attribute/service/attribute.service';
import { IAttribute } from '../../attribute/attribute.model';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'jhi-interview-detail',
  templateUrl: './interview-detail.component.html',
  styleUrls: ['./interview-detail.css'],
})
export class InterviewDetailComponent implements OnInit {
  interviewDetails!: InterviewDetailsDTO;
  usersList!: UsersDTO[];
  questionList!: QuestionAttributesDTO[];
  attributeList!: IAttribute[];
  newQuestion!: NewQuestionDTO;
  newQuestionOpen = false;
  interviewId!: number;
  questionForm: FormGroup;

  constructor(
    protected interviewService: InterviewService,
    protected activatedRoute: ActivatedRoute,
    protected questionService: QuestionService,
    protected attributeService: AttributeService,
    protected router: Router,
    protected fb: FormBuilder
  ) {
    this.questionForm = this.fb.group({
      questionName: ['', Validators.required],
      question: [''],
      attributes: [''],
    });
  }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.activatedRoute.paramMap.pipe(take(1)).subscribe(paramMap => (this.interviewId = Number(paramMap.get('id'))));
    this.interviewService
      .getInterviewDetails(this.interviewId)
      .pipe(take(1))
      .subscribe(interview => (this.interviewDetails = interview));
    this.interviewService
      .getInterviewUsersList(this.interviewId)
      .pipe(take(1))
      .subscribe(users => (this.usersList = users));
    this.questionService
      .getQuestionsByInterview(this.interviewId)
      .pipe(take(1))
      .subscribe(questions => (this.questionList = questions));
    this.attributeService.query().subscribe({
      next: (res: HttpResponse<IAttribute[]>) => (this.attributeList = res.body ?? []),
    });
  }

  previousState(): void {
    window.history.back();
  }

  addQuestion(): void {
    if (this.newQuestionOpen) {
      this.interviewSubmit();
      this.newQuestionOpen = false;
    } else {
      this.newQuestionOpen = true;
      this.newQuestion = {
        questionName: '',
        question: '',
        attributes: [
          {
            id: 0,
            attributeName: '',
            description: '',
          },
        ],
      };
    }
  }

  interviewSubmit(): void {
    this.newQuestion = this.questionForm.value;
    this.questionForm = this.fb.group({
      questionName: ['', Validators.required],
      question: [''],
      attributes: [''],
    });
    this.questionService.addQuestionToInterview(this.interviewId, this.newQuestion).pipe(take(1)).subscribe();
    window.location.reload();
  }
}
