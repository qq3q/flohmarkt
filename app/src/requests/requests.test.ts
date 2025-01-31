import {
   activeEventRequest, deleteTransactionRequest, fetchUserQueuedUnitsRequest,
   loginRequest,
   logoutRequest,
   saveTransactionRequest,
   sellerIdsRequest,
   userRequest
} from './requests';
import {getAuthorizationHeader}                   from './helpers';
import {RequestError, ResponseError, StatusError} from './errors';
import {PaymentType, Transaction}                 from '../stores/CashPointEventStore/types';

global.fetch = jest.fn();

describe('requests/requests', () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   describe('loginRequest', () => {
      it('should return response text when the request is successful', async() => {
         const mockResponse = 'Success';
         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok:   true,
                                                       text: jest.fn().mockResolvedValueOnce(mockResponse),
                                                    });

         const result = await loginRequest('testUser', 'testPassword');
         expect(result).toBe(mockResponse);
         expect(fetch).toHaveBeenCalledTimes(1);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/login'), {
            method:  'POST',
            body:    JSON.stringify({
                                       username: 'testUser',
                                       password: 'testPassword'
                                    }),
            headers: {'Content-Type': 'application/json'},
         });
      });

      it('should throw a RequestError when the fetch call fails', async() => {
         const mockError = new Error('Network Error');
         (fetch as jest.Mock).mockRejectedValueOnce(mockError);

         await expect(loginRequest('testUser', 'testPassword')).rejects.toThrowError('Login request fails.');
         expect(fetch).toHaveBeenCalledTimes(1);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/login'), {
            method:  'POST',
            body:    JSON.stringify({
                                       username: 'testUser',
                                       password: 'testPassword'
                                    }),
            headers: {'Content-Type': 'application/json'},
         });
      });

      it('should throw a StatusError when the response is not ok', async() => {
         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok:     false,
                                                       status: 400,
                                                    });

         await expect(loginRequest('testUser', 'testPassword')).rejects.toThrowError('Login response status is not ok.');
         expect(fetch).toHaveBeenCalledTimes(1);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/login'), {
            method:  'POST',
            body:    JSON.stringify({
                                       username: 'testUser',
                                       password: 'testPassword'
                                    }),
            headers: {'Content-Type': 'application/json'},
         });
      });

      it('should throw a ResponseError when the text method fails', async() => {
         const mockResponse = {
            ok:   true,
            text: jest.fn().mockRejectedValueOnce(new Error('Text parse error')),
         };
         (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

         await expect(loginRequest('testUser', 'testPassword')).rejects.toThrowError('Login response is not json.');
         expect(fetch).toHaveBeenCalledTimes(1);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/login'), {
            method:  'POST',
            body:    JSON.stringify({
                                       username: 'testUser',
                                       password: 'testPassword'
                                    }),
            headers: {'Content-Type': 'application/json'},
         });
      });
   });

   describe('logoutRequest', () => {
      it('should successfully log out when the request is successful', async() => {
         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok: true,
                                                    });

         await expect(logoutRequest()).resolves.not.toThrow();
         expect(fetch).toHaveBeenCalledTimes(1);
         expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/logout'),
            {headers: getAuthorizationHeader()}
         );
      });

      it('should throw a RequestError when the fetch call fails', async() => {
         const mockError = new Error('Network Error');
         (fetch as jest.Mock).mockRejectedValueOnce(mockError);

         await expect(logoutRequest()).rejects.toThrowError('Logout request fails.');
         expect(fetch).toHaveBeenCalledTimes(1);
         expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/logout'),
            {headers: getAuthorizationHeader()}
         );
      });

      it('should throw a StatusError when the response status is not ok', async() => {
         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok:     false,
                                                       status: 400,
                                                    });

         await expect(logoutRequest()).rejects.toThrowError('Logout response status is not ok.');
         expect(fetch).toHaveBeenCalledTimes(1);
         expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/logout'),
            {headers: getAuthorizationHeader()}
         );
      });
   });

   describe('userRequest', () => {
      const mockToken = 'mockToken';
      const mockResponseData = {
         id:   1,
         name: 'John Doe'
      };

      it('should successfully fetch and return data when response is valid', async() => {
         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok:   true,
                                                       json: async() => mockResponseData
                                                    } as unknown as Response);

         const result = await userRequest(mockToken);
         expect(result).toEqual(mockResponseData);
         expect(fetch).toHaveBeenCalledWith('https://REST_HOST/user', {
            headers: {Authorization: `Bearer ${mockToken}`},
         });
      });

      it('should throw RequestError when fetch fails', async() => {
         (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

         await expect(userRequest(mockToken)).rejects.toThrow(RequestError);
         expect(global.fetch).toHaveBeenCalledWith('https://REST_HOST/user', {
            headers: {Authorization: `Bearer ${mockToken}`},
         });
      });

      it('should throw StatusError when response status is not ok', async() => {
         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok:     false,
                                                       status: 403
                                                    } as Response);

         await expect(userRequest(mockToken)).rejects.toThrow(StatusError);
         expect(global.fetch).toHaveBeenCalledWith('https://REST_HOST/user', {
            headers: {Authorization: `Bearer ${mockToken}`},
         });
      });

      it('should throw ResponseError when response is not JSON', async() => {
         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok:   true,
                                                       json: async() => {
                                                          throw new Error('Invalid JSON');
                                                       }
                                                    } as unknown as Response);

         await expect(userRequest(mockToken)).rejects.toThrow(ResponseError);
         expect(global.fetch).toHaveBeenCalledWith('https://REST_HOST/user', {
            headers: {Authorization: `Bearer ${mockToken}`},
         });
      });

      it('should call fetch with undefined token when no token is provided', async() => {
         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok:   true,
                                                       json: async() => mockResponseData,
                                                    } as Response);

         const result = await userRequest();
         expect(result).toEqual(mockResponseData);
         expect(fetch).toHaveBeenCalledWith('https://REST_HOST/user', {
            headers: {Authorization: 'Bearer null'},
         });
      });
   });

   describe('activeEventRequest', () => {
      it('should successfully fetch and return active event data when response is valid', async() => {
         const mockResponseData = {
            id:   1,
            name: 'Active Event'
         };

         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok:   true,
                                                       json: jest.fn().mockResolvedValueOnce(mockResponseData),
                                                    } as unknown as Response);

         const result = await activeEventRequest();
         expect(result).toEqual(mockResponseData);
         expect(fetch).toHaveBeenCalledTimes(1);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/active-event'), {
            headers: getAuthorizationHeader(),
         });
      });

      it('should throw a RequestError when the fetch call fails', async() => {
         const mockError = new Error('Network Error');
         (fetch as jest.Mock).mockRejectedValueOnce(mockError);

         await expect(activeEventRequest()).rejects.toThrow(RequestError);
         expect(fetch).toHaveBeenCalledTimes(1);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/active-event'), {
            headers: getAuthorizationHeader(),
         });
      });

      it('should throw a StatusError when the response status is not ok', async() => {
         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok:     false,
                                                       status: 404,
                                                    } as Response);

         await expect(activeEventRequest()).rejects.toThrow(StatusError);
         expect(fetch).toHaveBeenCalledTimes(1);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/active-event'), {
            headers: getAuthorizationHeader(),
         });
      });

      it('should throw a ResponseError when the response is not JSON', async() => {
         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok:   true,
                                                       json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON')),
                                                    } as unknown as Response);

         await expect(activeEventRequest()).rejects.toThrow(ResponseError);
         expect(fetch).toHaveBeenCalledTimes(1);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/active-event'), {
            headers: getAuthorizationHeader(),
         });
      });
   });

   describe('sellerIdsRequest', () => {
      it('should successfully fetch and return seller IDs when the response is valid', async() => {
         const mockResponseData = [{
            id:   1,
            name: 'Seller A'
         }];

         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok:   true,
                                                       json: async() => mockResponseData
                                                    } as unknown as Response);

         const result = await sellerIdsRequest();
         expect(result).toEqual(mockResponseData);
         expect(fetch).toHaveBeenCalledTimes(1);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/seller-ids'), {
            headers: getAuthorizationHeader()
         });
      });

      it('should throw a RequestError when the fetch call fails', async() => {
         const mockError = new Error('Network Error');

         (fetch as jest.Mock).mockRejectedValueOnce(mockError);

         await expect(sellerIdsRequest()).rejects.toThrow(RequestError);
         expect(fetch).toHaveBeenCalledTimes(1);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/seller-ids'), {
            headers: getAuthorizationHeader()
         });
      });

      it('should throw a StatusError when the response status is not ok', async() => {
         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok:     false,
                                                       status: 403
                                                    } as Response);

         await expect(sellerIdsRequest()).rejects.toThrow(StatusError);
         expect(fetch).toHaveBeenCalledTimes(1);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/seller-ids'), {
            headers: getAuthorizationHeader()
         });
      });

      it('should throw a ResponseError when the response is not JSON', async() => {
         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok:   true,
                                                       json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON'))
                                                    } as unknown as Response);

         await expect(sellerIdsRequest()).rejects.toThrow(ResponseError);
         expect(fetch).toHaveBeenCalledTimes(1);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/seller-ids'), {
            headers: getAuthorizationHeader()
         });
      });
   });

   describe('saveTransactionRequest', () => {
      it('should send a POST request when the transaction ID is null and return response text', async() => {
         const transaction: Transaction = {
            id:          null,
            createdAt:   '2023-10-26T10:20:30Z',
            paymentType: 'CREDIT_CARD' as PaymentType,
            units:       []
         };
         const mockResponse = 'Transaction Saved';

         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok:   true,
                                                       text: jest.fn().mockResolvedValueOnce(mockResponse)
                                                    });

         const result = await saveTransactionRequest(transaction);

         expect(result).toBe(mockResponse);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/transaction'), {
            method:  'POST',
            headers: getAuthorizationHeader(),
            body:    JSON.stringify(transaction)
         });
      });

      it('should send a PATCH request when the transaction ID is not null and return an empty string', async() => {
         const transaction: Transaction = {
            id:          1,
            createdAt:   '2023-10-26T10:20:30Z',
            paymentType: 'CREDIT_CARD' as PaymentType,
            units:       []
         };

         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok: true
                                                    });

         const result = await saveTransactionRequest(transaction);

         expect(result).toBe('');
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/transaction/1'), {
            method:  'PATCH',
            headers: getAuthorizationHeader(),
            body:    JSON.stringify(transaction)
         });
      });

      it('should throw RequestError when the fetch call fails', async() => {
         const transaction: Transaction = {
            id:          null,
            createdAt:   '2023-10-26T10:20:30Z',
            paymentType: 'CASH' as PaymentType,
            units:       []
         };

         (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

         await expect(saveTransactionRequest(transaction)).rejects.toThrow(RequestError);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/transaction'), {
            method:  'POST',
            headers: getAuthorizationHeader(),
            body:    JSON.stringify(transaction)
         });
      });

      it('should throw StatusError when response status is not ok', async() => {
         const transaction: Transaction = {
            id:          null,
            createdAt:   '2023-10-26T10:20:30Z',
            paymentType: 'CASH' as PaymentType,
            units:       []
         };

         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok:     false,
                                                       status: 400
                                                    });

         await expect(saveTransactionRequest(transaction)).rejects.toThrow(StatusError);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/transaction'), {
            method:  'POST',
            headers: getAuthorizationHeader(),
            body:    JSON.stringify(transaction)
         });
      });

      it('should throw ResponseError when text method throws while posting', async() => {
         const transaction: Transaction = {
            id:          null,
            createdAt:   '2023-10-26T10:20:30Z',
            paymentType: 'CASH' as PaymentType,
            units:       []
         };

         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok:   true,
                                                       text: jest.fn().mockRejectedValueOnce(new Error('Text method error'))
                                                    });

         await expect(saveTransactionRequest(transaction)).rejects.toThrow(ResponseError);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/transaction'), {
            method:  'POST',
            headers: getAuthorizationHeader(),
            body:    JSON.stringify(transaction)
         });
      });
   });

   describe('deleteTransactionRequest', () => {
      it('should successfully delete a transaction', async() => {
         (fetch as jest.Mock).mockResolvedValueOnce({ok: true} as Response);

         await expect(deleteTransactionRequest(123)).resolves.not.toThrow();
         expect(fetch).toHaveBeenCalledTimes(1);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/transaction/123'), {
            method:  'DELETE',
            headers: getAuthorizationHeader(),
         });
      });

      it('should throw a RequestError when the fetch call fails', async() => {
         (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

         await expect(deleteTransactionRequest(123)).rejects.toThrow(RequestError);
         expect(fetch).toHaveBeenCalledTimes(1);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/transaction/123'), {
            method:  'DELETE',
            headers: getAuthorizationHeader(),
         });
      });

      it('should throw a StatusError when the response status is not ok', async() => {
         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok:     false,
                                                       status: 400,
                                                    } as Response);

         await expect(deleteTransactionRequest(123)).rejects.toThrow(StatusError);
         expect(fetch).toHaveBeenCalledTimes(1);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/transaction/123'), {
            method:  'DELETE',
            headers: getAuthorizationHeader(),
         });
      });
   });

   describe('fetchUserQueuedUnitsRequest', () => {

      it('should return valid JSON data when the request is successful', async () => {
         const mockResponse = {queuedUnits: [1, 2, 3]};
         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok: true,
                                                       json: async () => mockResponse,
                                                    } as unknown as Response);

         const result = await fetchUserQueuedUnitsRequest();
         expect(result).toEqual(mockResponse);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/fetch-user-queued-units'), {
            method: 'DELETE',
            headers: getAuthorizationHeader(),
         });
      });

      it('should throw RequestError when the fetch call fails', async () => {
         const mockError = new Error('Network Error');
         (fetch as jest.Mock).mockRejectedValueOnce(mockError);

         await expect(fetchUserQueuedUnitsRequest()).rejects.toThrow(RequestError);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/fetch-user-queued-units'), {
            method: 'DELETE',
            headers: getAuthorizationHeader(),
         });
      });

      it('should throw StatusError when the response status is not ok', async () => {
         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok: false,
                                                       status: 400,
                                                    } as Response);

         await expect(fetchUserQueuedUnitsRequest()).rejects.toThrow(StatusError);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/fetch-user-queued-units'), {
            method: 'DELETE',
            headers: getAuthorizationHeader(),
         });
      });

      it('should throw ResponseError when JSON parsing fails', async () => {
         (fetch as jest.Mock).mockResolvedValueOnce({
                                                       ok: true,
                                                       json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON')),
                                                    } as unknown as Response);

         await expect(fetchUserQueuedUnitsRequest()).rejects.toThrow(ResponseError);
         expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/fetch-user-queued-units'), {
            method: 'DELETE',
            headers: getAuthorizationHeader(),
         });
      });
   });
});