import {Unit} from '../CashPointEventStore/types';

export type SubscriberCallback = (units: Unit[]) => void;