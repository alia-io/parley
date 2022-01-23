import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAttribute } from '../attribute.model';
import { AttributeService } from '../service/attribute.service';
import { AttributeDeleteDialogComponent } from '../delete/attribute-delete-dialog.component';

@Component({
  selector: 'jhi-attribute',
  templateUrl: './attribute.component.html',
})
export class AttributeComponent implements OnInit {
  attributes?: IAttribute[];
  isLoading = false;

  constructor(protected attributeService: AttributeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.attributeService.query().subscribe({
      next: (res: HttpResponse<IAttribute[]>) => {
        this.isLoading = false;
        this.attributes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAttribute): number {
    return item.id!;
  }

  delete(attribute: IAttribute): void {
    const modalRef = this.modalService.open(AttributeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.attribute = attribute;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
