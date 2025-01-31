import {RequestError, StatusError, ResponseError} from './errors';
import {getAuthorizationHeader, toRestUrl}        from './helpers';
import {Transaction}                              from '../stores/CashPointEventStore/types';

export const loginRequest = async(username: string, password: string): Promise<string> => {
   let resp: Response;
   try {
      resp = await fetch(toRestUrl('/login'), {
         'method': 'POST',
         'body'  : JSON.stringify({username, password}),
         'headers': {
            'Content-Type': 'application/json',
         }
      });

   } catch (e) {
      throw new RequestError('Login request fails.', {
         cause: e,
      })
   }
   if (!resp.ok) {
      throw new StatusError(resp.status, 'Login response status is not ok.');
   }
   try {
      return await resp.text();
   } catch (e) {
      throw new ResponseError(resp, 'Login response is not json.', {
         cause: e,
      })
   }
}

export const logoutRequest = async(): Promise<void> => {
   let resp: Response;
   try {
      resp = await fetch(toRestUrl('/logout'), {
         headers: getAuthorizationHeader(),
      });

   } catch (e) {
      throw new RequestError('Logout request fails.', {
         cause: e,
      })
   }
   if (!resp.ok) {
      throw new StatusError(resp.status, 'Logout response status is not ok.');
   }
}

export const userRequest = async(token: string | undefined = undefined): Promise<any> => {
   let resp: Response;
   try {
      resp = await fetch(toRestUrl('/user'), {
         headers: getAuthorizationHeader(token),
      });

   } catch (e) {
      throw new RequestError('User request fails.', {
         cause: e,
      })
   }
   if (!resp.ok) {
      throw new StatusError(resp.status, 'User response status is not ok.');
   }
   try {
      return await resp.json();
   } catch (e) {
      throw new ResponseError(resp, 'User response is not json.', {
         cause: e,
      })
   }
}

export const activeEventRequest = async(): Promise<any> => {
   let resp: Response;
   try {
      resp = await fetch(toRestUrl('/active-event'), {
         headers: getAuthorizationHeader(),
      });

   } catch (e) {
      throw new RequestError('Active event request fails.', {
         cause: e,
      })
   }
   if (!resp.ok) {
      throw new StatusError(resp.status, 'Active event response status is not ok.');
   }
   try {
      return await resp.json();
   } catch (e) {
      throw new ResponseError(resp, 'Active event response is not json.', {
         cause: e,
      })
   }
}

export const sellerIdsRequest = async(): Promise<any> => {
   let resp: Response;
   try {
      resp = await fetch(toRestUrl('/seller-ids'), {
         headers: getAuthorizationHeader(),
      });

   } catch (e) {
      throw new RequestError('Seller ids request fails.', {
         cause: e,
      })
   }
   if (!resp.ok) {
      throw new StatusError(resp.status, 'Seller ids response status is not ok.');
   }
   try {
      return await resp.json();
   } catch (e) {
      throw new ResponseError(resp, 'Seller ids response is not json.', {
         cause: e,
      })
   }
}


export const saveTransactionRequest = async (transaction: Transaction): Promise<string> => {
   let resp: Response;
   const shouldAdd = transaction.id === null;
   try {
      const body = JSON.stringify(transaction);
      if(shouldAdd) {
         resp = await fetch(toRestUrl('/transaction'), {
            method: 'POST',
            headers: getAuthorizationHeader(),
            body,
         });
      }
      else {
         resp = await fetch(toRestUrl(`/transaction/${transaction.id}`), {
            method: 'PATCH',
            headers: getAuthorizationHeader(),
            body,
         });
      }
   } catch (e) {
      throw new RequestError('Save transaction request fails.', {
         cause: e,
      })
   }
   if (!resp.ok) {
      throw new StatusError(resp.status, 'Save transaction response status is not ok.');
   }
   if(shouldAdd) {
      try {
         return await resp.text();
      } catch (e) {
         throw new ResponseError(resp, 'Save transaction response is not text.', {
            cause: e,
         })
      }
   }
   else {
      return '';
   }
}

export const deleteTransactionRequest = async (transactionId: number): Promise<void> => {
   let resp: Response;
   try {
         resp = await fetch(toRestUrl(`/transaction/${transactionId}`), {
            method: 'DELETE',
            headers: getAuthorizationHeader(),
         });
   } catch (e) {
      throw new RequestError('Delete transaction request fails.', {
         cause: e,
      })
   }
   if (!resp.ok) {
      throw new StatusError(resp.status, 'Delete transaction response status is not ok.');
   }
}

export const fetchUserQueuedUnitsRequest = async (): Promise<any> => {
   let resp: Response;
   try {
      resp = await fetch(toRestUrl('/fetch-user-queued-units'), {
         method: 'DELETE',
         headers: getAuthorizationHeader(),
      });

   } catch (e) {
      throw new RequestError('Fetch user queued units request fails.', {
         cause: e,
      })
   }
   if (!resp.ok) {
      throw new StatusError(resp.status, 'Fetch user queued units response status is not ok.');
   }
   try {
      return await resp.json();
   } catch (e) {
      throw new ResponseError(resp, 'Fetch user queued units response is not json.', {
         cause: e,
      })
   }
}

