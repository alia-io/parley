import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { InterviewService } from '../service/interview.service';

import { InterviewComponent } from './interview.component';

describe('Interview Management Component', () => {
  let comp: InterviewComponent;
  let fixture: ComponentFixture<InterviewComponent>;
  let service: InterviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [InterviewComponent],
    })
      .overrideTemplate(InterviewComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InterviewComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(InterviewService);

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
    expect(comp.interviews?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
