import {action, computed, makeAutoObservable, observable, runInAction} from 'mobx';
import {PaymentType, Transaction, Unit}                                from '../CashPointEventStore/types';
import {TransactionModel}                                              from '../../models/TransactionModel';
import {saveTransactionRequest}                                        from '../../requests/requests';
import {QueuedUnitsStore}                                              from '../QueuedUnitsStore/QueuedUnitsStore';

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
   // private _currInd: number | null = null;
   private _readOnly: boolean = true;
   // @todo rename to _synced and inverse boolean logic => true to false
   private _dirty: boolean = false;
   private _saving = false;
   private _lastSaveFailed = false;

   constructor(private readonly _queuedUnitsStore: QueuedUnitsStore,) {
      makeAutoObservable<TransactionStore, '_originalTransaction' | '_paymentType' | '_units' | /*'_currInd' |*/ '_readOnly' | '_dirty' | '_saving' | '_lastSaveFailed' | 'addUnits'>(this, {
         _originalTransaction: observable,
         _paymentType        : observable,
         _units              : observable,
         // _currInd            : observable,
         _readOnly            : observable,
         _dirty              : observable,
         _saving             : observable,
         _lastSaveFailed     : observable,
         paymentType   : computed,
         opened        : computed,
         id            : computed,
         units         : computed,
         // currInd       : computed,
         readOnly       : computed,
         dirty         : computed,
         open          : action,
         reset         : action,
         close         : action,
         setReadOnly: action,
         setPaymentType: action,
         updateUnit    : action,
         addUnit       : action,
         addUnits      : action,
         // setCurrInd    : action,
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

   // get currInd(): number | null {
   //
   //    return this._currInd;
   // }

   get readOnly(): boolean {

      return this._readOnly;
   }

   get dirty(): boolean {

      return this._dirty;
   }

   get saving(): boolean {

      return this._saving;
   }

   get lastSaveFailed(): boolean {

      return this._lastSaveFailed;
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

   async open(transaction: Transaction | null = null): Promise<void> {
      if(transaction === null) {
         transaction = NEW_TRANSACTION;
         this._readOnly = false;
      }
      else {
         this._readOnly = true;
      }
      this._originalTransaction = transaction;
      this._paymentType = transaction.paymentType;
      this._units = transaction.units.map(u => ({...u}))
      // this._currInd = null;
      this._dirty = false;
      this._saving = false;
      this._lastSaveFailed = false;
      await this._queuedUnitsStore.subscribe(this.addUnits);
   }

   reset(): void {
      this._paymentType = this.originalTransaction.paymentType;
      this._units = this.originalTransaction.units.map(u => ({...u}))
      // this._currInd = null;
      // this._readOnly = false;
      this._dirty = false;
      this._saving = false;
      this._lastSaveFailed = false;
   }

   close(): void {
      this._queuedUnitsStore.unsubscribe();
      this._originalTransaction = null;
      this._paymentType = null;
      this._units = null;
      // this._currInd = null;
      this._readOnly = true;
      this._dirty = false;
      this._saving = false;
      this._lastSaveFailed = false;
   }

   setReadOnly(readOnly: boolean): void {
      this._readOnly = readOnly;
   }

   setPaymentType(paymentType: PaymentType): void {
      this._paymentType = paymentType;
      this._dirty = true;
   }

   updateUnit(currInd: number, sellerId: number, amount: number): void {
      const units = [...this.units];
      units[currInd] = {
         ...units[currInd],
         sellerId,
         amount
      }
      this._units = units;
      // this._currInd = null;
      this._dirty = true;
   }

   addUnit = (sellerId: number, amount: number) => {
      this.addUnits([{
         id: null,
         sellerId,
         amount
      }])
   }

   // setCurrInd(currInd: number | null): void {
   //    this._currInd = currInd;
   // }

   async save(): Promise<void> {
      this._saving = false;
      this._lastSaveFailed = false;
      try {
         const id = await saveTransactionRequest(this.transaction);
         runInAction(() => {
            this._saving = false;
            this._readOnly = true;
            this._dirty = false;
            this._originalTransaction = {
               ...this.originalTransaction,
               id: id.length > 0 ? Number(id) : this.originalTransaction.id,
               units: this.units,
               paymentType: this.paymentType,
            }
         })
      } catch (e) {
         runInAction(() => {
            this._saving = false;
            this._lastSaveFailed = true;
         })
      }
   }

   private addUnits = (units: Unit[]) => {
      this._units = [...this.units, ...units];
      // this._currInd = null;
      this._dirty = true;
   }
}
