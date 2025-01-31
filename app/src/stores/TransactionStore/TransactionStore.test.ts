import {TransactionModel} from '../../models/TransactionModel';
import {saveTransactionRequest, deleteTransactionRequest} from '../../requests/requests';
import {Transaction}                                      from '../CashPointEventStore/types';
import {RootStore}                                        from '../RootStore/RootStore';
import {TransactionStore}                                 from './TransactionStore';

jest.mock('../../models/TransactionModel', () => {

   return {
      TransactionModel: {
         createInstance: jest.fn()
      }
   }
})

jest.mock('../../requests/requests', () => ({
   saveTransactionRequest:   jest.fn(),
   deleteTransactionRequest: jest.fn(),
}));

const mockTransaction: Transaction = {
   id:          1,
   createdAt:   '2020-01-01T00:00:00+00:00',
   paymentType: 'Cash',
   units:       [{
      id:       1,
      amount:   100,
      sellerId: 1
   }],
};

const mockUnitFormUnits = [{
   id:       1,
   amount:   22.22,
   sellerId: 3,
}]

describe('stores/TransactionStore', () => {
   let rootStore: RootStore;
   let transactionStore: TransactionStore;

   beforeEach(() => {
      jest.clearAllMocks();
      rootStore = {
         unitsFormStore:      {
                                 open:  jest.fn(),
                                 close: jest.fn(),
                                 units: mockUnitFormUnits
                              } as unknown,
         cashPointEventStore: {
                                 sellerIds: [1]
                              } as unknown,
      } as RootStore;
      transactionStore = new TransactionStore(rootStore);
   });

   it('has correct initial values', () => {
      expect(transactionStore.opened).toBe(false);
      expect(transactionStore.id).toBe(null);
      expect(() => transactionStore.originalTransaction).toThrow();
      expect(() => transactionStore.paymentType).toThrow();
      expect(() => transactionStore.units).toThrow();
      expect(transactionStore.changed).toBe(false);
      expect(transactionStore.syncing).toBe(false);
      expect(transactionStore.lastSaveFailed).toBe(false);
      expect(transactionStore.lastDeleteFailed).toBe(false);
      expect(() => transactionStore.transaction).toThrow();
      expect(() => transactionStore.amount).toThrow();
   });

   it('opens an existing transaction', () => {
      transactionStore.open(mockTransaction);
      expect(transactionStore.opened).toBe(true);
      expect(transactionStore.id).toBe(mockTransaction.id);
      expect(transactionStore.originalTransaction).toEqual(mockTransaction);
      expect(transactionStore.paymentType).toBe(mockTransaction.paymentType);
      expect(transactionStore.units).toEqual(mockTransaction.units);
      expect(transactionStore.changed).toBe(false);
      expect(transactionStore.syncing).toBe(false);
      expect(transactionStore.lastSaveFailed).toBe(false);
      expect(transactionStore.lastDeleteFailed).toBe(false);
      expect(transactionStore.transaction).toEqual(mockTransaction);
      (TransactionModel.createInstance as jest.Mock).mockReturnValue({amount: 24.99});
      expect(transactionStore.amount).toBe(24.99);
   });

   it('opens a new transaction', () => {
      transactionStore.open();
      expect(transactionStore.id).toBe(null);
   });

   it('calculates amount', () => {
      transactionStore.open(mockTransaction);
      (TransactionModel.createInstance as jest.Mock).mockReturnValue({amount: 24.99});
      expect(transactionStore.amount).toBe(24.99);
      expect((TransactionModel.createInstance as jest.Mock).mock.calls.length).toBe(1);
      expect((TransactionModel.createInstance as jest.Mock).mock.calls[0]).toEqual([transactionStore.transaction]);
   });

   it('does payment type changes', () => {
      transactionStore.open(mockTransaction);
      transactionStore.setPaymentType('PayPal');
      expect(transactionStore.paymentType).toBe('PayPal');
      expect(transactionStore.changed).toBe(true);
      transactionStore.setPaymentType('Cash');
      expect(transactionStore.paymentType).toBe('Cash');
      expect(transactionStore.changed).toBe(true);
   })

   it('updates from form', () => {
      transactionStore.open(mockTransaction);
      transactionStore.updateFromForm();
      expect(transactionStore.units).toEqual(mockUnitFormUnits);
      expect(transactionStore.changed).toBe(true);
   })

   it('does a reset', () => {
      transactionStore.open(mockTransaction);
      transactionStore.setPaymentType('PayPal');
      transactionStore.updateFromForm();
      transactionStore.reset();

      expect(transactionStore.opened).toBe(true);
      expect(transactionStore.id).toBe(mockTransaction.id);
      expect(transactionStore.originalTransaction).toEqual(mockTransaction);
      expect(transactionStore.paymentType).toBe(mockTransaction.paymentType);
      expect(transactionStore.units).toEqual(mockTransaction.units);
      expect(transactionStore.changed).toBe(false);
      expect(transactionStore.syncing).toBe(false);
      expect(transactionStore.lastSaveFailed).toBe(false);
      expect(transactionStore.lastDeleteFailed).toBe(false);
      expect(transactionStore.transaction).toEqual(mockTransaction);
   })

   it('closes', () => {
      transactionStore.open(mockTransaction);
      transactionStore.close();

      expect(transactionStore.opened).toBe(false);
      expect(transactionStore.id).toBe(null);
      expect(() => transactionStore.originalTransaction).toThrow();
      expect(() => transactionStore.paymentType).toThrow();
      expect(() => transactionStore.units).toThrow();
      expect(transactionStore.changed).toBe(false);
      expect(transactionStore.syncing).toBe(false);
      expect(transactionStore.lastSaveFailed).toBe(false);
      expect(transactionStore.lastDeleteFailed).toBe(false);
      expect(() => transactionStore.transaction).toThrow();
      expect(() => transactionStore.amount).toThrow();
   })

   it('should save the transaction successfully', async() => {
      (saveTransactionRequest as jest.Mock).mockResolvedValueOnce(['2']); // Mocked async save request.
      transactionStore.open(mockTransaction);

      await transactionStore.save();
      expect(transactionStore.syncing).toBe(false);
      expect(transactionStore.lastSaveFailed).toBe(false);
      expect(transactionStore.changed).toBe(false);
      expect(transactionStore.id).toBe(2);
   });

   it('should handle save failure', async() => {
      (saveTransactionRequest as jest.Mock).mockRejectedValueOnce(new Error('Save failed')); // Mock failed request.
      transactionStore.open(mockTransaction);

      await transactionStore.save();
      expect(transactionStore.syncing).toBe(false);
      expect(transactionStore.lastSaveFailed).toBe(true);
   });

   it('should delete the transaction successfully', async() => {
      (deleteTransactionRequest as jest.Mock).mockResolvedValueOnce(null);
      transactionStore.open({
                               ...mockTransaction,
                               id: 1
                            });

      await transactionStore.delete();
      expect(transactionStore.syncing).toBe(false);
      expect(transactionStore.lastDeleteFailed).toBe(false);
      expect(transactionStore.opened).toBe(false);
   });

   it('should handle delete failure', async() => {
      (deleteTransactionRequest as jest.Mock).mockRejectedValueOnce(new Error('Delete failed')); // Mock failed
                                                                                                 // request.
      transactionStore.open({
                               ...mockTransaction,
                               id: 1
                            });

      await transactionStore.delete();
      expect(transactionStore.syncing).toBe(false);
      expect(transactionStore.lastDeleteFailed).toBe(true);
   });

   it('should throw error if trying to delete without an ID', async() => {
      transactionStore.open({
                               ...mockTransaction,
                               id: null
                            });
      await expect(transactionStore.delete()).rejects.toThrowError(
         'Transaction id is null'
      );
   });
});
