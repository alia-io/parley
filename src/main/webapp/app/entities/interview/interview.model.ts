import { IQuestion } from 'app/entities/question/question.model';
import { IJob } from 'app/entities/job/job.model';
import { ICandidate } from 'app/entities/candidate/candidate.model';
import { IUsers } from 'app/entities/users/users.model';

export interface IInterview {
  id?: number;
  details?: string | null;
  questions?: IQuestion[] | null;
  jobs?: IJob[] | null;
  candidate?: ICandidate | null;
  users?: IUsers[] | null;
}

export class Interview implements IInterview {
  constructor(
    public id?: number,
    public details?: string | null,
    public questions?: IQuestion[] | null,
    public jobs?: IJob[] | null,
    public candidate?: ICandidate | null,
    public users?: IUsers[] | null
  ) {}
}

export function getInterviewIdentifier(interview: IInterview): number | undefined {
  return interview.id;
}
