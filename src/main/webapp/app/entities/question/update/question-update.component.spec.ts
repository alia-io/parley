import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { QuestionService } from '../service/question.service';
import { IQuestion, Question } from '../question.model';
import { IAttribute } from 'app/entities/attribute/attribute.model';
import { AttributeService } from 'app/entities/attribute/service/attribute.service';

import { QuestionUpdateComponent } from './question-update.component';

describe('Question Management Update Component', () => {
  let comp: QuestionUpdateComponent;
  let fixture: ComponentFixture<QuestionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let questionService: QuestionService;
  let attributeService: AttributeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [QuestionUpdateComponent],
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
      .overrideTemplate(QuestionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(QuestionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    questionService = TestBed.inject(QuestionService);
    attributeService = TestBed.inject(AttributeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Attribute query and add missing value', () => {
      const question: IQuestion = { id: 456 };
      const attributes: IAttribute[] = [{ id: 92612 }];
      question.attributes = attributes;

      const attributeCollection: IAttribute[] = [{ id: 48893 }];
      jest.spyOn(attributeService, 'query').mockReturnValue(of(new HttpResponse({ body: attributeCollection })));
      const additionalAttributes = [...attributes];
      const expectedCollection: IAttribute[] = [...additionalAttributes, ...attributeCollection];
      jest.spyOn(attributeService, 'addAttributeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ question });
      comp.ngOnInit();

      expect(attributeService.query).toHaveBeenCalled();
      expect(attributeService.addAttributeToCollectionIfMissing).toHaveBeenCalledWith(attributeCollection, ...additionalAttributes);
      expect(comp.attributesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const question: IQuestion = { id: 456 };
      const attributes: IAttribute = { id: 62662 };
      question.attributes = [attributes];

      activatedRoute.data = of({ question });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(question));
      expect(comp.attributesSharedCollection).toContain(attributes);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Question>>();
      const question = { id: 123 };
      jest.spyOn(questionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ question });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: question }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(questionService.update).toHaveBeenCalledWith(question);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Question>>();
      const question = new Question();
      jest.spyOn(questionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ question });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: question }));
      saveSubject.complete();

      // THEN
      expect(questionService.create).toHaveBeenCalledWith(question);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Question>>();
      const question = { id: 123 };
      jest.spyOn(questionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ question });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(questionService.update).toHaveBeenCalledWith(question);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAttributeById', () => {
      it('Should return tracked Attribute primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAttributeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedAttribute', () => {
      it('Should return option if no Attribute is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedAttribute(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Attribute for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedAttribute(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Attribute is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedAttribute(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
