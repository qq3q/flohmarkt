export interface FormValues {
   unitId: number | null,
   sellerId: string,
   beforePointAmount: string,
   afterPointAmount: string,
}

export interface ParsedValues {
   sellerId: number | null,
   amount: number | null,
}

export interface TouchedData {
   sellerId: boolean,
   amount: boolean,
}

export type TouchKey = 'sellerId' | 'beforePointAmount' | 'afterPointAmount';
