import {action, computed, makeAutoObservable, observable, runInAction} from 'mobx';
import {PaymentType, Transaction, Unit}                                from '../CashPointEventStore/types';
import {TransactionModel}                                 from '../../models/TransactionModel';
import {deleteTransactionRequest, saveTransactionRequest} from '../../requests/requests';
import {type RootStore}                                        from '../RootStore/RootStore';

const NEW_TRANSACTION: Transaction = {
   id         : null,
   createdAt  : null,
   paymentType: 'Cash',
   units      : [],
}

export class TransactionStore {
   private _originalTransaction: Transaction | null = null;
   private _paymentType: PaymentType | null = null;
   private _units: Unit[] | null = null;
   private _changed: boolean = false;
   private _syncing = false;
   private _lastSaveFailed = false;
   private _lastDeleteFailed = false;

   constructor(public readonly rootStore: RootStore) {
      makeAutoObservable<TransactionStore, '_originalTransaction' | '_paymentType' | '_units' | '_changed' | '_saving' | '_lastSaveFailed' | '_lastDeleteFailed' | 'addUnits'>(this, {
         _originalTransaction: observable,
         _paymentType        : observable,
         _units              : observable,
         _changed            : observable,
         _saving             : observable,
         _lastSaveFailed     : observable,
         _lastDeleteFailed   : observable,
         paymentType         : computed,
         opened              : computed,
         id                  : computed,
         units               : computed,
         changed             : computed,
         syncing             : computed,
         lastSaveFailed      : computed,
         lastDeleteFailed    : computed,
         open                : action,
         reset               : action,
         close               : action,
         setPaymentType      : action,
         addUnits            : action,
      });
   }

   get opened(): boolean {

      return this._originalTransaction !== null && this._paymentType !== null && this._units !== null;
   }

   get id(): number | null {

      return this._originalTransaction?.id ?? null;
   }

   get originalTransaction(): Transaction {
      if (this._originalTransaction === null) {

         throw new Error('TransactionStore is not initialized.');
      }

      return this._originalTransaction;
   }

   get paymentType(): PaymentType {
      if (this._paymentType === null) {

         throw new Error('TransactionStore is not initialized.');
      }

      return this._paymentType;
   }

   get units(): Unit[] {
      if (this._units === null) {

         throw new Error('TransactionStore is not initialized.');
      }

      return this._units;
   }

   get changed(): boolean {

      return this._changed;
   }

   get syncing(): boolean {

      return this._syncing;
   }

   get lastSaveFailed(): boolean {

      return this._lastSaveFailed;
   }

   get lastDeleteFailed(): boolean {

      return this._lastDeleteFailed;
   }

   get transaction(): Transaction {

      return {
         ...this.originalTransaction,
         paymentType: this.paymentType,
         units      : this.units,
      }
   }

   get amount(): number {

      return TransactionModel.createInstance(this.transaction).amount
   }

   open(transaction: Transaction | null = null): void {
      this.close();
      if (transaction === null) {
         transaction = NEW_TRANSACTION;
      }
      this._originalTransaction = transaction;
      this._paymentType = transaction.paymentType;
      this._units = transaction.units.map(u => ({...u}))
      this.rootStore.unitsFormStore.open(this.units, this.rootStore.cashPointEventStore.sellerIds);
   }

   reset(): void {
      this._paymentType = this.originalTransaction.paymentType;
      this._units = this.originalTransaction.units.map(u => ({...u}))
      this.rootStore.unitsFormStore.open(this.units, this.rootStore.cashPointEventStore.sellerIds);
      this._changed = false;
      this._syncing = false;
      this._lastSaveFailed = false;
      this._lastDeleteFailed = false;
   }

   close(): void {
      this._originalTransaction = null;
      this._paymentType = null;
      this._units = null;
      this.rootStore.unitsFormStore.close();
      this._changed = false;
      this._syncing = false;
      this._lastSaveFailed = false;
      this._lastDeleteFailed = false;
   }

   setPaymentType(paymentType: PaymentType): void {
      this._paymentType = paymentType;
      this._changed = true;
   }

   updateFromForm() {
      this._units = this.rootStore.unitsFormStore.units;
      this._changed = true;
      this.rootStore.unitsFormStore.open(this.units, this.rootStore.cashPointEventStore.sellerIds);
   }

   async save(): Promise<void> {
      this._syncing = true;
      this._lastSaveFailed = false;
      try {
         const id = await saveTransactionRequest(this.transaction);
         runInAction(() => {
            this._syncing = false;
            this._changed = false;
            this._originalTransaction = {
               ...this.originalTransaction,
               id         : id.length > 0 ? Number(id) : this.originalTransaction.id,
               units      : this.units,
               paymentType: this.paymentType,
            }
         })
      } catch (_) {
         runInAction(() => {
            this._syncing = false;
            this._lastSaveFailed = true;
         })
      }
   }

   async delete(): Promise<void> {
      if(this.transaction.id === null) {

         throw new Error('Transaction id is null');
      }
      this._syncing = false;
      this._lastDeleteFailed = false;
      try {
         await deleteTransactionRequest(this.transaction.id);
         runInAction(() => {
            this._syncing = false;
            this._changed = false;
            this.close();
         })
      } catch (e) {
         runInAction(() => {
            this._syncing = false;
            this._lastDeleteFailed = true;
         })
      }
   }
}
