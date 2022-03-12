import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, take } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInterview, getInterviewIdentifier, UserDisplayDTO, NewInterviewDTO } from '../interview.model';

export type EntityResponseType = HttpResponse<IInterview>;
export type EntityArrayResponseType = HttpResponse<IInterview[]>;

@Injectable({ providedIn: 'root' })
export class InterviewService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/interviews');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(interview: IInterview): Observable<EntityResponseType> {
    return this.http.post<IInterview>(this.resourceUrl, interview, { observe: 'response' });
  }

  createInterview(newInterview: NewInterviewDTO): void {
    this.http.post<NewInterviewDTO>(`${this.resourceUrl}/new`, newInterview).pipe(take(1)).subscribe();
  }

  update(interview: IInterview): Observable<EntityResponseType> {
    return this.http.put<IInterview>(`${this.resourceUrl}/${getInterviewIdentifier(interview) as number}`, interview, {
      observe: 'response',
    });
  }

  partialUpdate(interview: IInterview): Observable<EntityResponseType> {
    return this.http.patch<IInterview>(`${this.resourceUrl}/${getInterviewIdentifier(interview) as number}`, interview, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInterview>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInterview[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addInterviewToCollectionIfMissing(
    interviewCollection: IInterview[],
    ...interviewsToCheck: (IInterview | null | undefined)[]
  ): IInterview[] {
    const interviews: IInterview[] = interviewsToCheck.filter(isPresent);
    if (interviews.length > 0) {
      const interviewCollectionIdentifiers = interviewCollection.map(interviewItem => getInterviewIdentifier(interviewItem)!);
      const interviewsToAdd = interviews.filter(interviewItem => {
        const interviewIdentifier = getInterviewIdentifier(interviewItem);
        if (interviewIdentifier == null || interviewCollectionIdentifiers.includes(interviewIdentifier)) {
          return false;
        }
        interviewCollectionIdentifiers.push(interviewIdentifier);
        return true;
      });
      return [...interviewsToAdd, ...interviewCollection];
    }
    return interviewCollection;
  }

  getUserList(): Observable<UserDisplayDTO[]> {
    return this.http.get<UserDisplayDTO[]>(`${this.resourceUrl}/user_list`);
  }
}
