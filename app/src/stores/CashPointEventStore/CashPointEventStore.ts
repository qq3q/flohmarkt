import {action, computed, makeObservable, observable, runInAction} from 'mobx';
import {activeEventRequest, sellerIdsRequest,}                     from '../../requests/requests';
import {CashPointEvent, CashPointEventStoreStatus, PaymentType,}   from './types';
import {RootStore}                                                 from '../RootStore/RootStore';
import {CashPointEventModel}                                       from '../../models/CashPointEventModel';

export class CashPointEventStore {
   private _status: CashPointEventStoreStatus = 'not_synced';
   private _event: CashPointEvent | null = null;
   private _paymentTypes: PaymentType[] | null = null;
   private _sellerIds: number[] | null = null;

   constructor(public readonly rootStore: RootStore) {
      makeObservable<CashPointEventStore, '_status' | '_event' | '_paymentTypes' | '_sellerIds'>(this, {
         _status:       observable,
         _event:        observable,
         _paymentTypes: observable,
         _sellerIds:    observable,
         status:        computed,
         event:         computed,
         sync:          action.bound,
         reset:         action,
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

   get paymentTypes(): PaymentType[] {
      if(this._paymentTypes === null) {

         throw new Error('CashPointEventStore is not initialized');
      }

      return this._paymentTypes;
   }

   get sellerIds(): number[] {
      if (this._sellerIds === null) {

         throw new Error('CashPointEventStore is not initialized');
      }

      return this._sellerIds;
   }

   get totalAmount(): number {

      return CashPointEventModel.createInstance(this.event).totalAmount;
   }

   async sync() {
      this._status = 'syncing';
      try {
         let data: CashPointEvent;
         let sellerIds: number[];
         [data, sellerIds] = await Promise.all([
                                                  await activeEventRequest(),
                                                  await sellerIdsRequest()
                                               ])
         runInAction(() => {
            this._event = data;
            // @todo get payment types from server
            this._paymentTypes = ['Cash', 'PayPal']
            this._sellerIds = sellerIds;
            this._status = 'synced';
         })
      } catch (_) {
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
