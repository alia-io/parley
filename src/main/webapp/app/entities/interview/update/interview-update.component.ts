import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IInterview, Interview } from '../interview.model';
import { InterviewService } from '../service/interview.service';

@Component({
  selector: 'jhi-interview-update',
  templateUrl: './interview-update.component.html',
})
export class InterviewUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    details: [],
  });

  constructor(protected interviewService: InterviewService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ interview }) => {
      this.updateForm(interview);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const interview = this.createFromForm();
    if (interview.id !== undefined) {
      this.subscribeToSaveResponse(this.interviewService.update(interview));
    } else {
      this.subscribeToSaveResponse(this.interviewService.create(interview));
    }
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

  protected updateForm(interview: IInterview): void {
    this.editForm.patchValue({
      id: interview.id,
      details: interview.details,
    });
  }

  protected createFromForm(): IInterview {
    return {
      ...new Interview(),
      id: this.editForm.get(['id'])!.value,
      details: this.editForm.get(['details'])!.value,
    };
  }
}
