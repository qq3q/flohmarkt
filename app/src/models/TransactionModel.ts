import {Transaction} from '../stores/CashPointEventStore/types';

export class TransactionModel {
   private _amount: number | null = null;

   constructor(public readonly data: Transaction) {
   }

   static createInstance(transaction: Transaction) {

      return new TransactionModel(transaction);
   }

   get amount(): number {
      if (this._amount === null) {
         this._amount = this.data.units.reduce((acc, unit) => acc + unit.amount, 0);
      }

      return this._amount;
   }
}