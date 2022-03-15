import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IInterview, UserDisplayDTO } from '../interview.model';
import { InterviewService } from '../service/interview.service';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';
import { JobService } from '../../job/service/job.service';
import { IJob } from '../../job/job.model';

@Component({
  selector: 'jhi-interview-update',
  templateUrl: './interview-update.component.html',
})
export class InterviewUpdateComponent implements OnInit {
  isSaving = false;
  jobs?: IJob[];
  userList: UserDisplayDTO[] = [];
  questionsSharedCollection: IQuestion[] = [];
  interviewForm: FormGroup;

  editForm = this.fb.group({
    id: [],
    details: [],
    questions: [],
  });

  constructor(
    protected interviewService: InterviewService,
    protected jobService: JobService,
    protected questionService: QuestionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected router: Router
  ) {
    this.interviewForm = this.fb.group({
      userIdList: ['', Validators.required],
      jobId: ['', Validators.required],
      interviewDetails: [''],
      candidateFirstName: ['', Validators.required],
      candidateLastName: ['', Validators.required],
      candidateEmail: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.interviewService
      .getUserList()
      .pipe(take(1))
      .subscribe(user => (this.userList = user));

    this.jobService.query().subscribe({
      next: (res: HttpResponse<IJob[]>) => (this.jobs = res.body ?? []),
    });
  }

  previousState(): void {
    window.history.back();
  }

  trackQuestionById(index: number, item: IQuestion): number {
    return item.id!;
  }

  getSelectedQuestion(option: IQuestion, selectedVals?: IQuestion[]): IQuestion {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  interviewSubmit(): void {
    this.interviewService
      .createInterview(this.interviewForm.value)
      .pipe(take(1))
      .subscribe(interviewDetailsDTO => {
        //console.log(interviewDetailsDTO.interview.id);
        this.router.navigateByUrl(`interview/${Number(interviewDetailsDTO.interview.id)}/view`);
      });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInterview>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected loadRelationshipsOptions(): void {
    this.questionService
      .query()
      .pipe(map((res: HttpResponse<IQuestion[]>) => res.body ?? []))
      .pipe(
        map((questions: IQuestion[]) =>
          this.questionService.addQuestionToCollectionIfMissing(questions, ...(this.editForm.get('questions')!.value ?? []))
        )
      )
      .subscribe((questions: IQuestion[]) => (this.questionsSharedCollection = questions));
  }
}
