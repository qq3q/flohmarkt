import {action, computed, makeObservable, observable, runInAction} from 'mobx';
import {activeEventRequest, sellerIdsRequest,}                     from '../../requests/requests';
import {CashPointEvent, CashPointEventStoreStatus,}                from './types';
import {CashPointEventModel}                                       from '../../models/CashPointEventModel';
import {RootStore}                                                 from '../RootStore/RootStore';

export class CashPointEventStore {
   private _status: CashPointEventStoreStatus = 'not_synced';
   private _event: CashPointEvent | null = null;
   private _sellerIds: number[] | null = null;

   constructor(public readonly rootStore: RootStore) {
      makeObservable<CashPointEventStore, '_status' | '_event' | '_sellerIds'>(this, {
         _status:    observable,
         _event:     observable,
         _sellerIds: observable,
         status:     computed,
         eventModel: computed,
         sync:       action,
         reset:      action,
      })
   }

   get status(): CashPointEventStoreStatus {

      return this._status;
   }

   get event(): CashPointEvent {
      if (this._event === null) {

         throw new Error('CashPointEventStore is not initialized');
      }

      return this._event;
   }

   get sellerIds(): number[] {
      if (this._sellerIds === null) {

         throw new Error('CashPointEventStore is not initialized');
      }

      return this._sellerIds;
   }

   get eventModel(): CashPointEventModel {

      return CashPointEventModel.createInstance(this.event);
   }

   async sync() {
      this._status = 'syncing';
      try {
         // const data: CashPointEvent = await activeEventRequest();
         // const sellerIds: number[] = await sellerIdsRequest();
         let data: CashPointEvent;
         let sellerIds: number[];
         [data, sellerIds] = await Promise.all([
                                                  await activeEventRequest(),
                                                  await sellerIdsRequest()
                                               ])
         runInAction(() => {
            this._event = data;
            this._sellerIds = sellerIds;
            this._status = 'synced';
         })
      } catch (e) {
         runInAction(() => {
            this._status = 'sync_failed';
         })
      }
   }

   reset() {
      this._status = 'not_synced';
      this._event = null;
      this._sellerIds = null;
   }
}
