import dayjs from 'dayjs/esm';
import { IInterview } from 'app/entities/interview/interview.model';

export interface IJob {
  id?: number;
  jobName?: string | null;
  jobDescription?: string | null;
  postedDate?: dayjs.Dayjs | null;
  jobRole?: string | null;
  minimumQualifications?: string | null;
  responsibilities?: string | null;
  interviews?: IInterview[] | null;
}

export class Job implements IJob {
  constructor(
    public id?: number,
    public jobName?: string | null,
    public jobDescription?: string | null,
    public postedDate?: dayjs.Dayjs | null,
    public jobRole?: string | null,
    public minimumQualifications?: string | null,
    public responsibilities?: string | null,
    public interviews?: IInterview[] | null
  ) {}
}

export function getJobIdentifier(job: IJob): number | undefined {
  return job.id;
}
