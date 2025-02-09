import {getPaymentTitle} from './paymentTitle';
import {PaymentType}     from '../stores/CashPointEventStore/types';

describe('utils/paymentTitle', () => {
   it('should return "Bar" when payment type is "Cash"', () => {
      const paymentType: PaymentType = 'Cash';
      expect(getPaymentTitle(paymentType)).toBe('Bar');
   });

   it('should return "PayPal" when payment type is "PayPal"', () => {
      const paymentType: PaymentType = 'PayPal';
      expect(getPaymentTitle(paymentType)).toBe('PayPal');
   });

   it('should throw an error for unsupported payment types', () => {
      const unsupportedPaymentType = 'Card' as PaymentType;
      expect(() => getPaymentTitle(unsupportedPaymentType)).toThrow(
         'Payment type Card not supported.'
      );
   });
});
