import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AttributeService } from '../service/attribute.service';
import { IAttribute, Attribute } from '../attribute.model';

import { AttributeUpdateComponent } from './attribute-update.component';

describe('Attribute Management Update Component', () => {
  let comp: AttributeUpdateComponent;
  let fixture: ComponentFixture<AttributeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let attributeService: AttributeService;

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

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const attribute: IAttribute = { id: 456 };

      activatedRoute.data = of({ attribute });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(attribute));
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
});
