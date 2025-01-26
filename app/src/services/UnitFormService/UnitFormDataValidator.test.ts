import {UnitFormDataValidator}       from './UnitFormDataValidator';
import {UnitFormData}                from './UnitFormData';
import {UnitFormDataValidatorResult} from './UnitFormDataValidatorResult';

describe('services/UnitFormService/UnitFormDataValidator', () => {
   describe('validate', () => {
      const validSellerIds = [1, 2, 3];
      const validator = new UnitFormDataValidator(validSellerIds);

      it('should set no validation errors when formData is blank', () => {
         const formData = new UnitFormData({
                                              sellerId:          '',
                                              beforePointAmount: '',
                                              afterPointAmount:  '',
                                              unitId:            null,
                                           });

         validator.validate(formData);

         expect(formData.validationResult).toBeInstanceOf(UnitFormDataValidatorResult);
         expect(formData.validationResult?.sellerIdErrors).toEqual([]);
         expect(formData.validationResult?.amountErrors).toEqual([]);
      });

      it('should set sellerId error when sellerId is null', () => {
         const formData = new UnitFormData({
                                              sellerId:          '',
                                              beforePointAmount: '5',
                                              afterPointAmount:  '0',
                                              unitId:            null,
                                           });

         validator.validate(formData);

         expect(formData.validationResult).toBeInstanceOf(UnitFormDataValidatorResult);
         expect(formData.validationResult?.sellerIdErrors).toEqual(['Bitte Verkäufernummer angeben.']);
         expect(formData.validationResult?.amountErrors).toEqual([]);
      });

      it('should set sellerId error when sellerId is invalid', () => {
         const formData = new UnitFormData({
                                              sellerId:          '999',
                                              beforePointAmount: '5',
                                              afterPointAmount:  '0',
                                              unitId:            null,
                                           });

         validator.validate(formData);

         expect(formData.validationResult).toBeInstanceOf(UnitFormDataValidatorResult);
         expect(formData.validationResult?.sellerIdErrors).toEqual(['Verkäufernummer nicht gefunden.']);
         expect(formData.validationResult?.amountErrors).toEqual([]);
      });

      it('should set amount error when amount is null', () => {
         const formData = new UnitFormData({
                                              sellerId:          '1',
                                              beforePointAmount: '',
                                              afterPointAmount:  '',
                                              unitId:            null,
                                           });

         validator.validate(formData);

         expect(formData.validationResult).toBeInstanceOf(UnitFormDataValidatorResult);
         expect(formData.validationResult?.sellerIdErrors).toEqual([]);
         expect(formData.validationResult?.amountErrors).toEqual(['Bitte gültigen Betrag angeben.']);
      });

      it('should set no errors when sellerId and amount are valid', () => {
         const formData = new UnitFormData({
                                              sellerId:          '1',
                                              beforePointAmount: '5',
                                              afterPointAmount:  '50',
                                              unitId:            null,
                                           });

         validator.validate(formData);

         expect(formData.validationResult).toBeInstanceOf(UnitFormDataValidatorResult);
         expect(formData.validationResult?.sellerIdErrors).toEqual([]);
         expect(formData.validationResult?.amountErrors).toEqual([]);
      });
   });
});