import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUsers, Users } from '../users.model';
import { UsersService } from '../service/users.service';
import { IInterview } from 'app/entities/interview/interview.model';
import { InterviewService } from 'app/entities/interview/service/interview.service';

@Component({
  selector: 'jhi-users-update',
  templateUrl: './users-update.component.html',
})
export class UsersUpdateComponent implements OnInit {
  isSaving = false;

  interviewsSharedCollection: IInterview[] = [];

  editForm = this.fb.group({
    id: [],
    firstName: [null, [Validators.required, Validators.maxLength(20)]],
    lastName: [null, [Validators.required, Validators.maxLength(20)]],
    interviews: [],
  });

  constructor(
    protected usersService: UsersService,
    protected interviewService: InterviewService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ users }) => {
      this.updateForm(users);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const users = this.createFromForm();
    if (users.id !== undefined) {
      this.subscribeToSaveResponse(this.usersService.update(users));
    } else {
      this.subscribeToSaveResponse(this.usersService.create(users));
    }
  }

  trackInterviewById(index: number, item: IInterview): number {
    return item.id!;
  }

  getSelectedInterview(option: IInterview, selectedVals?: IInterview[]): IInterview {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUsers>>): void {
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

  protected updateForm(users: IUsers): void {
    this.editForm.patchValue({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      interviews: users.interviews,
    });

    this.interviewsSharedCollection = this.interviewService.addInterviewToCollectionIfMissing(
      this.interviewsSharedCollection,
      ...(users.interviews ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.interviewService
      .query()
      .pipe(map((res: HttpResponse<IInterview[]>) => res.body ?? []))
      .pipe(
        map((interviews: IInterview[]) =>
          this.interviewService.addInterviewToCollectionIfMissing(interviews, ...(this.editForm.get('interviews')!.value ?? []))
        )
      )
      .subscribe((interviews: IInterview[]) => (this.interviewsSharedCollection = interviews));
  }

  protected createFromForm(): IUsers {
    return {
      ...new Users(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      interviews: this.editForm.get(['interviews'])!.value,
    };
  }
}
