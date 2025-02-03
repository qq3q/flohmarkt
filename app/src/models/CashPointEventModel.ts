import {CashPointEvent}   from '../stores/CashPointEventStore/types';
import {TransactionModel} from './TransactionModel';

export class CashPointEventModel {
   constructor(public readonly data: CashPointEvent) {
   }

   static createInstance(event: CashPointEvent): CashPointEventModel {

      return new CashPointEventModel(event);
   }

   get transactionModels(): TransactionModel[] {

     return this.data.transactions.map(TransactionModel.createInstance);
   }

   findById(id: number): TransactionModel | null {

      return this.transactionModels.find(model => model.data.id === id) ?? null;
   }
}
