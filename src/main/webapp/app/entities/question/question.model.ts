import { IAttribute } from 'app/entities/attribute/attribute.model';
import { IInterview } from 'app/entities/interview/interview.model';

export interface IQuestion {
  id?: number;
  questionName?: string | null;
  question?: string | null;
  attributes?: IAttribute[] | null;
  interview?: IInterview | null;
}

export class Question implements IQuestion {
  constructor(
    public id?: number,
    public questionName?: string | null,
    public question?: string | null,
    public attributes?: IAttribute[] | null,
    public interview?: IInterview | null
  ) {}
}

export function getQuestionIdentifier(question: IQuestion): number | undefined {
  return question.id;
}
