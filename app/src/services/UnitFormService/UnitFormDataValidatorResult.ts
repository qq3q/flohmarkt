export class UnitFormDataValidatorResult {

   constructor(public readonly sellerIdErrors: string[], public readonly amountErrors: string[]) {
   }

   get valid(): boolean {

      return this.sellerIdErrors.length === 0 && this.amountErrors.length === 0;
   }

   // get sellerIdInvalid(): boolean {
   //
   //    return this.sellerIdErrors.length > 0
   // }
   //
   // get amountInvalid(): boolean {
   //
   //    return this.amountErrors.length > 0;
   // }

   getErrors(includeSellerIdErrors: boolean, includeAmountErrors: boolean): string[] {
      let errors: string[] = includeSellerIdErrors ? this.sellerIdErrors : [];
      if (includeAmountErrors) {
         errors = [...errors, ...this.amountErrors];
      }

      return errors;
   }
}
