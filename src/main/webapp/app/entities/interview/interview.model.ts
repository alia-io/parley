import { IQuestion, QuestionAttributesDTO } from 'app/entities/question/question.model';
import { CandidateDTO, ICandidate } from 'app/entities/candidate/candidate.model';
import { IUsers, UsersDTO } from 'app/entities/users/users.model';
import { IJob, JobDTO } from 'app/entities/job/job.model';

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

export interface InterviewDTO {
  id?: number;
  details?: string | null;
}

export interface NewInterviewDTO {
  userIdList?: number[] | null;
  jobId?: number | null;
  interviewDetails?: string | null;
  candidateFirstName?: string | null;
  candidateLastName?: string | null;
  candidateEmail?: string | null;
}

export interface InterviewDetailsDTO {
  interview?: InterviewDTO | null;
  candidate?: CandidateDTO | null;
  job?: JobDTO | null;
  userList?: UsersDTO[] | null;
  questionList?: QuestionAttributesDTO[] | null;
}
