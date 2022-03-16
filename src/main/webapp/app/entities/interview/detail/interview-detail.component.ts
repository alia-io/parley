import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { InterviewDetailsDTO } from '../interview.model';
import { InterviewService } from '../service/interview.service';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'jhi-interview-detail',
  templateUrl: './interview-detail.component.html',
})
export class InterviewDetailComponent implements OnInit {
  interviewDetails!: Observable<InterviewDetailsDTO>;
  private interviewId!: number;

  constructor(protected interviewService: InterviewService, protected activatedRoute: ActivatedRoute, protected router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(take(1)).subscribe(paramMap => (this.interviewId = Number(paramMap.get('id'))));
    console.log('LOG: interview id = ', this.interviewId);

    this.interviewService.getInterviewDetails(this.interviewId).pipe(take(1)).subscribe();
  }

  previousState(): void {
    window.history.back();
  }
}
