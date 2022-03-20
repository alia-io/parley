import { IInterview } from 'app/entities/interview/interview.model';

export interface IUsers {
  id?: number;
  firstName?: string;
  lastName?: string;
  interviews?: IInterview[] | null;
}

export class Users implements IUsers {
  constructor(public id?: number, public firstName?: string, public lastName?: string, public interviews?: IInterview[] | null) {}
}

export function getUsersIdentifier(users: IUsers): number | undefined {
  return users.id;
}

export interface UsersDTO {
  id: number;
  firstName: string;
  lastName: string;
}

export interface UsersDisplayDTO {
  id: number;
  firstName: string;
  lastName: string;
  interviewIds?: number[] | null;
}
