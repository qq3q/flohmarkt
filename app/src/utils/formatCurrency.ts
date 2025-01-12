const formatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

export const formatCurrency = (number: number) => formatter.format(number);
