import {CashPointEventModel}               from './CashPointEventModel';
import {TransactionModel}                  from './TransactionModel';
import {CashPointEvent, Transaction, Unit} from '../stores/CashPointEventStore/types';

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
});
