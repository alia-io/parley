import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICandidate, Candidate } from '../candidate.model';
import { CandidateService } from '../service/candidate.service';
import { IInterview } from 'app/entities/interview/interview.model';
import { InterviewService } from 'app/entities/interview/service/interview.service';

@Component({
  selector: 'jhi-candidate-update',
  templateUrl: './candidate-update.component.html',
})
export class CandidateUpdateComponent implements OnInit {
  isSaving = false;

  interviewsCollection: IInterview[] = [];

  editForm = this.fb.group({
    id: [],
    firstName: [null, [Validators.required, Validators.maxLength(20)]],
    lastName: [null, [Validators.required, Validators.maxLength(20)]],
    email: [null, [Validators.required, Validators.maxLength(20)]],
    interview: [],
  });

  constructor(
    protected candidateService: CandidateService,
    protected interviewService: InterviewService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ candidate }) => {
      this.updateForm(candidate);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const candidate = this.createFromForm();
    if (candidate.id !== undefined) {
      this.subscribeToSaveResponse(this.candidateService.update(candidate));
    } else {
      this.subscribeToSaveResponse(this.candidateService.create(candidate));
    }
  }

  trackInterviewById(index: number, item: IInterview): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICandidate>>): void {
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

  protected updateForm(candidate: ICandidate): void {
    this.editForm.patchValue({
      id: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      interview: candidate.interview,
    });

    this.interviewsCollection = this.interviewService.addInterviewToCollectionIfMissing(this.interviewsCollection, candidate.interview);
  }

  protected loadRelationshipsOptions(): void {
    this.interviewService
      .query({ filter: 'candidate-is-null' })
      .pipe(map((res: HttpResponse<IInterview[]>) => res.body ?? []))
      .pipe(
        map((interviews: IInterview[]) =>
          this.interviewService.addInterviewToCollectionIfMissing(interviews, this.editForm.get('interview')!.value)
        )
      )
      .subscribe((interviews: IInterview[]) => (this.interviewsCollection = interviews));
  }

  protected createFromForm(): ICandidate {
    return {
      ...new Candidate(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      email: this.editForm.get(['email'])!.value,
      interview: this.editForm.get(['interview'])!.value,
    };
  }
}
