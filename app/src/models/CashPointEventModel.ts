import {CashPointEvent, PaymentType} from '../stores/CashPointEventStore/types';
import {TransactionModel}            from './TransactionModel';
import {toCents, toEuros} from '../utils/amount';

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

   get sellerAmounts(): Map<number, number> {
      const map = new Map();
      this.data.transactions.forEach(transaction => {
         transaction.units.forEach(unit => {
            const amount = map.get(unit.sellerId);
            if (amount === undefined) {
               map.set(unit.sellerId, toCents(unit.amount));
            } else {
               map.set(unit.sellerId, toCents(unit.amount) + amount);
            }
         })
      })
      const resMap: Map<number, number> = new Map();
      map.forEach((value, key) => {
         resMap.set(key, toEuros(value));
      })

      return resMap;
   }

   get paymentTypeAmounts(): Map<PaymentType, number> {
      const map = new Map();
      this.transactionModels.forEach(transaction => {
         const amount = map.get(transaction.data.paymentType);
         if (amount === undefined) {
            map.set(transaction.data.paymentType, toCents(transaction.amount));
         } else {
            map.set(transaction.data.paymentType, toCents(transaction.amount) + amount);
         }
      });

      const resMap: Map<PaymentType, number> = new Map();
      map.forEach((value, key) => {
         resMap.set(key, toEuros(value));
      })

      return resMap;
   }
}
