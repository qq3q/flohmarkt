const formatter = new Intl.NumberFormat('de-DE', {
   minimumFractionDigits: 0,
   maximumFractionDigits: 5
});

export const formatNumber = (number: number) => formatter.format(number);
