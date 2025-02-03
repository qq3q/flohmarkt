// CashPointViewStore.test.ts
import {CashPointViewStore}  from './CashPointViewStore';
import {CashPointEventModel} from '../../models/CashPointEventModel';

jest.mock('../../models/CashPointEventModel');

describe('stores/CashPointViewStore', () => {
   let rootStoreMock: any;
   let cashPointViewStore: CashPointViewStore;
   let cashPointEventModelMock: jest.Mocked<typeof CashPointEventModel>;

   beforeEach(() => {
      rootStoreMock = {
         transactionStore:    {
            changed: false,
            id:      null,
            open:    jest.fn(),
         },
         unitsFormStore:      {
            changed: false
         },
         cashPointEventStore: {
            event: null,
         },
      };

      cashPointEventModelMock = {
         createInstance: jest.fn(),
      } as unknown as jest.Mocked<typeof CashPointEventModel>;

      (CashPointEventModel.createInstance as jest.Mock).mockImplementation(
         cashPointEventModelMock.createInstance
      );

      cashPointViewStore = new CashPointViewStore(rootStoreMock);
   });

   describe('eventTitle', () => {
      it('should return the title from cashPointEventStore.event', () => {
         rootStoreMock.cashPointEventStore.event = {title: 'Mock Event Title'};
         expect(cashPointViewStore.eventTitle).toBe('Mock Event Title');
      });
   });

   describe('changed', () => {
      it('should return true when transactionStore.changed is true', () => {
         rootStoreMock.transactionStore.changed = true;
         expect(cashPointViewStore.changed).toBe(true);
      });

      it('should return true when unitsFormStore.changed is true', () => {
         rootStoreMock.unitsFormStore.changed = true;
         expect(cashPointViewStore.changed).toBe(true);
      });

      it('should return false when both transactionStore.changed and unitsFormStore.changed are false', () => {
         rootStoreMock.transactionStore.changed = false;
         rootStoreMock.unitsFormStore.changed = false;
         expect(cashPointViewStore.changed).toBe(false);
      });
   });

   describe('transactionListData', () => {
      it('should return formatted transaction data with selectable transactions', () => {
         rootStoreMock.cashPointEventStore.event = {data: 'mockEvent'};
         const mockTransactionModels = [
            {
               data:   {
                  id:        1,
                  createdAt: '2023-01-01'
               },
               amount: 100,
            }
         ];
         cashPointEventModelMock.createInstance.mockReturnValue({
                                                                   transactionModels: [...mockTransactionModels],
                                                                } as unknown as CashPointEventModel);

         const transactionListData = cashPointViewStore.transactionListData;
         expect(transactionListData).toEqual([
                                                {
                                                   createdAt: '2023-01-01',
                                                   amount:    100,
                                                   selected:  false,
                                                   canSelect: true,
                                                   select:    expect.any(Function),
                                                },
                                             ]);
      });

      it('should mark a transaction as selected when its ID matches', () => {
         rootStoreMock.cashPointEventStore.event = {data: 'mockEvent'};
         rootStoreMock.transactionStore.id = 1;
         const mockTransactionModels = [
            {
               data:   {
                  id:        1,
                  createdAt: '2023-01-01'
               },
               amount: 100,
            },
         ];
         cashPointEventModelMock.createInstance.mockReturnValue({
                                                                   transactionModels: [...mockTransactionModels],
                                                                } as unknown as CashPointEventModel);

         const transactionListData = cashPointViewStore.transactionListData;
         expect(transactionListData).toEqual([
                                                {
                                                   createdAt: '2023-01-01',
                                                   amount:    100,
                                                   selected:  true,
                                                   canSelect: false,
                                                   select:    expect.any(Function),
                                                },
                                             ]);
      });

      it('should disable selection when a change is in progress', () => {
         rootStoreMock.cashPointEventStore.event = {data: 'mockEvent'};
         rootStoreMock.transactionStore.id = null;
         rootStoreMock.transactionStore.changed = true;
         const mockTransactionModels = [
            {
               data:   {
                  id:        1,
                  createdAt: '2023-01-01'
               },
               amount: 100,
            },
         ];
         cashPointEventModelMock.createInstance.mockReturnValue({
                                                                   transactionModels: [...mockTransactionModels],
                                                                } as unknown as CashPointEventModel);

         const transactionListData = cashPointViewStore.transactionListData;
         expect(transactionListData).toEqual([
                                                {
                                                   createdAt: '2023-01-01',
                                                   amount:    100,
                                                   selected:  false,
                                                   canSelect: false,
                                                   select:    expect.any(Function),
                                                },
                                             ]);
      });
   });

   describe('refresh', () => {
      it('should call transactionStore.open and cashPointEventStore.sync', async() => {
         const syncMock = jest.fn().mockResolvedValue(undefined);
         const openMock = jest.fn();
         rootStoreMock.cashPointEventStore.sync = syncMock;
         rootStoreMock.transactionStore.open = openMock;

         await cashPointViewStore.refresh();

         expect(syncMock).toHaveBeenCalled();
         expect(openMock).toHaveBeenCalled();
      });
   });

   describe('save', () => {
      it('should update the transaction, save it, and sync events if the save succeeds', async () => {
         const updateFromFormMock = jest.fn();
         const saveMock = jest.fn().mockResolvedValue(undefined);
         const syncMock = jest.fn().mockResolvedValue(undefined);

         rootStoreMock.transactionStore.updateFromForm = updateFromFormMock;
         rootStoreMock.transactionStore.save = saveMock;
         rootStoreMock.transactionStore.lastSaveFailed = false;
         rootStoreMock.cashPointEventStore.sync = syncMock;

         await cashPointViewStore.save();

         expect(updateFromFormMock).toHaveBeenCalled();
         expect(saveMock).toHaveBeenCalled();
         expect(syncMock).toHaveBeenCalled();
      });

      it('should not sync events if the save fails', async () => {
         const updateFromFormMock = jest.fn();
         const saveMock = jest.fn().mockResolvedValue(undefined);
         const syncMock = jest.fn();

         rootStoreMock.transactionStore.updateFromForm = updateFromFormMock;
         rootStoreMock.transactionStore.save = saveMock;
         rootStoreMock.transactionStore.lastSaveFailed = true;
         rootStoreMock.cashPointEventStore.sync = syncMock;

         await cashPointViewStore.save();

         expect(updateFromFormMock).toHaveBeenCalled();
         expect(saveMock).toHaveBeenCalled();
         expect(syncMock).not.toHaveBeenCalled();
      });
   });

   describe('delete', () => {
      it('should call transactionStore.delete and cashPointEventStore.sync if delete succeeds', async () => {
         const deleteMock = jest.fn().mockResolvedValue(undefined);
         const openMock = jest.fn();
         const syncMock = jest.fn().mockResolvedValue(undefined);
         rootStoreMock.transactionStore.delete = deleteMock;
         rootStoreMock.transactionStore.open = openMock;
         rootStoreMock.cashPointEventStore.sync = syncMock;
         rootStoreMock.transactionStore.lastDeleteFailed = false;

         await cashPointViewStore.delete();

         expect(deleteMock).toHaveBeenCalled();
         expect(syncMock).toHaveBeenCalled();
         expect(openMock).toHaveBeenCalled();
      });

      it('should not call cashPointEventStore.sync if delete fails', async () => {
         const deleteMock = jest.fn().mockResolvedValue(undefined);
         const openMock = jest.fn();
         rootStoreMock.transactionStore.delete = deleteMock;
         rootStoreMock.transactionStore.open = openMock;
         rootStoreMock.transactionStore.lastDeleteFailed = true;
         const syncMock = jest.fn();
         rootStoreMock.cashPointEventStore.sync = syncMock;

         await cashPointViewStore.delete();

         expect(deleteMock).toHaveBeenCalled();
         expect(syncMock).not.toHaveBeenCalled();
         expect(openMock).not.toHaveBeenCalled();
      });
   });
});