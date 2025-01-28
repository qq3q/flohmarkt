import {Unit}                                             from '../CashPointEventStore/types';
import {UnitFormData, UnitFormDataValidator}              from '../../services/UnitFormService';
import {FormValues, TouchKey}                             from '../../services/UnitFormService/types';
import {action, computed, makeAutoObservable, observable} from 'mobx';
import {RootStore}                                        from '../RootStore/RootStore';
import {QueuedUnit}                                       from '../QueuedUnitsStore/types';

export class UnitsFormsStore {
   private _validator: UnitFormDataValidator | null = null;
   private _initialFormDataArr: UnitFormData[] | null = null;
   private _formDataArr: UnitFormData[] | null = null;

   constructor(public readonly rootStore: RootStore) {
      makeAutoObservable<UnitsFormsStore, '_initialFormDataArr' | '_formDataArr'>(this, {
         _initialFormDataArr: observable,
         _formDataArr       : observable,
         formDataArr        : computed,
         changed            : computed,
         valid              : computed,
         empty              : computed,
         units              : computed,
         open               : action,
         close              : action,
         change             : action,
         addQueuedUnits     : action,
         remove             : action,
      });
   }

   private get validator(): UnitFormDataValidator {
      if (this._validator === null) {

         throw new Error('UnitsFormValuesStore not opened.');
      }

      return this._validator;
   }

   get initialFormDataArr(): UnitFormData[] {
      if (this._initialFormDataArr === null) {

         throw new Error('UnitsFormValuesStore not opened.');
      }

      return this._initialFormDataArr;
   }

   get formDataArr(): UnitFormData[] {
      if (this._formDataArr === null) {

         throw new Error('UnitsFormValuesStore not opened.');
      }

      return this._formDataArr;
   }

   get changed(): boolean {
      if (this.formDataArr.length !== this.initialFormDataArr.length) {

         return true;
      }
      for (let i = 0; i < this.formDataArr.length; i++) {
         const formData = this.formDataArr[i];
         const initialFormValues = this.initialFormDataArr[i].formValues;
         if (!formData.equalFormValues(initialFormValues)) {

            return true;
         }
      }
      return false;
   }

   get valid(): boolean {
      for (const formData of this.formDataArr) {
         if (!formData.valid) {

            return false;
         }
      }

      return true;
   }

   get empty(): boolean {

      return this
         .formDataArr
         .find(formData => !formData.blank) === undefined;
   }

   get units(): Unit[] {
      if (!this.valid) {

         throw new Error('Form data is not valid.');
      }

      return this.formDataArr
                 .filter(formData => !formData.blank)
                 .map(formData => formData.unit);
   }

   open(units: Unit[], validSellerIds: number[]): void {
      this.close();
      this._validator = new UnitFormDataValidator(validSellerIds);
      const formDataArr: UnitFormData[] = units.map(unit => UnitFormData.createFromUnit(unit));
      formDataArr.forEach(formData => {
         this.validator.validate(formData);
      })
      formDataArr.push(this.createBlankFormData());
      this._initialFormDataArr = formDataArr;
      this._formDataArr = formDataArr;
      this.rootStore.queuedUnitsStore.subscribe(this.addQueuedUnits);
   }

   close(): void {
      this.rootStore.queuedUnitsStore.unsubscribe();
      this._validator = null;
      this._initialFormDataArr = [];
      this._formDataArr = [];
   }

   change(index: number, newFormValues: Partial<FormValues>): void {
      const formDataArr = [...this.formDataArr];
      formDataArr[index] = formDataArr[index].clone();
      formDataArr[index].change(newFormValues);

      if (formDataArr[index].blank) {
         if (index < this.formDataArr.length - 1) {
            formDataArr.splice(index, 1);
            this._formDataArr = formDataArr;

            return;
         }
      }
      this.validator.validate(formDataArr[index]);
      if (index === this.formDataArr.length - 1 && formDataArr[index].valid && !formDataArr[index].blank) {
          formDataArr.push(this.createBlankFormData());
      }
      this._formDataArr = formDataArr;
   }

   addQueuedUnits = (units: QueuedUnit[]) => {
      const formDataArr = this.formDataArr.filter(formData => !formData.blank);
      units.forEach(unit => {
         const formData = UnitFormData.createFromQueuedUnit(unit);
         formDataArr.push(formData);
         this.validator.validate(formData);
         formData.touch('sellerId');
         formData.touch('beforePointAmount');
         formData.touch('afterPointAmount');
      });
      formDataArr.push(this.createBlankFormData());
      this._formDataArr = formDataArr;
   }

   touch(index: number, key: TouchKey): void {
      const formDataArr = [...this.formDataArr];
      formDataArr[index] = formDataArr[index].clone();
      formDataArr[index].touch(key);
      this._formDataArr = formDataArr;
   }

   remove(index: number): void {
      const formDataArr = [...this.formDataArr];
      formDataArr.splice(index, 1);
      this._formDataArr = [...formDataArr];
   }

   private createBlankFormData(): UnitFormData {
      const formData = new UnitFormData();
      this.validator.validate(formData);

      return formData;
   }
}
