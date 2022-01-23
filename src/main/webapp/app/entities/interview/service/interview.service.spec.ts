import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInterview, Interview } from '../interview.model';

import { InterviewService } from './interview.service';

describe('Interview Service', () => {
  let service: InterviewService;
  let httpMock: HttpTestingController;
  let elemDefault: IInterview;
  let expectedResult: IInterview | IInterview[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InterviewService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      details: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Interview', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Interview()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Interview', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          details: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Interview', () => {
      const patchObject = Object.assign({}, new Interview());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Interview', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          details: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Interview', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addInterviewToCollectionIfMissing', () => {
      it('should add a Interview to an empty array', () => {
        const interview: IInterview = { id: 123 };
        expectedResult = service.addInterviewToCollectionIfMissing([], interview);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(interview);
      });

      it('should not add a Interview to an array that contains it', () => {
        const interview: IInterview = { id: 123 };
        const interviewCollection: IInterview[] = [
          {
            ...interview,
          },
          { id: 456 },
        ];
        expectedResult = service.addInterviewToCollectionIfMissing(interviewCollection, interview);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Interview to an array that doesn't contain it", () => {
        const interview: IInterview = { id: 123 };
        const interviewCollection: IInterview[] = [{ id: 456 }];
        expectedResult = service.addInterviewToCollectionIfMissing(interviewCollection, interview);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(interview);
      });

      it('should add only unique Interview to an array', () => {
        const interviewArray: IInterview[] = [{ id: 123 }, { id: 456 }, { id: 97310 }];
        const interviewCollection: IInterview[] = [{ id: 123 }];
        expectedResult = service.addInterviewToCollectionIfMissing(interviewCollection, ...interviewArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const interview: IInterview = { id: 123 };
        const interview2: IInterview = { id: 456 };
        expectedResult = service.addInterviewToCollectionIfMissing([], interview, interview2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(interview);
        expect(expectedResult).toContain(interview2);
      });

      it('should accept null and undefined values', () => {
        const interview: IInterview = { id: 123 };
        expectedResult = service.addInterviewToCollectionIfMissing([], null, interview, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(interview);
      });

      it('should return initial array if no Interview is added', () => {
        const interviewCollection: IInterview[] = [{ id: 123 }];
        expectedResult = service.addInterviewToCollectionIfMissing(interviewCollection, undefined, null);
        expect(expectedResult).toEqual(interviewCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
