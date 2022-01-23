import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJob, getJobIdentifier } from '../job.model';

export type EntityResponseType = HttpResponse<IJob>;
export type EntityArrayResponseType = HttpResponse<IJob[]>;

@Injectable({ providedIn: 'root' })
export class JobService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/jobs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(job: IJob): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(job);
    return this.http
      .post<IJob>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(job: IJob): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(job);
    return this.http
      .put<IJob>(`${this.resourceUrl}/${getJobIdentifier(job) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(job: IJob): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(job);
    return this.http
      .patch<IJob>(`${this.resourceUrl}/${getJobIdentifier(job) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IJob>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IJob[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addJobToCollectionIfMissing(jobCollection: IJob[], ...jobsToCheck: (IJob | null | undefined)[]): IJob[] {
    const jobs: IJob[] = jobsToCheck.filter(isPresent);
    if (jobs.length > 0) {
      const jobCollectionIdentifiers = jobCollection.map(jobItem => getJobIdentifier(jobItem)!);
      const jobsToAdd = jobs.filter(jobItem => {
        const jobIdentifier = getJobIdentifier(jobItem);
        if (jobIdentifier == null || jobCollectionIdentifiers.includes(jobIdentifier)) {
          return false;
        }
        jobCollectionIdentifiers.push(jobIdentifier);
        return true;
      });
      return [...jobsToAdd, ...jobCollection];
    }
    return jobCollection;
  }

  protected convertDateFromClient(job: IJob): IJob {
    return Object.assign({}, job, {
      postedDate: job.postedDate?.isValid() ? job.postedDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.postedDate = res.body.postedDate ? dayjs(res.body.postedDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((job: IJob) => {
        job.postedDate = job.postedDate ? dayjs(job.postedDate) : undefined;
      });
    }
    return res;
  }
}
