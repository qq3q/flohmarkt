import {UnitFormData} from './UnitFormData';
import {UnitFormDataValidatorResult} from './UnitFormDataValidatorResult';

export class UnitFormDataValidator {
   constructor(private readonly validSellerIds: number[]) {
   }

   validate(formData: UnitFormData): void {
      const sellerIdErrors: string[] = [];
      const amountErrors: string[] = [];
      if (!formData.blank) {
         const {sellerId, amount} = formData.parsedValues;
         if (sellerId === null) {
            sellerIdErrors.push('Bitte Verkäufernummer angeben.');
         } else if (!this.validSellerIds.includes(sellerId)) {
            sellerIdErrors.push('Verkäufernummer nicht gefunden.');
         }
         if (amount === null) {
            amountErrors.push('Bitte gültigen Betrag angeben.');
         }
      }
      formData.validationResult = new UnitFormDataValidatorResult(sellerIdErrors, amountErrors);
   }
}