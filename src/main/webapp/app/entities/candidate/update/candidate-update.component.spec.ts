import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CandidateService } from '../service/candidate.service';
import { ICandidate, Candidate } from '../candidate.model';
import { IInterview } from 'app/entities/interview/interview.model';
import { InterviewService } from 'app/entities/interview/service/interview.service';

import { CandidateUpdateComponent } from './candidate-update.component';

describe('Candidate Management Update Component', () => {
  let comp: CandidateUpdateComponent;
  let fixture: ComponentFixture<CandidateUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let candidateService: CandidateService;
  let interviewService: InterviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CandidateUpdateComponent],
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
      .overrideTemplate(CandidateUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CandidateUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    candidateService = TestBed.inject(CandidateService);
    interviewService = TestBed.inject(InterviewService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call interview query and add missing value', () => {
      const candidate: ICandidate = { id: 456 };
      const interview: IInterview = { id: 42907 };
      candidate.interview = interview;

      const interviewCollection: IInterview[] = [{ id: 69301 }];
      jest.spyOn(interviewService, 'query').mockReturnValue(of(new HttpResponse({ body: interviewCollection })));
      const expectedCollection: IInterview[] = [interview, ...interviewCollection];
      jest.spyOn(interviewService, 'addInterviewToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ candidate });
      comp.ngOnInit();

      expect(interviewService.query).toHaveBeenCalled();
      expect(interviewService.addInterviewToCollectionIfMissing).toHaveBeenCalledWith(interviewCollection, interview);
      expect(comp.interviewsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const candidate: ICandidate = { id: 456 };
      const interview: IInterview = { id: 68628 };
      candidate.interview = interview;

      activatedRoute.data = of({ candidate });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(candidate));
      expect(comp.interviewsCollection).toContain(interview);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Candidate>>();
      const candidate = { id: 123 };
      jest.spyOn(candidateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ candidate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: candidate }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(candidateService.update).toHaveBeenCalledWith(candidate);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Candidate>>();
      const candidate = new Candidate();
      jest.spyOn(candidateService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ candidate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: candidate }));
      saveSubject.complete();

      // THEN
      expect(candidateService.create).toHaveBeenCalledWith(candidate);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Candidate>>();
      const candidate = { id: 123 };
      jest.spyOn(candidateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ candidate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(candidateService.update).toHaveBeenCalledWith(candidate);
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
