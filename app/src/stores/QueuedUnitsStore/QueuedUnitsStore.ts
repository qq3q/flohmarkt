import {fetchUserQueuedUnitsRequest}                                   from '../../requests/requests';
import {action, computed, makeAutoObservable, observable, runInAction} from 'mobx';
import {QueuedUnit, SubscriberCallback}                                from './types';
import {RootStore}                                                     from '../RootStore/RootStore';

const INTERVAL = 2000;

export class QueuedUnitsStore {
   private _fetchQueuePromise: Promise<void> | null = null;
   private _subscriber: SubscriberCallback | null = null;
   private _running = false;
   private _queue: QueuedUnit[] = [];
   private _interval: number | null = null;
   private _lastFetchFailed: boolean = false;

   constructor(public readonly _: RootStore) {
      makeAutoObservable<QueuedUnitsStore, '_lastFetchFailed'>(this, {
         _lastFetchFailed: observable,
         lastFetchFailed : computed,
         subscribe       : action,
         unsubscribe     : action,
      });
   }

   get fetchQueuePromise(): Promise<void> | null {

      return this._fetchQueuePromise;
   }

   get running(): boolean {

      return this._running;
   }

   get lastFetchFailed(): boolean {

      return this._lastFetchFailed;
   }

   subscribe(subscriber: SubscriberCallback): void {
      this._subscriber = subscriber;
      this._lastFetchFailed = false;
      if (this._interval !== null) {
         clearInterval(this._interval);
      }

      const fetchQueue = async() => {
         this._fetchQueuePromise = new Promise(async (resolve) => {
            try {
               const units = await fetchUserQueuedUnitsRequest();
               runInAction(() => {
                  this._lastFetchFailed = false;
               })
               this._queue = this._queue.concat(units);
               this.notify();
            } catch (_) {
               // console.warn('Could not fetch queued units.')
               // console.warn(e);
               runInAction(() => {
                  this._lastFetchFailed = true;
               })
            }
            resolve();
            this._fetchQueuePromise = null;
         })
      }

      // @ts-expect-error
      this._interval = setInterval(fetchQueue, INTERVAL);

      (() => {
         return fetchQueue();
      })()

      this._running = true;
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
      if (this._queue.length > 0 && this._subscriber) {
         const units = this._queue;
         this._queue = [];
         this._subscriber(units);
      }
   }
}
