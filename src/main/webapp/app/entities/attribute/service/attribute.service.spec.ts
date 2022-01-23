import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAttribute, Attribute } from '../attribute.model';

import { AttributeService } from './attribute.service';

describe('Attribute Service', () => {
  let service: AttributeService;
  let httpMock: HttpTestingController;
  let elemDefault: IAttribute;
  let expectedResult: IAttribute | IAttribute[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AttributeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      attributeName: 'AAAAAAA',
      description: 'AAAAAAA',
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

    it('should create a Attribute', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Attribute()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Attribute', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          attributeName: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Attribute', () => {
      const patchObject = Object.assign(
        {
          attributeName: 'BBBBBB',
        },
        new Attribute()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Attribute', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          attributeName: 'BBBBBB',
          description: 'BBBBBB',
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

    it('should delete a Attribute', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAttributeToCollectionIfMissing', () => {
      it('should add a Attribute to an empty array', () => {
        const attribute: IAttribute = { id: 123 };
        expectedResult = service.addAttributeToCollectionIfMissing([], attribute);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(attribute);
      });

      it('should not add a Attribute to an array that contains it', () => {
        const attribute: IAttribute = { id: 123 };
        const attributeCollection: IAttribute[] = [
          {
            ...attribute,
          },
          { id: 456 },
        ];
        expectedResult = service.addAttributeToCollectionIfMissing(attributeCollection, attribute);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Attribute to an array that doesn't contain it", () => {
        const attribute: IAttribute = { id: 123 };
        const attributeCollection: IAttribute[] = [{ id: 456 }];
        expectedResult = service.addAttributeToCollectionIfMissing(attributeCollection, attribute);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(attribute);
      });

      it('should add only unique Attribute to an array', () => {
        const attributeArray: IAttribute[] = [{ id: 123 }, { id: 456 }, { id: 10983 }];
        const attributeCollection: IAttribute[] = [{ id: 123 }];
        expectedResult = service.addAttributeToCollectionIfMissing(attributeCollection, ...attributeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const attribute: IAttribute = { id: 123 };
        const attribute2: IAttribute = { id: 456 };
        expectedResult = service.addAttributeToCollectionIfMissing([], attribute, attribute2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(attribute);
        expect(expectedResult).toContain(attribute2);
      });

      it('should accept null and undefined values', () => {
        const attribute: IAttribute = { id: 123 };
        expectedResult = service.addAttributeToCollectionIfMissing([], null, attribute, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(attribute);
      });

      it('should return initial array if no Attribute is added', () => {
        const attributeCollection: IAttribute[] = [{ id: 123 }];
        expectedResult = service.addAttributeToCollectionIfMissing(attributeCollection, undefined, null);
        expect(expectedResult).toEqual(attributeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
