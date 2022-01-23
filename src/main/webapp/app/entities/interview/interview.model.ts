import { IQuestion } from 'app/entities/question/question.model';
import { ICandidate } from 'app/entities/candidate/candidate.model';
import { IJob } from 'app/entities/job/job.model';
import { IUsers } from 'app/entities/users/users.model';

export interface IInterview {
  id?: number;
  details?: string | null;
  questions?: IQuestion[] | null;
  candidate?: ICandidate | null;
  job?: IJob | null;
  users?: IUsers[] | null;
}

export class Interview implements IInterview {
  constructor(
    public id?: number,
    public details?: string | null,
    public questions?: IQuestion[] | null,
    public candidate?: ICandidate | null,
    public job?: IJob | null,
    public users?: IUsers[] | null
  ) {}
}

export function getInterviewIdentifier(interview: IInterview): number | undefined {
  return interview.id;
}
