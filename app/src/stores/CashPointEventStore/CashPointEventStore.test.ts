import {CashPointEventStore}                  from './CashPointEventStore';
import {runInAction}                          from 'mobx';
import {activeEventRequest, sellerIdsRequest} from '../../requests/requests';
import {RootStore}                            from '../RootStore/RootStore';

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