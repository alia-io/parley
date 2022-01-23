import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AttributeDetailComponent } from './attribute-detail.component';

describe('Attribute Management Detail Component', () => {
  let comp: AttributeDetailComponent;
  let fixture: ComponentFixture<AttributeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttributeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ attribute: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AttributeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AttributeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load attribute on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.attribute).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
