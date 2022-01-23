import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IInterview } from '../interview.model';

@Component({
  selector: 'jhi-interview-detail',
  templateUrl: './interview-detail.component.html',
})
export class InterviewDetailComponent implements OnInit {
  interview: IInterview | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ interview }) => {
      this.interview = interview;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
