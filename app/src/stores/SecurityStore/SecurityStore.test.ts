import {SecurityStore}                            from './SecurityStore';
import {RootStore}                                from '../RootStore/RootStore';
import {runInAction}                              from 'mobx';
import {loginRequest, userRequest, logoutRequest} from '../../requests/requests';

jest.mock('../../requests/requests', () => ({
   loginRequest:  jest.fn(),
   userRequest:   jest.fn(),
   logoutRequest: jest.fn(),
}));
const mockLocalStorage = (() => {
   let storage: Record<string, string> = {};

   return {
      getItem: jest.fn((key: string) => storage[key] || null),
      setItem: jest.fn((key: string, value: string) => {
         storage[key] = value;
      }),
      clear:   jest.fn(() => {
         storage = {};
      }),
   };
})();

Object.defineProperty(window, 'localStorage', {
   value: mockLocalStorage,
});

describe('stores/SecurityStore', () => {
   let securityStore: SecurityStore;

   beforeEach(() => {
      const rootStore = new RootStore();
      securityStore = rootStore.securityStore;
      mockLocalStorage.clear();
   });

   describe('state', () => {
      it('should return the correct initial state', () => {
         expect(securityStore.state).toBe('uninitialized');
      });
   });

   describe('user', () => {
      it('should return null initially', () => {
         expect(securityStore.user).toBeNull();
      });
   });

   describe('token', () => {
      it('should return null initially', () => {
         expect(securityStore.token).toBeNull();
      });
   });

   describe('hasRole', () => {
      it('should return true if the user has the specified role', () => {
         runInAction(() => {
            securityStore['_roles'] = ['ROLE_ADMIN'];
         });

         expect(securityStore.hasRole('ROLE_ADMIN')).toBe(true);
      });

      it('should return false if the user does not have the specified role', () => {
         runInAction(() => {
            securityStore['_roles'] = [];
         });

         expect(securityStore.hasRole('ROLE_ADMIN')).toBe(false);
      });
   });

   describe('loggedIn', () => {
      it('should return false if user is null', () => {
         expect(securityStore.loggedIn).toBe(false);
      });

      it('should return true if user is not null', () => {
         runInAction(() => {
            securityStore['_user'] = 'testUser';
         });

         expect(securityStore.loggedIn).toBe(true);
      });
   });

   describe('initialize', () => {
      it('should set state to initialized if no token is found', async() => {
         await securityStore.initialize();

         expect(securityStore.state).toBe('initialized');
         expect(securityStore.user).toBeNull();
         expect(securityStore.token).toBeNull();
      });

      it('should initialize user and roles if a token is valid', async() => {
         mockLocalStorage.getItem.mockReturnValue('valid_token');
         (userRequest as jest.Mock).mockResolvedValue({
                                                         name:  'testUser',
                                                         roles: ['ROLE_ADMIN'],
                                                      });

         await securityStore.initialize();

         expect(securityStore.state).toBe('initialized');
         expect(securityStore.user).toBe('testUser');
         expect(securityStore.token).toBe('valid_token');
         expect(securityStore.hasRole('ROLE_ADMIN')).toBe(true);
      });

      it('should catch errors during initialization', async() => {
         mockLocalStorage.getItem.mockReturnValue('invalid_token');
         (userRequest as jest.Mock).mockRejectedValue(new Error('Invalid token'));

         await securityStore.initialize();

         expect(securityStore.state).toBe('initialized');
         expect(securityStore.user).toBeNull();
         expect(securityStore.token).toBeNull();
      });
   });

   describe('login', () => {
      it('should set user, token, and roles on successful login', async() => {
         (loginRequest as jest.Mock).mockResolvedValue('valid_token');
         (userRequest as jest.Mock).mockResolvedValue({
                                                         name:  'testUser',
                                                         roles: ['ROLE_CASH_POINT'],
                                                      });

         await securityStore.login('testUser', 'password');

         expect(securityStore.user).toBe('testUser');
         expect(securityStore.token).toBe('valid_token');
         expect(securityStore.hasRole('ROLE_CASH_POINT')).toBe(true);
      });
   });

   describe('logout', () => {
      it('should clear user, token, and roles on successful logout', async() => {
         runInAction(() => {
            securityStore['_token'] = 'valid_token';
            securityStore['_user'] = 'testUser';
            securityStore['_roles'] = ['ROLE_ADMIN'];
         });

         await securityStore.logout();
         expect(logoutRequest).toHaveBeenCalled();
         expect(securityStore.user).toBeNull();
         expect(securityStore.token).toBeNull();
         expect(securityStore.hasRole('ROLE_ADMIN')).toBe(false);
      });
   });
});