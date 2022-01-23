import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'interview',
        data: { pageTitle: 'Interviews' },
        loadChildren: () => import('./interview/interview.module').then(m => m.InterviewModule),
      },
      {
        path: 'question',
        data: { pageTitle: 'Questions' },
        loadChildren: () => import('./question/question.module').then(m => m.QuestionModule),
      },
      {
        path: 'attribute',
        data: { pageTitle: 'Attributes' },
        loadChildren: () => import('./attribute/attribute.module').then(m => m.AttributeModule),
      },
      {
        path: 'users',
        data: { pageTitle: 'Users' },
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
      },
      {
        path: 'job',
        data: { pageTitle: 'Jobs' },
        loadChildren: () => import('./job/job.module').then(m => m.JobModule),
      },
      {
        path: 'candidate',
        data: { pageTitle: 'Candidates' },
        loadChildren: () => import('./candidate/candidate.module').then(m => m.CandidateModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
