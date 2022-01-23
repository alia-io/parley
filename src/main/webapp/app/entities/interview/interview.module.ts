import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { InterviewComponent } from './list/interview.component';
import { InterviewDetailComponent } from './detail/interview-detail.component';
import { InterviewUpdateComponent } from './update/interview-update.component';
import { InterviewDeleteDialogComponent } from './delete/interview-delete-dialog.component';
import { InterviewRoutingModule } from './route/interview-routing.module';

@NgModule({
  imports: [SharedModule, InterviewRoutingModule],
  declarations: [InterviewComponent, InterviewDetailComponent, InterviewUpdateComponent, InterviewDeleteDialogComponent],
  entryComponents: [InterviewDeleteDialogComponent],
})
export class InterviewModule {}
