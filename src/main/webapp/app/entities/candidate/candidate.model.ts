import { IInterview } from 'app/entities/interview/interview.model';

export interface ICandidate {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  interview?: IInterview | null;
}

export class Candidate implements ICandidate {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public interview?: IInterview | null
  ) {}
}

export function getCandidateIdentifier(candidate: ICandidate): number | undefined {
  return candidate.id;
}
