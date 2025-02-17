import {CashPointEventStore}                  from './CashPointEventStore';
import {runInAction}                          from 'mobx';
import {activeEventRequest, sellerIdsRequest} from '../../requests/requests';
import {RootStore}                            from '../RootStore/RootStore';
import {CashPointEventModel}                  from '../../models/CashPointEventModel';
import {CashPointEvent}                       from './types';

jest.mock('../../requests/requests', () => ({
   activeEventRequest: jest.fn(),
   sellerIdsRequest:   jest.fn(),
}));

describe('stores/CashPointEventStore', () => {
   let rootStore: RootStore;
   let store: CashPointEventStore;

   beforeEach(() => {
      rootStore = new RootStore();
      store = rootStore.cashPointEventStore;
   });

   describe('status', () => {
      it('should return initial status as "not_synced"', () => {
         expect(store.status).toBe('not_synced');
      });
   });

   describe('event', () => {
      it('should throw an error if _event is not initialized', () => {
         expect(() => store.event).toThrow('CashPointEventStore is not initialized');
      });

      it('should return the event when initialized', () => {
         runInAction(() => {
            store['_event'] = {
               title:        'Test Event',
               donationRate: 0.1,
               transactions: []
            };
         });
         expect(store.event).toEqual({
                                        title:        'Test Event',
                                        donationRate: 0.1,
                                        transactions: []
                                     });
      });
   });

   describe('paymentTypes', () => {
      it('should throw an error if _paymentTypes is not initialized', () => {
         expect(() => store.paymentTypes).toThrow('CashPointEventStore is not initialized');
      });

      it('should return the sellerIds when initialized', () => {
         runInAction(() => {
            store['_paymentTypes'] = ['Cash', 'PayPal'];
         });
         expect(store.paymentTypes).toEqual(['Cash', 'PayPal']);
      });
   });

   describe('sellerIds', () => {
      it('should throw an error if _sellerIds is not initialized', () => {
         expect(() => store.sellerIds).toThrow('CashPointEventStore is not initialized');
      });

      it('should return the sellerIds when initialized', () => {
         runInAction(() => {
            store['_sellerIds'] = [1, 2, 3];
         });
         expect(store.sellerIds).toEqual([1, 2, 3]);
      });
   });

   describe('totalAmount', () => {
      it('should calculate the total amount from the event', () => {
         runInAction(() => {
            store['_event'] = {} as CashPointEvent;
         });

         const mockCreateInstance = jest
            .spyOn(CashPointEventModel, 'createInstance')
            .mockImplementation((event) => ({
               totalAmount: 100
            } as unknown as CashPointEventModel));

         expect(store.totalAmount).toBe(100);
         mockCreateInstance.mockRestore();
      });

      it('should throw an error if the event is not initialized', () => {
         expect(() => store.totalAmount).toThrow('CashPointEventStore is not initialized');
      })
   })

   describe('sync', () => {
      it('should set the status to "syncing", then "synced" if the request is successful', async() => {
         (activeEventRequest as jest.Mock).mockResolvedValue({
                                                                title:        'Event',
                                                                donationRate: 0.1,
                                                                transactions: []
                                                             });
         (sellerIdsRequest as jest.Mock).mockResolvedValue([1, 2]);

         const syncPromise = store.sync();

         expect(store.status).toBe('syncing');
         await syncPromise;

         expect(store.status).toBe('synced');
         expect(store.event).toEqual({
                                        title:        'Event',
                                        donationRate: 0.1,
                                        transactions: []
                                     });
         expect(store.sellerIds).toEqual([1, 2]);
      });

      it('should set the status to "sync_failed" if the request fails', async() => {
         (activeEventRequest as jest.Mock).mockRejectedValue(new Error('Request failed'));

         const syncPromise = store.sync();

         expect(store.status).toBe('syncing');
         await syncPromise;

         expect(store.status).toBe('sync_failed');
      });
   });

   describe('reset', () => {
      it('should reset the store to its initial state', () => {
         runInAction(() => {
            store['_status'] = 'synced';
            store['_event'] = {
               title:        'Event',
               donationRate: 0.1,
               transactions: []
            };
            store['_sellerIds'] = [1, 2];
         });

         store.reset();

         expect(store.status).toBe('not_synced');
         expect(() => store.event).toThrow('CashPointEventStore is not initialized');
         expect(() => store.sellerIds).toThrow('CashPointEventStore is not initialized');
      });
   });
});