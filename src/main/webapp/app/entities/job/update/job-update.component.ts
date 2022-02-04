import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IJob, Job } from '../job.model';
import { JobService } from '../service/job.service';
import { IInterview } from 'app/entities/interview/interview.model';
import { InterviewService } from 'app/entities/interview/service/interview.service';

@Component({
  selector: 'jhi-job-update',
  templateUrl: './job-update.component.html',
})
export class JobUpdateComponent implements OnInit {
  isSaving = false;

  interviewsSharedCollection: IInterview[] = [];

  editForm = this.fb.group({
    id: [],
    jobName: [],
    jobDescription: [],
    postedDate: [],
    jobRole: [],
    minimumQualifications: [],
    responsibilities: [],
    interview: [],
  });

  constructor(
    protected jobService: JobService,
    protected interviewService: InterviewService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ job }) => {
      if (job.id === undefined) {
        const today = dayjs().startOf('day');
        job.postedDate = today;
      }

      this.updateForm(job);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const job = this.createFromForm();
    if (job.id !== undefined) {
      this.subscribeToSaveResponse(this.jobService.update(job));
    } else {
      this.subscribeToSaveResponse(this.jobService.create(job));
    }
  }

  trackInterviewById(index: number, item: IInterview): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJob>>): void {
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

  protected updateForm(job: IJob): void {
    this.editForm.patchValue({
      id: job.id,
      jobName: job.jobName,
      jobDescription: job.jobDescription,
      postedDate: job.postedDate ? job.postedDate.format(DATE_TIME_FORMAT) : null,
      jobRole: job.jobRole,
      minimumQualifications: job.minimumQualifications,
      responsibilities: job.responsibilities,
      interview: job.interview,
    });

    this.interviewsSharedCollection = this.interviewService.addInterviewToCollectionIfMissing(
      this.interviewsSharedCollection,
      job.interview
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

  protected createFromForm(): IJob {
    return {
      ...new Job(),
      id: this.editForm.get(['id'])!.value,
      jobName: this.editForm.get(['jobName'])!.value,
      jobDescription: this.editForm.get(['jobDescription'])!.value,
      postedDate: this.editForm.get(['postedDate'])!.value ? dayjs(this.editForm.get(['postedDate'])!.value, DATE_TIME_FORMAT) : undefined,
      jobRole: this.editForm.get(['jobRole'])!.value,
      minimumQualifications: this.editForm.get(['minimumQualifications'])!.value,
      responsibilities: this.editForm.get(['responsibilities'])!.value,
      interview: this.editForm.get(['interview'])!.value,
    };
  }
}
