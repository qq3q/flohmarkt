import {UnitsFormsStore} from './UnitsFormsStore';
import {RootStore}       from '../RootStore/RootStore';
import {Unit}            from '../CashPointEventStore/types';

describe('stores/UnitsFormsStore', () => {
   let rootStore: RootStore;
   let unitsFormsStore: UnitsFormsStore;

   beforeEach(() => {
      jest.clearAllMocks();
      rootStore = {
         queuedUnitsStore: {
                              subscribe:   jest.fn(),
                              unsubscribe: jest.fn(),
                           } as unknown,

      } as RootStore;
      unitsFormsStore = new UnitsFormsStore(rootStore);
   });

   describe('open', () => {
      it('should initialize form data when opened', () => {
         const units = [{
            id:       1,
            amount:   100.0,
            sellerId: 2
         }];
         const validSellerIds = [2];

         unitsFormsStore.open(units, validSellerIds);

         expect(unitsFormsStore.formDataArr).toHaveLength(units.length + 1);
         expect(unitsFormsStore.initialFormDataArr).toHaveLength(units.length + 1);
         expect((rootStore.queuedUnitsStore.subscribe as jest.Mock).mock.calls.length).toBe(1);
      });

      it('should throw an error when accessing formDataArr before opening', () => {
         expect(() => unitsFormsStore.formDataArr).toThrow('UnitsFormValuesStore not opened.');
      });
   });

   describe('close', () => {
      it('should reset the store when closed', () => {
         const units = [{
            id:       1,
            amount:   100.0,
            sellerId: 2
         }];
         const validSellerIds = [2];
         unitsFormsStore.open(units, validSellerIds);

         unitsFormsStore.close();

         expect(() => unitsFormsStore.formDataArr).toThrow('UnitsFormValuesStore not opened.');
         expect(() => unitsFormsStore.initialFormDataArr).toThrow('UnitsFormValuesStore not opened.');
      });
   });

   describe('changed', () => {
      it('should return false if formDataArr matches initialFormDataArr', () => {
         const units = [{
            id:       1,
            amount:   100.0,
            sellerId: 2
         }];
         const validSellerIds = [2];
         unitsFormsStore.open(units, validSellerIds);

         expect(unitsFormsStore.changed).toBe(false);
      });

      it('should return true if formDataArr does not match initialFormDataArr', () => {
         const units = [{
            id:       1,
            amount:   100.0,
            sellerId: 2
         }];
         const validSellerIds = [2];
         unitsFormsStore.open(units, validSellerIds);

         unitsFormsStore.change(0, {sellerId: '3'});

         expect(unitsFormsStore.changed).toBe(true);
      });
   });

   describe('valid', () => {
      it('should return true if all formData are valid', () => {
         const units = [{
            id:       1,
            amount:   100.0,
            sellerId: 2
         }];
         const validSellerIds = [2];
         unitsFormsStore.open(units, validSellerIds);

         expect(unitsFormsStore.valid).toBe(true);
      });

      it('should return false if any formData is invalid', () => {
         const units = [{
            id:       1,
            amount:   100.0,
            sellerId: 2
         }];
         const validSellerIds = [3];
         unitsFormsStore.open(units, validSellerIds);

         expect(unitsFormsStore.valid).toBe(false);
      });
   });

   describe('empty', () => {
      it('should return true if all form data are blank', () => {
         const units: Unit[] = [];
         const validSellerIds = [2];
         unitsFormsStore.open(units, validSellerIds);

         expect(unitsFormsStore.empty).toBe(true);
      });

      it('should return false if some form data are not blank', () => {
         const units = [{
            id:       1,
            amount:   100.0,
            sellerId: 2
         }];
         const validSellerIds = [2];
         unitsFormsStore.open(units, validSellerIds);

         expect(unitsFormsStore.empty).toBe(false);
      });
   });

   describe('units', () => {
      it('should return a list of valid units', () => {
         const units = [{
            id:       1,
            amount:   100.0,
            sellerId: 2
         }];
         const validSellerIds = [2];
         unitsFormsStore.open(units, validSellerIds);

         expect(unitsFormsStore.units).toEqual([units[0]]);
      });

      it('should throw an error when form data is invalid', () => {
         const units = [{
            id:       1,
            amount:   100.0,
            sellerId: 2
         }];
         const validSellerIds = [3];
         unitsFormsStore.open(units, validSellerIds);

         expect(() => unitsFormsStore.units).toThrow('Form data is not valid.');
      });
   });

   describe('change', () => {
      it('should update form data at the specified index', () => {
         const units = [{
            id:       1,
            amount:   100.0,
            sellerId: 2
         }];
         const validSellerIds = [2];
         unitsFormsStore.open(units, validSellerIds);

         unitsFormsStore.change(0, {sellerId: '3'});

         expect(unitsFormsStore.formDataArr[0].formValues.sellerId).toBe('3');
      });
   });

   describe('remove', () => {
      it('should remove form data at the specified index', () => {
         const units = [{
            id:       1,
            amount:   100.0,
            sellerId: 2
         }];
         const validSellerIds = [2];
         unitsFormsStore.open(units, validSellerIds);

         unitsFormsStore.remove(0);

         expect(unitsFormsStore.formDataArr.find(data => data.formValues.unitId === 1)).toBeUndefined();
      });
   });

   describe('addQueuedUnits', () => {
      it('should add queued units to the form data', () => {
         const units = [{
            id:       1,
            amount:   100.0,
            sellerId: 2
         }];
         const queuedUnits = [{
            amount:   50.0,
            sellerId: 3
         }];
         const validSellerIds = [2, 3];
         unitsFormsStore.open(units, validSellerIds);

         unitsFormsStore.addQueuedUnits(queuedUnits);

         expect(unitsFormsStore.formDataArr).toHaveLength(3);
      });
   });
});