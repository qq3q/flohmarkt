import {CashPointEventModel}               from './CashPointEventModel';
import {TransactionModel}                               from './TransactionModel';
import {CashPointEvent, PaymentType, Transaction, Unit} from '../stores/CashPointEventStore/types';

describe('models/CashPointEventModel', () => {
   describe('createInstance', () => {
      it('should create an instance of CashPointEventModel', () => {
         const mockEvent = {
            title:        'Sample Event',
            donationRate: 10,
            transactions: [],
         };

         const instance = CashPointEventModel.createInstance(mockEvent);

         expect(instance).toBeInstanceOf(CashPointEventModel);
         expect(instance.data).toEqual(mockEvent);
      });
   });

   describe('transactionModels', () => {
      it('should initialize transaction models', () => {
         const mockEvent: CashPointEvent = {
            title:        'Sample Event',
            donationRate: 10,
            transactions: [{
               id:    1,
               units: [{amount: 100} as Unit]
            } as Transaction],
         };

         const instance = new CashPointEventModel(mockEvent);

         const transactionModels = instance.transactionModels;

         expect(transactionModels).toHaveLength(1);
         expect(transactionModels[0]).toBeInstanceOf(TransactionModel);
         expect(transactionModels[0].data).toEqual(mockEvent.transactions[0]);
      });
   });

   describe('findById', () => {
      it('should return a transaction by the given id', () => {
         const mockEvent: CashPointEvent = {
            title:        'Sample Event',
            donationRate: 10,
            transactions: [
               {
                  id:    1,
                  units: [{amount: 100} as Unit]
               } as Transaction,
               {
                  id:    2,
                  units: [{amount: 200} as Unit]
               } as Transaction,
            ],
         };

         const instance = new CashPointEventModel(mockEvent);

         const foundTransaction = instance.findById(2);

         expect(foundTransaction).not.toBeNull();
         expect(foundTransaction).toBeInstanceOf(TransactionModel);
         expect(foundTransaction?.data.id).toBe(2);
      });

      it('should return null if no transaction is found with the given id', () => {
         const mockEvent: CashPointEvent = {
            title:        'Sample Event',
            donationRate: 10,
            transactions: [{
               id:    1,
               units: [{amount: 100} as Unit]
            } as Transaction],
         };

         const instance = new CashPointEventModel(mockEvent);

         const foundTransaction = instance.findById(999);

         expect(foundTransaction).toBeNull();
      });
   });

   describe('sellerAmounts', () => {
      it('should return a map of seller amounts', () => {
         const mockEvent: CashPointEvent = {
            transactions: [
               {
                  units: [
                     {sellerId: 1, amount: 100.01} as Unit,
                     {sellerId: 2, amount: 10.02} as Unit,
                  ]
               } as Transaction,
               {
                  units: [
                     {sellerId: 2, amount: 200.11} as Unit,
                     {sellerId: 3, amount: 20.12} as Unit,
                  ]
               } as Transaction,
            ],
         } as CashPointEvent;

         const instance = new CashPointEventModel(mockEvent);

         const sellerAmounts = instance.sellerAmounts;

         expect(sellerAmounts).toBeInstanceOf(Map);
         expect(sellerAmounts.size).toBe(3);
         expect(sellerAmounts.get(1)).toBe(100.01);
         expect(sellerAmounts.get(2)).toBe(210.13);
         expect(sellerAmounts.get(3)).toBe(20.12);
      });
   });

   describe('paymentTypeAmounts', () => {
      it('should return a map of payment type amounts', () => {
         const mockEvent: CashPointEvent = {
            transactions: [
               {
                  paymentType: 'credit' as unknown,
                  units: [
                     {sellerId: 1, amount: 100.01} as Unit,
                     {sellerId: 2, amount: 10.02} as Unit,
                  ]
               } as Transaction,
               {
                  paymentType: 'credit' as unknown,
                  units: [
                     {sellerId: 3, amount: 20.12} as Unit,
                  ]
               } as Transaction,
               {
                  paymentType: 'cash' as unknown,
                  units: [
                     {sellerId: 2, amount: 300.11} as Unit,
                     {sellerId: 3, amount: 30.12} as Unit,
                  ]
               } as Transaction,
            ],
         } as CashPointEvent;

         const instance = new CashPointEventModel(mockEvent);

         const paymentTypeAmounts = instance.paymentTypeAmounts;

         expect(paymentTypeAmounts).toBeInstanceOf(Map);
         expect(paymentTypeAmounts.size).toBe(2);
         expect(paymentTypeAmounts.get('credit' as unknown as PaymentType)).toBe(130.15);
         expect(paymentTypeAmounts.get('cash' as unknown as PaymentType)).toBe(330.23);
      });
   });
});
