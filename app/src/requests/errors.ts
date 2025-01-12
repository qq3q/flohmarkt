export class RequestError extends Error {
   constructor(message: string = 'Request fails.', ...args: any ) {
      super(message, ...args);
   }
}

export class StatusError extends Error {
   constructor(status: number, message: string = 'Response status is not ok.', ...args: any ) {
      console.error(`Request fails with status ${status}.`)
      super(message, ...args);
   }
}

export class ResponseError extends Error {
   constructor(response: Response, message: string = 'Response is invalid.', ...args: any ) {
      console.error(`Invalid response %o.`, response);
      super(message, ...args);
   }
}
