import * as envSrv from '../services/envService';
import {securityStore} from '../stores/SecurityStore';

const REST_URL = envSrv.getRestUrl();


export const toRestUrl = (path: string) => `${REST_URL}${path}`;

export const getAuthorizationHeader = (): HeadersInit => ({
   'Authorization': `Bearer ${securityStore.token}`
})
