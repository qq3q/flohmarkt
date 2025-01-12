export const getRestUrl = () => {
   const url = process.env.REACT_APP_REST_URL ?? 'http://localhost:8000';

   return url.replace(/\/+$/, '');
};
