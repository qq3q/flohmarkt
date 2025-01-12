import {formatCurrency} from './formatCurrency';

describe('utils/formatCurrency', () => {
   it('should format currency correctly', () => {
      const number = 123456.78;
      const expected = '123.456,78 €'

      expect(formatCurrency(number)).toEqual(expected);
   });

   it('should format zero correctly', () => {
      const number = 0;
      const expected = '0,00 €'

      expect(formatCurrency(number)).toEqual(expected);
   });

   it('should format negative numbers correctly', () => {
      const number = -123.45;
      const expected = '-123,45 €'

      expect(formatCurrency(number)).toEqual(expected);
   });

   it('should format numbers with decimal places after comma correctly', () => {
      const number = 123.455555;
      const expected = '123,46 €'

      expect(formatCurrency(number)).toEqual(expected);
   });
});