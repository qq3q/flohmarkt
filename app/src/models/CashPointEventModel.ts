import {CashPointEvent}   from '../stores/CashPointEventStore/types';
import {TransactionModel} from './TransactionModel';

export class CashPointEventModel {
   private _transactionModels: TransactionModel[] | null = null;

   constructor(public readonly data: CashPointEvent) {
   }

   static createInstance(event: CashPointEvent): CashPointEventModel {

      return new CashPointEventModel(event);
   }

   get transactionModels(): TransactionModel[] {
      if (this._transactionModels === null) {
         this._transactionModels = this.data.transactions.map(TransactionModel.createInstance);
      }

      return this._transactionModels;
   }

   findById(id: number): TransactionModel | null {

      return this.transactionModels.find(model => model.data.id === id) ?? null;
   }
}
