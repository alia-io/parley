import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { JobService } from '../service/job.service';
import { IJob, Job } from '../job.model';
import { IInterview } from 'app/entities/interview/interview.model';
import { InterviewService } from 'app/entities/interview/service/interview.service';

import { JobUpdateComponent } from './job-update.component';

describe('Job Management Update Component', () => {
  let comp: JobUpdateComponent;
  let fixture: ComponentFixture<JobUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let jobService: JobService;
  let interviewService: InterviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [JobUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(JobUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JobUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    jobService = TestBed.inject(JobService);
    interviewService = TestBed.inject(InterviewService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call interview query and add missing value', () => {
      const job: IJob = { id: 456 };
      const interview: IInterview = { id: 18581 };
      job.interview = interview;

      const interviewCollection: IInterview[] = [{ id: 8678 }];
      jest.spyOn(interviewService, 'query').mockReturnValue(of(new HttpResponse({ body: interviewCollection })));
      const expectedCollection: IInterview[] = [interview, ...interviewCollection];
      jest.spyOn(interviewService, 'addInterviewToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ job });
      comp.ngOnInit();

      expect(interviewService.query).toHaveBeenCalled();
      expect(interviewService.addInterviewToCollectionIfMissing).toHaveBeenCalledWith(interviewCollection, interview);
      expect(comp.interviewsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const job: IJob = { id: 456 };
      const interview: IInterview = { id: 23312 };
      job.interview = interview;

      activatedRoute.data = of({ job });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(job));
      expect(comp.interviewsCollection).toContain(interview);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Job>>();
      const job = { id: 123 };
      jest.spyOn(jobService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ job });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: job }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(jobService.update).toHaveBeenCalledWith(job);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Job>>();
      const job = new Job();
      jest.spyOn(jobService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ job });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: job }));
      saveSubject.complete();

      // THEN
      expect(jobService.create).toHaveBeenCalledWith(job);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Job>>();
      const job = { id: 123 };
      jest.spyOn(jobService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ job });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(jobService.update).toHaveBeenCalledWith(job);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackInterviewById', () => {
      it('Should return tracked Interview primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackInterviewById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
