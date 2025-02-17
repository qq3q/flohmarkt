import {Transaction} from '../stores/CashPointEventStore/types';

export class TransactionModel {

   constructor(public readonly data: Transaction) {
   }

   static createInstance(transaction: Transaction) {

      return new TransactionModel(transaction);
   }

   get amount(): number {

      return this.data.units.reduce((acc, unit) => acc + unit.amount, 0);
   }
}