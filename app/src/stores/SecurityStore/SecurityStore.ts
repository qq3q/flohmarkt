import {action, computed, makeObservable, observable, runInAction} from 'mobx';
import {loginRequest, logoutRequest, userRequest}                  from '../../requests/requests';
import {Role, SecurityStoreState}                                  from './types';
import {RootStore}                                                 from '../RootStore/RootStore';

export class SecurityStore {
   private _state: SecurityStoreState = 'uninitialized';
   private _user: string | null = null;
   private _token: string | null = null;
   private _roles: string[] = [];

   constructor(public readonly rootStore: RootStore) {
      makeObservable<SecurityStore, '_state' | '_user' | '_token' | '_roles'>(this, {
         _state  : observable,
         _user   : observable,
         _token  : observable,
         _roles  : observable,
         user    : computed,
         token   : computed,
         loggedIn: computed,
         login   : action,
         refresh : action,
         logout  : action,
      })
   }

   get state(): SecurityStoreState {

      return this._state;
   }

   get user(): string | null {

      return this._user;
   }

   get token(): string | null {

      return this._token;
   }

   hasRole(role: Role): boolean {

      return this._roles.includes(role);
   }

   get loggedIn(): boolean {
      console.log('loggedin', this._user !== null);

      return this._user !== null;
   }

   async initialize() {
      const token = localStorage.getItem('_token') ?? '';
      if (token.length > 0) {
         this._state = 'initializing';
         try {
            const user = await userRequest(token);
            runInAction(() => {
               this._user = user.name;
               this._roles = user.roles;
               this._token = token;
            });
         }
         catch (e) {
            console.warn('Could not initialize security store');
         }
      }
      this._state = 'initialized';
   }

   refresh(): Promise<void> | void {
      // check per request whether user is logged in
      // if not clear username and token
   }

   async login(username: string, password: string): Promise<void> {
      // @todo error handling
      const token: string = await loginRequest(username, password);
      const user = await userRequest(token);
      // @todo do some validation
      runInAction(() => {
         this.setToken(token);
         this._user = user.name;
         this._roles = user.roles;
      });

      console.log('loggend in', this._user, this._token, this._roles);
   }

   async logout(): Promise<void> {
      await logoutRequest();
      this.setToken(null);
      this._user = null;
      this._roles = [];
   }

   private setToken(token: string | null) {
      this._token = token;
      localStorage.setItem('_token', token || '');
   }
}
