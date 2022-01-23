import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IJob } from '../job.model';
import { JobService } from '../service/job.service';
import { JobDeleteDialogComponent } from '../delete/job-delete-dialog.component';

@Component({
  selector: 'jhi-job',
  templateUrl: './job.component.html',
})
export class JobComponent implements OnInit {
  jobs?: IJob[];
  isLoading = false;

  constructor(protected jobService: JobService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.jobService.query().subscribe({
      next: (res: HttpResponse<IJob[]>) => {
        this.isLoading = false;
        this.jobs = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IJob): number {
    return item.id!;
  }

  delete(job: IJob): void {
    const modalRef = this.modalService.open(JobDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.job = job;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
