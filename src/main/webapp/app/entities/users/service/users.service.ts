import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUsers, getUsersIdentifier } from '../users.model';

export type EntityResponseType = HttpResponse<IUsers>;
export type EntityArrayResponseType = HttpResponse<IUsers[]>;

@Injectable({ providedIn: 'root' })
export class UsersService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(users: IUsers): Observable<EntityResponseType> {
    return this.http.post<IUsers>(this.resourceUrl, users, { observe: 'response' });
  }

  update(users: IUsers): Observable<EntityResponseType> {
    return this.http.put<IUsers>(`${this.resourceUrl}/${getUsersIdentifier(users) as number}`, users, { observe: 'response' });
  }

  partialUpdate(users: IUsers): Observable<EntityResponseType> {
    return this.http.patch<IUsers>(`${this.resourceUrl}/${getUsersIdentifier(users) as number}`, users, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUsers>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUsers[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUsersToCollectionIfMissing(usersCollection: IUsers[], ...usersToCheck: (IUsers | null | undefined)[]): IUsers[] {
    const users: IUsers[] = usersToCheck.filter(isPresent);
    if (users.length > 0) {
      const usersCollectionIdentifiers = usersCollection.map(usersItem => getUsersIdentifier(usersItem)!);
      const usersToAdd = users.filter(usersItem => {
        const usersIdentifier = getUsersIdentifier(usersItem);
        if (usersIdentifier == null || usersCollectionIdentifiers.includes(usersIdentifier)) {
          return false;
        }
        usersCollectionIdentifiers.push(usersIdentifier);
        return true;
      });
      return [...usersToAdd, ...usersCollection];
    }
    return usersCollection;
  }
}
