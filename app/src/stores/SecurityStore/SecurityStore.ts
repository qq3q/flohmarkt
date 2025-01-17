import {action, computed, makeObservable, observable, runInAction} from 'mobx';
import {loginRequest, logoutRequest}                               from '../../requests/requests';
import {Role}                                                      from './types';
import {RootStore}                                                 from '../RootStore/RootStore';

export class SecurityStore {
   private _user: string | null = null;
   private _token: string | null = null;
   private _roles: string[] = [];

   constructor(public readonly rootStore: RootStore) {
      makeObservable<SecurityStore, '_user' | '_token' | '_roles'>(this, {
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

      return this._user !== null;
   }

   refresh(): Promise<void> | void {
      // check per request whether user is logged in
      // if not clear username and token
   }

   async login(username: string, password: string): Promise<void> {
      const data: any = await loginRequest(username, password);

      // @todo do some validation
      runInAction(() => {
         this._user = data.user;
         this._token = data.token;
         this._roles = data.roles;
      });

      console.log('loggend in', this._user, this._token, this._roles);
   }

   async logout(): Promise<void> {
      await logoutRequest();
      this._user = null;
      this._token = null;
      this._roles = [];
   }
}
