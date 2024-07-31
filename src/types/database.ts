import type { Collection } from 'mongodb';

export type Details = {
  name: string;
  address: string;
  country: string;
  postalCode: string;
  ICO?: string;
  DIC?: string;
};

export type User = {
  userId: number;
  state:
    | 'free'
    | 'clickUp.privateKey'
    | 'clickUp.teamId'
    | 'clickUp.userId'
    | 'from.name'
    | 'from.address'
    | 'from.country'
    | 'from.postalCode'
    | 'from.ICO'
    | 'from.DIC'
    | 'to.name'
    | 'to.address'
    | 'to.country'
    | 'to.postalCode'
    | 'to.ICO'
    | 'to.DIC'
    | 'bank.name'
    | 'bank.iban'
    | 'bank.bic'
    | 'bank.currency'
    | 'bank.perHour';
  clickUp: {
    privateKey: string;
    teamId: string;
    userId: string;
  };
  from: Details;
  to: Details;
  bank: {
    name: string;
    iban: string;
    bic: string;
    currency: string;
    perHour: string;
  };
};

export interface Database {
  user: Collection<User>;
}
