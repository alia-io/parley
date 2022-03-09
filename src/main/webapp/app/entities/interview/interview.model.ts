import { IQuestion } from 'app/entities/question/question.model';
import { ICandidate } from 'app/entities/candidate/candidate.model';
import { IUsers } from 'app/entities/users/users.model';
import { IJob } from 'app/entities/job/job.model';

export interface IInterview {
  id?: number;
  details?: string | null;
  questions?: IQuestion[] | null;
  candidate?: ICandidate | null;
  users?: IUsers[] | null;
  jobs?: IJob[] | null;
}

export class Interview implements IInterview {
  constructor(
    public id?: number,
    public details?: string | null,
    public questions?: IQuestion[] | null,
    public candidate?: ICandidate | null,
    public users?: IUsers[] | null,
    public jobs?: IJob[] | null
  ) {}
}

export function getInterviewIdentifier(interview: IInterview): number | undefined {
  return interview.id;
}

export interface UserDisplayDTO {
  id: number;
  name: string;
}

export interface NewInterviewDTO {
  userIdList?: number[];
  jobId: number;
  interviewDetails?: string;
  candidateFirstName?: string;
  candidateLastName?: string;
  candidateEmail?: string;
}
