import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CandidateService } from '../service/candidate.service';

import { CandidateComponent } from './candidate.component';

describe('Candidate Management Component', () => {
  let comp: CandidateComponent;
  let fixture: ComponentFixture<CandidateComponent>;
  let service: CandidateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CandidateComponent],
    })
      .overrideTemplate(CandidateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CandidateComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CandidateService);

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
    expect(comp.candidates?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
