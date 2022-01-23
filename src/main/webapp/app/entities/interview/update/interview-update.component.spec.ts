import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InterviewService } from '../service/interview.service';
import { IInterview, Interview } from '../interview.model';

import { InterviewUpdateComponent } from './interview-update.component';

describe('Interview Management Update Component', () => {
  let comp: InterviewUpdateComponent;
  let fixture: ComponentFixture<InterviewUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let interviewService: InterviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [InterviewUpdateComponent],
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
      .overrideTemplate(InterviewUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InterviewUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    interviewService = TestBed.inject(InterviewService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const interview: IInterview = { id: 456 };

      activatedRoute.data = of({ interview });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(interview));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Interview>>();
      const interview = { id: 123 };
      jest.spyOn(interviewService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ interview });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: interview }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(interviewService.update).toHaveBeenCalledWith(interview);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Interview>>();
      const interview = new Interview();
      jest.spyOn(interviewService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ interview });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: interview }));
      saveSubject.complete();

      // THEN
      expect(interviewService.create).toHaveBeenCalledWith(interview);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Interview>>();
      const interview = { id: 123 };
      jest.spyOn(interviewService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ interview });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(interviewService.update).toHaveBeenCalledWith(interview);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
