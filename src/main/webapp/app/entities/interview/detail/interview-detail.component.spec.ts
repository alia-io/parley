import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InterviewDetailComponent } from './interview-detail.component';

describe('Interview Management Detail Component', () => {
  let comp: InterviewDetailComponent;
  let fixture: ComponentFixture<InterviewDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterviewDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ interview: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(InterviewDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(InterviewDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load interview on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.interview).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
