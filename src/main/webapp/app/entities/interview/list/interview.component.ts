import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IInterview } from '../interview.model';
import { InterviewService } from '../service/interview.service';
import { InterviewDeleteDialogComponent } from '../delete/interview-delete-dialog.component';

@Component({
  selector: 'jhi-interview',
  templateUrl: './interview.component.html',
})
export class InterviewComponent implements OnInit {
  interviews?: IInterview[];
  isLoading = false;

  constructor(protected interviewService: InterviewService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.interviewService.query().subscribe({
      next: (res: HttpResponse<IInterview[]>) => {
        this.isLoading = false;
        this.interviews = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IInterview): number {
    return item.id!;
  }

  delete(interview: IInterview): void {
    const modalRef = this.modalService.open(InterviewDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.interview = interview;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
