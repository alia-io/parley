import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IInterview, InterviewSummaryDTO } from '../interview.model';
import { InterviewService } from '../service/interview.service';
import { InterviewDeleteDialogComponent } from '../delete/interview-delete-dialog.component';
import { take } from 'rxjs';

@Component({
  selector: 'jhi-interview',
  templateUrl: './interview.component.html',
})
export class InterviewComponent implements OnInit {
  interviews!: InterviewSummaryDTO[];
  isLoading = false;
  interview!: IInterview;

  constructor(protected interviewService: InterviewService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;
    this.interviewService
      .getAllInterviews()
      .pipe(take(1))
      .subscribe(interviewList => {
        this.interviews = interviewList;
        this.isLoading = false;
      });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: InterviewSummaryDTO): number {
    return item.interviewId;
  }

  delete(id: number): void {
    const modalRef = this.modalService.open(InterviewDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.interviewId = id;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
