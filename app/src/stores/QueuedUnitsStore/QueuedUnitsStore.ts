import {Unit}                                                          from '../CashPointEventStore/types';
import {fetchUserQueuedUnitsRequest}                                   from '../../requests/requests';
import {action, computed, makeAutoObservable, observable, runInAction} from 'mobx';
import {SubscriberCallback}                                            from './types';

const INTERVAL = 2000;

export class QueuedUnitsStore {
   private _subscriber: SubscriberCallback | null = null;
   private _running = false;
   private _queue: Unit[] = [];
   private _interval: number | null = null;
   private _lastFetchFailed: boolean = false;

   constructor() {
      makeAutoObservable<QueuedUnitsStore, '_lastFetchFailed'>(this, {
         _lastFetchFailed: observable,
         lastFetchFailed : computed,
         subscribe       : action,
         unsubscribe     : action,
      });
   }

   get running(): boolean {

      return this._running;
   }

   get lastFetchFailed(): boolean {

      return this._lastFetchFailed;
   }

   subscribe(subscriber: SubscriberCallback): Promise<void> {
      this._subscriber = subscriber;
      this._lastFetchFailed = false;
      if (this._interval !== null) {
         clearInterval(this._interval);
      }

      const fetchQueue = async() => {
         try {
            const units = await fetchUserQueuedUnitsRequest();
            runInAction(() => {
               this._lastFetchFailed = false;
            })
            this._queue = this._queue.concat(units);
            this.notify();
         } catch (e) {
            console.warn('Could not fetch queued units.')
            console.warn(e);
            runInAction(() => {
               this._lastFetchFailed = true;
            })
         }
      }

      // @ts-ignore
      this._interval = setInterval(fetchQueue, INTERVAL);
      const promise = fetchQueue();
      this._running = true;

      return promise;
   }

   unsubscribe(): void {
      this._subscriber = null;
      if (this._interval !== null) {
         clearInterval(this._interval);
      }
      this._lastFetchFailed = false;
      this._running = false;
   }

   private notify() {
      console.log('notify', this._queue, this._subscriber)
      if (this._queue.length > 0 && this._subscriber) {
         const units = this._queue;
         this._queue = [];
         this._subscriber(units);
      }
   }
}
