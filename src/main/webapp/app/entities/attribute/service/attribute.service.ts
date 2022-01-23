import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAttribute, getAttributeIdentifier } from '../attribute.model';

export type EntityResponseType = HttpResponse<IAttribute>;
export type EntityArrayResponseType = HttpResponse<IAttribute[]>;

@Injectable({ providedIn: 'root' })
export class AttributeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/attributes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(attribute: IAttribute): Observable<EntityResponseType> {
    return this.http.post<IAttribute>(this.resourceUrl, attribute, { observe: 'response' });
  }

  update(attribute: IAttribute): Observable<EntityResponseType> {
    return this.http.put<IAttribute>(`${this.resourceUrl}/${getAttributeIdentifier(attribute) as number}`, attribute, {
      observe: 'response',
    });
  }

  partialUpdate(attribute: IAttribute): Observable<EntityResponseType> {
    return this.http.patch<IAttribute>(`${this.resourceUrl}/${getAttributeIdentifier(attribute) as number}`, attribute, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAttribute>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAttribute[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAttributeToCollectionIfMissing(
    attributeCollection: IAttribute[],
    ...attributesToCheck: (IAttribute | null | undefined)[]
  ): IAttribute[] {
    const attributes: IAttribute[] = attributesToCheck.filter(isPresent);
    if (attributes.length > 0) {
      const attributeCollectionIdentifiers = attributeCollection.map(attributeItem => getAttributeIdentifier(attributeItem)!);
      const attributesToAdd = attributes.filter(attributeItem => {
        const attributeIdentifier = getAttributeIdentifier(attributeItem);
        if (attributeIdentifier == null || attributeCollectionIdentifiers.includes(attributeIdentifier)) {
          return false;
        }
        attributeCollectionIdentifiers.push(attributeIdentifier);
        return true;
      });
      return [...attributesToAdd, ...attributeCollection];
    }
    return attributeCollection;
  }
}
