import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IQuestion, Question } from '../question.model';
import { QuestionService } from '../service/question.service';
import { IInterview } from 'app/entities/interview/interview.model';
import { InterviewService } from 'app/entities/interview/service/interview.service';

@Component({
  selector: 'jhi-question-update',
  templateUrl: './question-update.component.html',
})
export class QuestionUpdateComponent implements OnInit {
  isSaving = false;

  interviewsSharedCollection: IInterview[] = [];

  editForm = this.fb.group({
    id: [],
    questionName: [],
    question: [],
    interview: [],
  });

  constructor(
    protected questionService: QuestionService,
    protected interviewService: InterviewService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ question }) => {
      this.updateForm(question);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const question = this.createFromForm();
    if (question.id !== undefined) {
      this.subscribeToSaveResponse(this.questionService.update(question));
    } else {
      this.subscribeToSaveResponse(this.questionService.create(question));
    }
  }

  trackInterviewById(index: number, item: IInterview): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuestion>>): void {
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

  protected updateForm(question: IQuestion): void {
    this.editForm.patchValue({
      id: question.id,
      questionName: question.questionName,
      question: question.question,
      interview: question.interview,
    });

    this.interviewsSharedCollection = this.interviewService.addInterviewToCollectionIfMissing(
      this.interviewsSharedCollection,
      question.interview
    );
  }

  protected loadRelationshipsOptions(): void {
    this.interviewService
      .query()
      .pipe(map((res: HttpResponse<IInterview[]>) => res.body ?? []))
      .pipe(
        map((interviews: IInterview[]) =>
          this.interviewService.addInterviewToCollectionIfMissing(interviews, this.editForm.get('interview')!.value)
        )
      )
      .subscribe((interviews: IInterview[]) => (this.interviewsSharedCollection = interviews));
  }

  protected createFromForm(): IQuestion {
    return {
      ...new Question(),
      id: this.editForm.get(['id'])!.value,
      questionName: this.editForm.get(['questionName'])!.value,
      question: this.editForm.get(['question'])!.value,
      interview: this.editForm.get(['interview'])!.value,
    };
  }
}
