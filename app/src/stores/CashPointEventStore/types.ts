export type PaymentType = 'Cash' | 'PayPal';

export interface Unit {
   id: number | null,
   amount: number,
   sellerId: number,
}

export interface Transaction {
   id: number | null,
   createdAt: string | null,
   paymentType: PaymentType,
   units: Unit[],
}
export interface CashPointEvent {
   title: string,
   donationRate: number,
   transactions: Transaction[]
}

export type CashPointEventStoreStatus = 'not_synced' | 'syncing' | 'synced' | 'sync_failed';
