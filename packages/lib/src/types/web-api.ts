import { AddressConfig } from './stock';

export interface RateToAddressRes {
  address1: string;
  address2: string;
  rate: string;
  flippedRate: string;
  addressConfig: AddressConfig;
}

export type RatesRes = string[];
