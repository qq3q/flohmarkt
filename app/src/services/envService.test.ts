import {getRestUrl} from './envService';

describe('services/envService', () => {
   describe('getRestUrl', () => {
      it('should return the REACT_APP_REST_URL from environment variables when set', () => {
         process.env.REACT_APP_REST_URL = 'https://api.example.com/';
         expect(getRestUrl()).toBe('https://api.example.com');
      });

      it('should default to "http://localhost:8000" when REACT_APP_REST_URL is not set', () => {
         delete process.env.REACT_APP_REST_URL;
         expect(getRestUrl()).toBe('http://localhost:8000');
      });

      it('should remove trailing slashes from the URL', () => {
         process.env.REACT_APP_REST_URL = 'https://api.example.com////';
         expect(getRestUrl()).toBe('https://api.example.com');
      });
   });
});
