import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAttribute } from '../attribute.model';

@Component({
  selector: 'jhi-attribute-detail',
  templateUrl: './attribute-detail.component.html',
})
export class AttributeDetailComponent implements OnInit {
  attribute: IAttribute | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ attribute }) => {
      this.attribute = attribute;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
