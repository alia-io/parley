import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IQuestion } from '../question.model';
import { QuestionService } from '../service/question.service';
import { QuestionDeleteDialogComponent } from '../delete/question-delete-dialog.component';

@Component({
  selector: 'jhi-question',
  templateUrl: './question.component.html',
})
export class QuestionComponent implements OnInit {
  questions?: IQuestion[];
  isLoading = false;

  constructor(protected questionService: QuestionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.questionService.query().subscribe({
      next: (res: HttpResponse<IQuestion[]>) => {
        this.isLoading = false;
        this.questions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IQuestion): number {
    return item.id!;
  }

  delete(question: IQuestion): void {
    const modalRef = this.modalService.open(QuestionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.question = question;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
