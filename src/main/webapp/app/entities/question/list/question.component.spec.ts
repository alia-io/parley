import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { QuestionService } from '../service/question.service';

import { QuestionComponent } from './question.component';

describe('Question Management Component', () => {
  let comp: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;
  let service: QuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [QuestionComponent],
    })
      .overrideTemplate(QuestionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(QuestionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(QuestionService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.questions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
