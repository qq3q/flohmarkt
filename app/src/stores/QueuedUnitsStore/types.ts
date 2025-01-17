export type SubscriberCallback = (units: QueuedUnit[]) => void;

export interface QueuedUnit {
   amount: number,
   sellerId: number,
}
