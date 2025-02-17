import {RootStore}                                 from '../RootStore/RootStore';
import {computed, makeObservable}                  from 'mobx';
import {PaymentTypeListData, SellerAmountListData} from './types';
import {CashPointEventModel} from '../../models/CashPointEventModel';

export class ResultViewStore {
   constructor(public readonly rootStore: RootStore) {
      makeObservable<ResultViewStore>(this, {
         sellerAmountsListData: computed,
         paymentTypeListData:   computed,
      })
   }

   get sellerAmountsListData(): SellerAmountListData {
      const {cashPointEventStore} = this.rootStore;
      const donationRate = cashPointEventStore.event.donationRate;
      const data: SellerAmountListData = [];
      const activeSellerIds = cashPointEventStore.sellerIds;
      const sellerAmounts = CashPointEventModel
         .createInstance(cashPointEventStore.event)
         .sellerAmounts;
      sellerAmounts
         .forEach((amount, sellerId) => {
            const donation = Math.round(amount * donationRate * 100) / 100;
            data.push({
                         sellerId,
                         donation,
                         sellerAmount: Math.round((amount - donation) * 100) / 100,
                         amount,
                         sellerActive: activeSellerIds.includes(sellerId),
                      })
         });
      for (const sellerId of activeSellerIds) {
         if (!sellerAmounts.has(sellerId)) {
            data.push({
                         sellerId,
                         donation:     0.0,
                         sellerAmount: 0.0,
                         amount:       0.0,
                         sellerActive: true,
                      })
         }
      }
      data.sort((a, b) => a.sellerId - b.sellerId);

      return data;
   }

   get paymentTypeListData(): PaymentTypeListData {
      const {cashPointEventStore} = this.rootStore;
      const paymentTypeAmounts = CashPointEventModel
         .createInstance(cashPointEventStore.event)
         .paymentTypeAmounts;

      return cashPointEventStore.paymentTypes.map(paymentType => {
         const amount = paymentTypeAmounts.get(paymentType);

         return {
            paymentType,
            amount: amount ?? 0.0,
         }
      });
   }
}
