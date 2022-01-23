import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICandidate } from '../candidate.model';
import { CandidateService } from '../service/candidate.service';
import { CandidateDeleteDialogComponent } from '../delete/candidate-delete-dialog.component';

@Component({
  selector: 'jhi-candidate',
  templateUrl: './candidate.component.html',
})
export class CandidateComponent implements OnInit {
  candidates?: ICandidate[];
  isLoading = false;

  constructor(protected candidateService: CandidateService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.candidateService.query().subscribe({
      next: (res: HttpResponse<ICandidate[]>) => {
        this.isLoading = false;
        this.candidates = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICandidate): number {
    return item.id!;
  }

  delete(candidate: ICandidate): void {
    const modalRef = this.modalService.open(CandidateDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.candidate = candidate;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
