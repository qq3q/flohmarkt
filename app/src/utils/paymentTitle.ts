import {PaymentType} from '../stores/CashPointEventStore/types';

export const getPaymentTitle = (paymentType: PaymentType): string => {
   switch (paymentType) {
      case "Cash":
         return 'Bar';
      case "PayPal":
         return 'PayPal';
      default:
         throw new Error(`Payment type ${paymentType} not supported.`);
   }
}
