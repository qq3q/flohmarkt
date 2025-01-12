import {decimalPointSplit} from './decimalPointSplit';

describe('utils/decimalPointSplit', () => {
   test('it should split a number into integral and decimal parts', () => {
      const result = decimalPointSplit(123.45);
      expect(result).toEqual(['123', '45']);
   });

   test('it should correctly handle zero decimal places', () => {
      const result = decimalPointSplit(100, 0);
      expect(result).toEqual(['100', '']);
   });

   test('it should correctly handle numbers with more than specified decimal places', () => {
      const result = decimalPointSplit(100.55555, 2);
      expect(result).toEqual(['100', '56']);
   });

   test('it should correctly handle numbers with less than specified decimal places', () => {
      const result = decimalPointSplit(100.5, 3);
      expect(result).toEqual(['100', '500']);
   });
});