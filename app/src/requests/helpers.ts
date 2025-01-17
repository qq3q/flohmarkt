import * as envSrv     from '../services/envService';
import {rootStore} from '../stores/RootStore';

const REST_URL = envSrv.getRestUrl();


export const toRestUrl = (path: string) => `${REST_URL}${path}`;

export const getAuthorizationHeader = (token: string | undefined = undefined): HeadersInit => ({
   'Authorization': `Bearer ${token ? token : rootStore.securityStore.token}`
})
