import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { InterviewDetailsDTO } from '../interview.model';
import { InterviewService } from '../service/interview.service';
import { take } from 'rxjs';
import { UsersDTO } from '../../users/users.model';

@Component({
  selector: 'jhi-interview-detail',
  templateUrl: './interview-detail.component.html',
})
export class InterviewDetailComponent implements OnInit {
  interviewDetails!: InterviewDetailsDTO;
  usersList!: UsersDTO[];
  private interviewId!: number;

  constructor(protected interviewService: InterviewService, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(take(1)).subscribe(paramMap => (this.interviewId = Number(paramMap.get('id'))));
    this.interviewService
      .getInterviewDetails(this.interviewId)
      .pipe(take(1))
      .subscribe(interview => (this.interviewDetails = interview));
    this.interviewService
      .getInterviewUsersList(this.interviewId)
      .pipe(take(1))
      .subscribe(users => (this.usersList = users));
  }

  previousState(): void {
    window.history.back();
  }
}
