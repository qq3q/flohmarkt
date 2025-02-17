import {toCents, toEuros} from './amount';

describe('utils/amount', () => {
   describe('toCents', () => {
      it('should convert whole number amounts to cents correctly', () => {
         expect(toCents(5)).toBe(500);
      });

      it('should convert decimal amounts to cents correctly', () => {
         expect(toCents(5.75)).toBe(575);
      });

      it('should handle rounding up correctly', () => {
         expect(toCents(2.678)).toBe(268);
      });

      it('should handle rounding down correctly', () => {
         expect(toCents(3.221)).toBe(322);
      });

      it('should handle zero as an input', () => {
         expect(toCents(0)).toBe(0);
      });
   });

   describe('toEuros', () => {
      it('should convert whole number amounts to euros correctly', () => {
         expect(toEuros(500)).toBe(5);
      });

      it('should convert whole number amounts to euros correctly', () => {
         expect(toEuros(501)).toBe(5.01);
      });

      it('should convert whole number amounts to euros correctly', () => {
         expect(toEuros(501.5)).toBe(5.02);
      });


      it('should handle zero as an input', () => {
         expect(toEuros(0)).toBe(0);
      });
   });
});