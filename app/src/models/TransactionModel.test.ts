import {TransactionModel}  from './TransactionModel';
import {Transaction, Unit} from '../stores/CashPointEventStore/types';

describe('models/TransactionModel', () => {
   describe('createInstance', () => {
      it('should create an instance of TransactionModel', () => {
         const transaction: Transaction = {
            id:          1,
            createdAt:   '2023-10-20',
            paymentType: 'credit' as unknown,
            units:       [{amount: 50}, {amount: 100}],
         } as Transaction;

         const instance = TransactionModel.createInstance(transaction);

         expect(instance).toBeInstanceOf(TransactionModel);
         expect(instance.data).toEqual(transaction);
      });
   });

   describe('amount', () => {
      it('should calculate and return the total amount of all units', () => {
         const transaction: Transaction = {
            id:          1,
            createdAt:   '2023-10-20',
            paymentType: 'credit' as unknown,
            units:       [{amount: 50}, {amount: 100}],
         } as Transaction;

         const instance = new TransactionModel(transaction);

         expect(instance.amount).toBe(150); // 50 + 100
      });

      it('should not recalculate the amount if already computed', () => {
         const transaction: Transaction = {
            id:          1,
            createdAt:   '2023-10-20',
            paymentType: 'credit' as unknown,
            units:       [{amount: 50}, {amount: 100}],
         } as Transaction;

         const instance = new TransactionModel(transaction);

         const firstCall = instance.amount;
         instance.data.units.push({amount: 200} as Unit); // This should not affect the already calculated amount
         const secondCall = instance.amount;

         expect(firstCall).toBe(150); // 50 + 100
         expect(secondCall).toBe(150); // Should stay 150
      });
   });
});
