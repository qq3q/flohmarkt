export const decimalPointSplit = (num: number, decimalPlaces = 2): [string, string] => {
   const numStr = num.toFixed(decimalPlaces);
   const parts = numStr.split('.');

   return [parts[0], parts.length > 1 ? parts[1] : ''];
}
