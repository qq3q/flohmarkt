import {QueuedUnitsStore}            from './QueuedUnitsStore';
import {fetchUserQueuedUnitsRequest} from '../../requests/requests';
import {RootStore}                   from '../RootStore/RootStore';
import {SubscriberCallback}          from './types';

jest.mock('../../requests/requests', () => ({
   fetchUserQueuedUnitsRequest: jest.fn(),
}));

describe('stores/QueuedUnitsStore', () => {
   let rootStore: RootStore;
   let queuedUnitsStore: QueuedUnitsStore;

   beforeEach(() => {
      rootStore = new RootStore();
      queuedUnitsStore = rootStore.queuedUnitsStore;
      jest.clearAllMocks();
      jest.useFakeTimers();
   });

   afterEach(() => {
      jest.useRealTimers();
   });

   describe('all', () => {
      it('does a subscribe, some requests and an unsubscribe', async() => {
         expect(queuedUnitsStore.running).toBe(false);

         // subscribe (request fails)
         const subscriber: SubscriberCallback = jest.fn();
         (fetchUserQueuedUnitsRequest as jest.Mock).mockRejectedValue(new Error('Fetch failed'));
         queuedUnitsStore.subscribe(subscriber);
         await queuedUnitsStore.fetchQueuePromise;
         expect(queuedUnitsStore.lastFetchFailed).toBe(true);
         expect(queuedUnitsStore.running).toBe(true);

         // second fetch after time out with successful request
         (fetchUserQueuedUnitsRequest as jest.Mock).mockResolvedValue([{id: 1}]);
         jest.runOnlyPendingTimers();
         await queuedUnitsStore.fetchQueuePromise;
         expect(queuedUnitsStore.lastFetchFailed).toBe(false);
         expect(queuedUnitsStore.running).toBe(true);

         // third fetch after time out with successful request
         (fetchUserQueuedUnitsRequest as jest.Mock).mockResolvedValue([{id: 2}]);
         jest.runOnlyPendingTimers();
         await queuedUnitsStore.fetchQueuePromise;
         expect(queuedUnitsStore.lastFetchFailed).toBe(false);
         expect(queuedUnitsStore.running).toBe(true);

         // unsubscribe
         queuedUnitsStore.unsubscribe();
         expect(queuedUnitsStore.running).toBe(false);

         // subscriber should not be called now
         (fetchUserQueuedUnitsRequest as jest.Mock).mockResolvedValue([{id: 2}]);
         jest.runOnlyPendingTimers();
         await queuedUnitsStore.fetchQueuePromise;

         // subscriber should be called twice
         expect(subscriber).toHaveBeenCalledTimes(2);
         expect(subscriber).toHaveBeenCalledWith([{id: 1}]);
         expect(subscriber).toHaveBeenCalledWith([{id: 2}]);
      });
   });

});