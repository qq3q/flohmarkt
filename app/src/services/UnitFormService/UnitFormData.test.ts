// UnitFormData.test.ts
import {UnitFormData}                from './UnitFormData';
import {decimalPointSplit}           from '../../utils/decimalPointSplit';
import {UnitFormDataValidatorResult} from './UnitFormDataValidatorResult';
import {TouchKey}                    from './types';

// Mocking the decimalPointSplit function
jest.mock('../../utils/decimalPointSplit', () => ({
   decimalPointSplit: jest.fn(),
}));

describe('services/UnitFormService/UnitFormData', () => {
   describe('constructor, formValues, touched, validationResult ', () => {
      it('creates a new UnitFormData instance with default values', () => {
         const formData = new UnitFormData();
         expect(formData.formValues).toEqual({
                                                unitId:            null,
                                                sellerId:          '',
                                                beforePointAmount: '',
                                                afterPointAmount:  '',
                                             });
         expect(formData.touched).toEqual({
                                             sellerId: false,
                                             amount:   false,
                                          })
         expect(formData.validationResult).toBeNull();
      })

      it('creates a new UnitFormData instance with custom values', () => {
         const formData = new UnitFormData({
                                              unitId:            1,
                                              sellerId:          '101',
                                              beforePointAmount: '100',
                                              afterPointAmount:  '50',
                                           });
         expect(formData.formValues).toEqual({
                                                unitId:            1,
                                                sellerId:          '101',
                                                beforePointAmount: '100',
                                                afterPointAmount:  '50',
                                             })
         expect(formData.touched).toEqual({
                                             sellerId: false,
                                             amount:   false,
                                          })
         expect(formData.validationResult).toBeNull();
      })

   });
   describe('createFromUnit', () => {
      it('should correctly create a UnitFormData instance from a valid Unit', () => {
         const unit = {
            id:       1,
            amount:   123.45,
            sellerId: 101
         };
         (decimalPointSplit as jest.Mock).mockReturnValue(['123', '45']);

         const formData = UnitFormData.createFromUnit(unit);

         expect(formData.formValues).toEqual({
                                                unitId:            1,
                                                sellerId:          '101',
                                                beforePointAmount: '123',
                                                afterPointAmount:  '45',
                                             });
      });

      it('should throw an error if decimalPointSplit returns an invalid result', () => {
         const unit = {
            id:       7,
            amount:   321.99,
            sellerId: 107
         };
         (decimalPointSplit as jest.Mock).mockReturnValueOnce(null);

         expect(() => UnitFormData.createFromUnit(unit)).toThrowError();
      });
   });

   describe('createFromQueuedUnit', () => {
      it('should create a UnitFormData instance correctly from a QueuedUnit', () => {
         const queuedUnit = {
            amount:   456.78,
            sellerId: 202
         };
         (decimalPointSplit as jest.Mock).mockReturnValue(['456', '78']);

         const formData = UnitFormData.createFromQueuedUnit(queuedUnit);

         expect(formData.formValues).toEqual({
                                                unitId:            null,
                                                sellerId:          '202',
                                                beforePointAmount: '456',
                                                afterPointAmount:  '78',
                                             });
      });

      it('should throw an error if decimalPointSplit returns an invalid result', () => {
         const queuedUnit = {
            amount:   654.32,
            sellerId: 303
         };
         (decimalPointSplit as jest.Mock).mockReturnValueOnce(null);

         expect(() => UnitFormData.createFromQueuedUnit(queuedUnit)).toThrowError();
      });
   });
   describe('clone', () => {
      it('should return a new UnitFormData instance with identical formValues', () => {
         const initialData = new UnitFormData({
                                                 unitId:            1,
                                                 sellerId:          '1001',
                                                 beforePointAmount: '50',
                                                 afterPointAmount:  '25',
                                              });

         const clonedData = initialData.clone();

         expect(clonedData).not.toBe(initialData); // Ensure it's a new instance
         expect(clonedData.formValues).toEqual(initialData.formValues);
         expect(clonedData.validationResult).toEqual(initialData.validationResult);
         expect(clonedData.touched).toEqual(initialData.touched);
      });
   });

   describe('parsedValues', () => {
      it('should parse valid formValues into ParsedValues', () => {
         const data = new UnitFormData({
                                          unitId:            1,
                                          sellerId:          '101',
                                          beforePointAmount: '100',
                                          afterPointAmount:  '50',
                                       });

         expect(data.parsedValues).toEqual({
                                              sellerId: 101,
                                              amount:   100.50,
                                           });
      });

      it('should return null for sellerId if it is an empty string', () => {
         const data = new UnitFormData({
                                          unitId:            1,
                                          sellerId:          '',
                                          beforePointAmount: '100',
                                          afterPointAmount:  '50',
                                       });

         expect(data.parsedValues).toEqual({
                                              sellerId: null,
                                              amount:   100.50,
                                           });
      });

      it('should return null for amount if both beforePointAmount and afterPointAmount are empty strings', () => {
         const data = new UnitFormData({
                                          unitId:            1,
                                          sellerId:          '101',
                                          beforePointAmount: '',
                                          afterPointAmount:  '',
                                       });

         expect(data.parsedValues).toEqual({
                                              sellerId: 101,
                                              amount:   null,
                                           });
      });

      it('should calculate only the beforePointAmount correctly if afterPointAmount is empty', () => {
         const data = new UnitFormData({
                                          unitId:            1,
                                          sellerId:          '101',
                                          beforePointAmount: '200',
                                          afterPointAmount:  '',
                                       });

         expect(data.parsedValues).toEqual({
                                              sellerId: 101,
                                              amount:   200,
                                           });
      });

      it('should calculate only the afterPointAmount correctly if beforePointAmount is empty', () => {
         const data = new UnitFormData({
                                          unitId:            1,
                                          sellerId:          '101',
                                          beforePointAmount: '',
                                          afterPointAmount:  '75',
                                       });

         expect(data.parsedValues).toEqual({
                                              sellerId: 101,
                                              amount:   0.75,
                                           });
      });

      it('should return null for both sellerId and amount if all fields are empty', () => {
         const data = new UnitFormData({
                                          unitId:            null,
                                          sellerId:          '',
                                          beforePointAmount: '',
                                          afterPointAmount:  '',
                                       });

         expect(data.parsedValues).toEqual({
                                              sellerId: null,
                                              amount:   null,
                                           });
      });
   });

   describe('unit', () => {
      it('should throw an error if sellerId is null', () => {
         const data = new UnitFormData({
                                          unitId:            1,
                                          sellerId:          '',
                                          beforePointAmount: '100',
                                          afterPointAmount:  '50',
                                       });

         expect(() => data.unit).toThrowError('sellerId is null');
      });

      it('should throw an error if amount is null', () => {
         const data = new UnitFormData({
                                          unitId:            1,
                                          sellerId:          '101',
                                          beforePointAmount: '',
                                          afterPointAmount:  '',
                                       });

         expect(() => data.unit).toThrowError('amount is null');
      });

      it('should correctly return a Unit object with valid parsed values', () => {
         const data = new UnitFormData({
                                          unitId:            1,
                                          sellerId:          '101',
                                          beforePointAmount: '100',
                                          afterPointAmount:  '50',
                                       });

         expect(data.unit).toEqual({
                                      id:       1,
                                      sellerId: 101,
                                      amount:   100.50,
                                   });
      });
   });

   describe('equalFormValues', () => {
      it('should return true if two FormValues are identical', () => {
         const formData = new UnitFormData({
                                              unitId:            1,
                                              sellerId:          '101',
                                              beforePointAmount: '100',
                                              afterPointAmount:  '50',
                                           });

         const otherFormValues = {
            unitId:            1,
            sellerId:          '101',
            beforePointAmount: '100',
            afterPointAmount:  '50',
         };

         expect(formData.equalFormValues(otherFormValues)).toBe(true);
      });

      it('should return false if unitId is different', () => {
         const formData = new UnitFormData({
                                              unitId:            1,
                                              sellerId:          '101',
                                              beforePointAmount: '100',
                                              afterPointAmount:  '50',
                                           });

         const otherFormValues = {
            unitId:            2,
            sellerId:          '101',
            beforePointAmount: '100',
            afterPointAmount:  '50',
         };

         expect(formData.equalFormValues(otherFormValues)).toBe(false);
      });

      it('should return false if sellerId is different', () => {
         const formData = new UnitFormData({
                                              unitId:            1,
                                              sellerId:          '101',
                                              beforePointAmount: '100',
                                              afterPointAmount:  '50',
                                           });

         const otherFormValues = {
            unitId:            1,
            sellerId:          '102',
            beforePointAmount: '100',
            afterPointAmount:  '50',
         };

         expect(formData.equalFormValues(otherFormValues)).toBe(false);
      });

      it('should return false if beforePointAmount is different', () => {
         const formData = new UnitFormData({
                                              unitId:            1,
                                              sellerId:          '101',
                                              beforePointAmount: '100',
                                              afterPointAmount:  '50',
                                           });

         const otherFormValues = {
            unitId:            1,
            sellerId:          '101',
            beforePointAmount: '101',
            afterPointAmount:  '50',
         };

         expect(formData.equalFormValues(otherFormValues)).toBe(false);
      });

      it('should return false if afterPointAmount is different', () => {
         const formData = new UnitFormData({
                                              unitId:            1,
                                              sellerId:          '101',
                                              beforePointAmount: '100',
                                              afterPointAmount:  '50',
                                           });

         const otherFormValues = {
            unitId:            1,
            sellerId:          '101',
            beforePointAmount: '100',
            afterPointAmount:  '55',
         };

         expect(formData.equalFormValues(otherFormValues)).toBe(false);
      });
   });

   describe('blank', () => {
      it('should return true if all fields are empty', () => {
         const formData = new UnitFormData({
                                              unitId:            null,
                                              sellerId:          '',
                                              beforePointAmount: '',
                                              afterPointAmount:  '',
                                           });

         expect(formData.blank).toBe(true);
      });

      it('should return false if sellerId is not empty', () => {
         const formData = new UnitFormData({
                                              unitId:            null,
                                              sellerId:          '101',
                                              beforePointAmount: '',
                                              afterPointAmount:  '',
                                           });

         expect(formData.blank).toBe(false);
      });

      it('should return false if beforePointAmount is not empty', () => {
         const formData = new UnitFormData({
                                              unitId:            null,
                                              sellerId:          '',
                                              beforePointAmount: '200',
                                              afterPointAmount:  '',
                                           });

         expect(formData.blank).toBe(false);
      });

      it('should return false if afterPointAmount is not empty', () => {
         const formData = new UnitFormData({
                                              unitId:            null,
                                              sellerId:          '',
                                              beforePointAmount: '',
                                              afterPointAmount:  '50',
                                           });

         expect(formData.blank).toBe(false);
      });

      it('should return false if multiple fields are not empty', () => {
         const formData = new UnitFormData({
                                              unitId:            null,
                                              sellerId:          '101',
                                              beforePointAmount: '200',
                                              afterPointAmount:  '50',
                                           });

         expect(formData.blank).toBe(false);
      });
   });
   describe('valid', () => {
      it('should return true if validationResult is valid', () => {
         const formData = new UnitFormData();
         formData.validationResult = new UnitFormDataValidatorResult([], []);
         expect(formData.valid).toBe(true);
      });

      it('should return false if validationResult is invalid', () => {
         const formData = new UnitFormData();
         formData.validationResult = new UnitFormDataValidatorResult(['error message'], []);
         expect(formData.valid).toBe(false);
         formData.validationResult = new UnitFormDataValidatorResult([], ['error message']);
         expect(formData.valid).toBe(false);
      });

      it('should return false if validationResult is null', () => {
         const formData = new UnitFormData();
         formData.validationResult = null;
         expect(formData.valid).toBe(false);
      });
   });

   describe('change', () => {
      it('should update formValues with new values', () => {
         const formData = new UnitFormData({
                                              unitId:            null,
                                              sellerId:          '',
                                              beforePointAmount: '100',
                                              afterPointAmount:  '50',
                                           });

         formData.change({sellerId: '102'});

         expect(formData.formValues).toEqual({
                                                unitId:            null,
                                                sellerId:          '102',
                                                beforePointAmount: '100',
                                                afterPointAmount:  '50',
                                             });
      });

      it('should update multiple fields in formValues', () => {
         const formData = new UnitFormData({
                                              unitId:            1,
                                              sellerId:          '101',
                                              beforePointAmount: '100',
                                              afterPointAmount:  '50',
                                           });

         formData.change({
                            beforePointAmount: '200',
                            afterPointAmount:  '75'
                         });

         expect(formData.formValues).toEqual({
                                                unitId:            1,
                                                sellerId:          '101',
                                                beforePointAmount: '200',
                                                afterPointAmount:  '75',
                                             });
      });

      it('should reset validationResult to null', () => {
         const formData = new UnitFormData({
                                              unitId:            3,
                                              sellerId:          '404',
                                              beforePointAmount: '50',
                                              afterPointAmount:  '10',
                                           });

         formData.validationResult = new UnitFormDataValidatorResult([], []);
         formData.change({sellerId: '505'});

         expect(formData.validationResult).toBeNull();
      });
   });

   describe('touch', () => {
      it('should set touched.sellerId to true when key is sellerId', () => {
         const formData = new UnitFormData();

         formData.touch('sellerId');

         expect(formData.touched).toEqual({
                                             sellerId: true,
                                             amount:   false,
                                          });
      });

      it('should set touched.amount to true when key is beforePointAmount', () => {
         const formData = new UnitFormData();

         formData.touch('beforePointAmount');

         expect(formData.touched).toEqual({
                                             sellerId: false,
                                             amount:   true,
                                          });
      });

      it('should set touched.amount to true when key is afterPointAmount', () => {
         const formData = new UnitFormData();

         formData.touch('afterPointAmount');

         expect(formData.touched).toEqual({
                                             sellerId: false,
                                             amount:   true,
                                          });
      });

      it('should throw an error when an unsupported key is passed', () => {
         const formData = new UnitFormData();

         expect(() => formData.touch('unsupportedKey' as TouchKey)).toThrowError('Unsupported key.');
      });
   });
});
