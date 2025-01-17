import {CashPointEventStore} from '../CashPointEventStore';
import {QueuedUnitsStore}    from '../QueuedUnitsStore';
import {SecurityStore}       from '../SecurityStore';
import {TransactionStore} from '../TransactionStore';
import {UnitsFormsStore}  from '../UnitsFormStore';

export class RootStore {
   public readonly cashPointEventStore: CashPointEventStore;
   public readonly queuedUnitsStore: QueuedUnitsStore;
   public readonly securityStore: SecurityStore;
   public readonly transactionStore: TransactionStore;
   public readonly unitsFormStore: UnitsFormsStore;

   constructor() {
      this.cashPointEventStore = new CashPointEventStore(this);
      this.queuedUnitsStore = new QueuedUnitsStore(this);
      this.securityStore = new SecurityStore(this);
      this.transactionStore = new TransactionStore(this);
      this.unitsFormStore = new UnitsFormsStore(this);
   }
}
