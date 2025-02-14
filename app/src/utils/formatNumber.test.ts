import {formatNumber} from './formatNumber';

describe('utils/formatNumber', () => {
   it('should correctly format a positive integer', () => {
      const input = 12345;
      expect(formatNumber(input)).toBe('12.345');
   });

   it('should correctly format a negative integer', () => {
      const input = -4567;
      expect(formatNumber(input)).toBe('-4.567');
   });

   it('should correctly format a decimal number', () => {
      const input = 1234.56;
      expect(formatNumber(input)).toBe('1.234,56');
   });

   it('should handle zero', () => {
      const input = 0;
      expect(formatNumber(input)).toBe('0');
   });

   it('should correctly format a large number', () => {
      const input = 1234567890;
      expect(formatNumber(input)).toBe('1.234.567.890');
   });

   it('should correctly format a small decimal number', () => {
      const input = 0.123456789;
      expect(formatNumber(input)).toBe('0,12346');
   });
});