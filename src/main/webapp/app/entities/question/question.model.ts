import { IAttribute } from 'app/entities/attribute/attribute.model';
import { IInterview } from 'app/entities/interview/interview.model';

export interface IQuestion {
  id?: number;
  questionName?: string | null;
  question?: string | null;
  attributes?: IAttribute[] | null;
  interviews?: IInterview[] | null;
}

export class Question implements IQuestion {
  constructor(
    public id?: number,
    public questionName?: string | null,
    public question?: string | null,
    public attributes?: IAttribute[] | null,
    public interviews?: IInterview[] | null
  ) {}
}

export function getQuestionIdentifier(question: IQuestion): number | undefined {
  return question.id;
}

export interface QuestionDTO {
  id?: number;
  questionName?: string | null;
  question?: string | null;
}

export interface AttributeDTO {
  id: number;
  attributeName: string;
  description: string;
}

export interface NewQuestionDTO {
  questionName: string;
  question?: string | null;
  attributes?: AttributeDTO[] | null;
}

export interface QuestionAttributesDTO {
  interviewId?: number;
  question: QuestionDTO;
  attributes: AttributeDTO[];
}
