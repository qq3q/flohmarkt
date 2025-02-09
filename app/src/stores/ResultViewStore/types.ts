import {PaymentType} from '../CashPointEventStore/types';

export interface SellerAmountListItem {
   sellerId: number,
   sellerActive: boolean,
   amount: number,
}

export type SellerAmountListData = SellerAmountListItem[];

export interface PaymentTypeListItem {
   paymentType: PaymentType,
   amount: number,
}

export type PaymentTypeListData = PaymentTypeListItem[];
