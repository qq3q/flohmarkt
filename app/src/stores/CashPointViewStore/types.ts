export type TransactionListItem = {
   createdAt: string | null;
   amount: number;
   selected: boolean;
   canSelect: boolean;
   select: () => void;
};

export type TransactionListData = TransactionListItem[];
