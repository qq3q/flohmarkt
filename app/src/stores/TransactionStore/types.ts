export interface UnitRow {
   synced: boolean,
   syncMode: 'off' | 'update' | 'delete',
   syncing: boolean,
   syncFailed: boolean,
   invalid: string[],
   id: string | null,
   sellerId: number,
   amount: number,
}
