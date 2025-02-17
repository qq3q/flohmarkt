import {ResultViewStore}     from './ResultViewStore';
import {RootStore}           from '../RootStore/RootStore';
import {CashPointEventModel} from '../../models/CashPointEventModel';

jest.mock('../../models/CashPointEventModel', () => ({
   CashPointEventModel: {
      createInstance: jest.fn(),
   },
}));

describe('stores/ResultViewStore', () => {
   describe('sellerAmountsListData', () => {
      it('should return sorted seller amounts list with proper active status', () => {
         const mockCashPointEventStore = {
            sellerIds: [1, 2],
            event:     {
               donationRate: 0.15,
            },
         };

         const mockRootStore: RootStore = {
            cashPointEventStore: mockCashPointEventStore,
         } as unknown as RootStore;

         const mockSellerAmounts = new Map<number, number>([
                                                              [2, 100],
                                                              [3, 150],
                                                           ]);

         ((CashPointEventModel).createInstance as any).mockReturnValue({
                                                                          sellerAmounts: mockSellerAmounts,
                                                                       });

         const resultViewStore = new ResultViewStore(mockRootStore);

         const result = resultViewStore.sellerAmountsListData;

         expect(result).toEqual([
                                   {
                                      sellerId:     1,
                                      donation:     0,
                                      sellerAmount: 0,
                                      amount:       0,
                                      sellerActive: true
                                   },
                                   {
                                      sellerId:     2,
                                      donation:     15,
                                      sellerAmount: 85,
                                      amount:       100,
                                      sellerActive: true
                                   },
                                   {
                                      sellerId:     3,
                                      donation:     22.5,
                                      sellerAmount: 127.5,
                                      amount:       150,
                                      sellerActive: false
                                   },
                                ]);
      });

      it('should handle empty seller amounts and active seller IDs', () => {
         const mockCashPointEventStore = {
            sellerIds: [],
            event:     {
               donationRate: 0.15,
            },
         };

         const mockRootStore: RootStore = {
            cashPointEventStore: mockCashPointEventStore,
         } as unknown as RootStore;

         (CashPointEventModel.createInstance as any).mockReturnValue({
                                                                        sellerAmounts: new Map<number, number>(),
                                                                     });

         const resultViewStore = new ResultViewStore(mockRootStore);

         const result = resultViewStore.sellerAmountsListData;

         expect(result).toEqual([]);
      });
   });

   describe('paymentTypeListData', () => {
      it('should return a list of payment types with their corresponding amounts', () => {
         const mockCashPointEventStore = {
            paymentTypes: ['Credit', 'Cash'],
            event:        {mockEvent: true},
         };

         const mockRootStore: RootStore = {
            cashPointEventStore: mockCashPointEventStore,
         } as unknown as RootStore;

         const mockPaymentTypeAmounts = new Map<string, number>([
                                                                   ['Credit', 200],
                                                                   ['Cash', 50],
                                                                ]);

         (CashPointEventModel.createInstance as any).mockReturnValue({
                                                                        paymentTypeAmounts: mockPaymentTypeAmounts,
                                                                     });

         const resultViewStore = new ResultViewStore(mockRootStore);

         const result = resultViewStore.paymentTypeListData;

         expect(result).toEqual([
                                   {paymentType: 'Credit', amount: 200},
                                   {paymentType: 'Cash', amount: 50},
                                ]);
      });

      it('should handle payment types without corresponding amounts', () => {
         const mockCashPointEventStore = {
            paymentTypes: ['Credit', 'Cash'],
            event:        {mockEvent: true},
         };

         const mockRootStore: RootStore = {
            cashPointEventStore: mockCashPointEventStore,
         } as unknown as RootStore;

         const mockPaymentTypeAmounts = new Map<string, number>();

         (CashPointEventModel.createInstance as any).mockReturnValue({
                                                                        paymentTypeAmounts: mockPaymentTypeAmounts,
                                                                     });

         const resultViewStore = new ResultViewStore(mockRootStore);

         const result = resultViewStore.paymentTypeListData;

         expect(result).toEqual([
                                   {paymentType: 'Credit', amount: 0},
                                   {paymentType: 'Cash', amount: 0},
                                ]);
      });
   });
});