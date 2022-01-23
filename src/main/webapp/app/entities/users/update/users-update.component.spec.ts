import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UsersService } from '../service/users.service';
import { IUsers, Users } from '../users.model';
import { IInterview } from 'app/entities/interview/interview.model';
import { InterviewService } from 'app/entities/interview/service/interview.service';

import { UsersUpdateComponent } from './users-update.component';

describe('Users Management Update Component', () => {
  let comp: UsersUpdateComponent;
  let fixture: ComponentFixture<UsersUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let usersService: UsersService;
  let interviewService: InterviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UsersUpdateComponent],
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
      .overrideTemplate(UsersUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UsersUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    usersService = TestBed.inject(UsersService);
    interviewService = TestBed.inject(InterviewService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Interview query and add missing value', () => {
      const users: IUsers = { id: 456 };
      const interviews: IInterview[] = [{ id: 16994 }];
      users.interviews = interviews;

      const interviewCollection: IInterview[] = [{ id: 44077 }];
      jest.spyOn(interviewService, 'query').mockReturnValue(of(new HttpResponse({ body: interviewCollection })));
      const additionalInterviews = [...interviews];
      const expectedCollection: IInterview[] = [...additionalInterviews, ...interviewCollection];
      jest.spyOn(interviewService, 'addInterviewToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ users });
      comp.ngOnInit();

      expect(interviewService.query).toHaveBeenCalled();
      expect(interviewService.addInterviewToCollectionIfMissing).toHaveBeenCalledWith(interviewCollection, ...additionalInterviews);
      expect(comp.interviewsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const users: IUsers = { id: 456 };
      const interviews: IInterview = { id: 93365 };
      users.interviews = [interviews];

      activatedRoute.data = of({ users });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(users));
      expect(comp.interviewsSharedCollection).toContain(interviews);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Users>>();
      const users = { id: 123 };
      jest.spyOn(usersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ users });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: users }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(usersService.update).toHaveBeenCalledWith(users);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Users>>();
      const users = new Users();
      jest.spyOn(usersService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ users });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: users }));
      saveSubject.complete();

      // THEN
      expect(usersService.create).toHaveBeenCalledWith(users);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Users>>();
      const users = { id: 123 };
      jest.spyOn(usersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ users });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(usersService.update).toHaveBeenCalledWith(users);
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

  describe('Getting selected relationships', () => {
    describe('getSelectedInterview', () => {
      it('Should return option if no Interview is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedInterview(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Interview for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedInterview(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Interview is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedInterview(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
