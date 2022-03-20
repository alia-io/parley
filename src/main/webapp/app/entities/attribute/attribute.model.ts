import { IQuestion } from 'app/entities/question/question.model';

export interface IAttribute {
  id?: number;
  attributeName?: string | null;
  description?: string | null;
  questions?: IQuestion[] | null;
}

export class Attribute implements IAttribute {
  constructor(
    public id?: number,
    public attributeName?: string | null,
    public description?: string | null,
    public questions?: IQuestion[] | null
  ) {}
}

export function getAttributeIdentifier(attribute: IAttribute): number | undefined {
  return attribute.id;
}
