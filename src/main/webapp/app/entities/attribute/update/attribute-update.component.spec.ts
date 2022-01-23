import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AttributeService } from '../service/attribute.service';
import { IAttribute, Attribute } from '../attribute.model';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';

import { AttributeUpdateComponent } from './attribute-update.component';

describe('Attribute Management Update Component', () => {
  let comp: AttributeUpdateComponent;
  let fixture: ComponentFixture<AttributeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let attributeService: AttributeService;
  let questionService: QuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AttributeUpdateComponent],
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
      .overrideTemplate(AttributeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AttributeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    attributeService = TestBed.inject(AttributeService);
    questionService = TestBed.inject(QuestionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Question query and add missing value', () => {
      const attribute: IAttribute = { id: 456 };
      const questions: IQuestion = { id: 10093 };
      attribute.questions = questions;

      const questionCollection: IQuestion[] = [{ id: 7040 }];
      jest.spyOn(questionService, 'query').mockReturnValue(of(new HttpResponse({ body: questionCollection })));
      const additionalQuestions = [questions];
      const expectedCollection: IQuestion[] = [...additionalQuestions, ...questionCollection];
      jest.spyOn(questionService, 'addQuestionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ attribute });
      comp.ngOnInit();

      expect(questionService.query).toHaveBeenCalled();
      expect(questionService.addQuestionToCollectionIfMissing).toHaveBeenCalledWith(questionCollection, ...additionalQuestions);
      expect(comp.questionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const attribute: IAttribute = { id: 456 };
      const questions: IQuestion = { id: 99830 };
      attribute.questions = questions;

      activatedRoute.data = of({ attribute });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(attribute));
      expect(comp.questionsSharedCollection).toContain(questions);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Attribute>>();
      const attribute = { id: 123 };
      jest.spyOn(attributeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attribute });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: attribute }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(attributeService.update).toHaveBeenCalledWith(attribute);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Attribute>>();
      const attribute = new Attribute();
      jest.spyOn(attributeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attribute });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: attribute }));
      saveSubject.complete();

      // THEN
      expect(attributeService.create).toHaveBeenCalledWith(attribute);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Attribute>>();
      const attribute = { id: 123 };
      jest.spyOn(attributeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attribute });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(attributeService.update).toHaveBeenCalledWith(attribute);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackQuestionById', () => {
      it('Should return tracked Question primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackQuestionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
