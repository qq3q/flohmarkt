import {RootStore}                        from '../RootStore/RootStore';
import {action, computed, makeObservable} from 'mobx';
import {CashPointEventModel}              from '../../models/CashPointEventModel';
import {TransactionListData}              from './types';
import {CheckboxOptionType}               from 'antd';
import {PaymentType}                      from '../CashPointEventStore/types';
import {getPaymentTitle}                  from '../../utils/paymentTitle';

export class CashPointViewStore {
   constructor(public readonly rootStore: RootStore) {
      makeObservable<CashPointViewStore>(this, {
         changed:             computed,
         transactionListData: computed,
         refresh:             action,
         save:                action,
      })
   }

   get eventTitle() {

      return this.rootStore.cashPointEventStore.event.title;
   }

   get changed() {

      return this.rootStore.transactionStore.changed || this.rootStore.unitsFormStore.changed;
   }

   get paymentTypeOptions(): CheckboxOptionType<PaymentType>[] {

      return this.rootStore.cashPointEventStore.paymentTypes.map((paymentType) => ({
         label: getPaymentTitle(paymentType),
         value: paymentType,
      }))
   }

   get transactionListData(): TransactionListData {
      const {
         transactionStore,
         cashPointEventStore
      } = this.rootStore;

      const eventModel = CashPointEventModel.createInstance(cashPointEventStore.event);
      return eventModel.transactionModels.map(t => {
         const selected = transactionStore.id === t.data.id;
         const canSelect = !selected && !this.changed;

         return {
            createdAt: t.data.createdAt,
            amount:    t.amount,
            selected,
            canSelect,
            select:    canSelect ? () => transactionStore.open(t.data) : () => {
            },
         }
      });
   }

   refresh = async() => {
      const {
         transactionStore,
         cashPointEventStore
      } = this.rootStore;

      await cashPointEventStore.sync();
      transactionStore.open();
   }

   save = async() => {
      const {
         transactionStore,
         cashPointEventStore
      } = this.rootStore;

      transactionStore.updateFromForm();
      await transactionStore.save();
      if (!transactionStore.lastSaveFailed) {
         await cashPointEventStore.sync();
      }
   }

   delete = async() => {
      const {
         transactionStore,
         cashPointEventStore
      } = this.rootStore;

      await transactionStore.delete();
      if (!transactionStore.lastDeleteFailed) {
         await cashPointEventStore.sync();
         transactionStore.open();
      }
   }
}
