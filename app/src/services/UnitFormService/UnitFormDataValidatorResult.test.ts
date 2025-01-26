import {UnitFormDataValidatorResult} from './UnitFormDataValidatorResult';

describe('services/UnitFormService/UnitFormDataValidatorResult', () => {

   describe('valid', () => {
      it('should return true if both sellerIdErrors and amountErrors are empty', () => {
         const result = new UnitFormDataValidatorResult([], []);
         expect(result.valid).toBe(true);
      });

      it('should return false if sellerIdErrors is not empty', () => {
         const result = new UnitFormDataValidatorResult(['Seller ID error'], []);
         expect(result.valid).toBe(false);
      });

      it('should return false if amountErrors is not empty', () => {
         const result = new UnitFormDataValidatorResult([], ['Amount error']);
         expect(result.valid).toBe(false);
      });

      it('should return false if both sellerIdErrors and amountErrors are not empty', () => {
         const result = new UnitFormDataValidatorResult(['Seller ID error'], ['Amount error']);
         expect(result.valid).toBe(false);
      });
   });

   describe('getErrors', () => {
      it('should return both sellerIdErrors and amountErrors when both flags are true', () => {
         const result = new UnitFormDataValidatorResult(['Seller ID error'], ['Amount error']);
         const errors = result.getErrors(true, true);
         expect(errors).toEqual(['Seller ID error', 'Amount error']);
      });

      it('should return only sellerIdErrors when includeSellerIdErrors is true and includeAmountErrors is false', () => {
         const result = new UnitFormDataValidatorResult(['Seller ID error'], ['Amount error']);
         const errors = result.getErrors(true, false);
         expect(errors).toEqual(['Seller ID error']);
      });

      it('should return only amountErrors when includeAmountErrors is true and includeSellerIdErrors is false', () => {
         const result = new UnitFormDataValidatorResult(['Seller ID error'], ['Amount error']);
         const errors = result.getErrors(false, true);
         expect(errors).toEqual(['Amount error']);
      });

      it('should return an empty array when both flags are false', () => {
         const result = new UnitFormDataValidatorResult(['Seller ID error'], ['Amount error']);
         const errors = result.getErrors(false, false);
         expect(errors).toEqual([]);
      });
   });

});