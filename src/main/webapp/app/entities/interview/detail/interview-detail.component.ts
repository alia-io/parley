import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { InterviewDetailsDTO } from '../interview.model';
import { InterviewService } from '../service/interview.service';
import { take } from 'rxjs';
import { UsersDTO } from '../../users/users.model';
import { QuestionService } from '../../question/service/question.service';
import { QuestionAttributesDTO } from '../../question/question.model';

@Component({
  selector: 'jhi-interview-detail',
  templateUrl: './interview-detail.component.html',
  styleUrls: ['./interview-detail.css'],
})
export class InterviewDetailComponent implements OnInit {
  interviewDetails!: InterviewDetailsDTO;
  usersList!: UsersDTO[];
  questionList!: QuestionAttributesDTO[];
  private interviewId!: number;

  constructor(
    protected interviewService: InterviewService,
    protected activatedRoute: ActivatedRoute,
    protected questionService: QuestionService
  ) {}

  ngOnInit(): void {
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
  }

  previousState(): void {
    window.history.back();
  }

  addQuestion(): void {
    if (!this.questionList) {
      this.questionList = [
        {
          question: '',
          questionName: ' ',
          attributes: [
            {
              id: 5,
              attributeName: 'something',
              description: 'something',
            },
          ],
        },
      ];
    } else {
      this.questionList.push({
        question: '',
        questionName: ' ',
        attributes: [],
      });
    }
  }
}
