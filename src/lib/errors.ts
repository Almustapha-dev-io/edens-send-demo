/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError, isAxiosError } from 'axios';
import { toast } from 'react-toastify';

type AppErrorArgs = {
  name?: string;
  httpCode: number;
  description: string;
  isOperational?: boolean;
};

export class AppError extends Error {
  public readonly name: string;

  public readonly httpCode: number;

  public readonly isOperational: boolean = true;

  constructor(args: AppErrorArgs) {
    super(args.description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = args.name ?? 'Error';
    this.httpCode = args.httpCode;

    if (args.isOperational !== undefined) {
      this.isOperational = args.isOperational;
    }
  }
}

export function getAxiosErrorMessage(
  error: AxiosError,
  message = 'There was an error processing your request'
) {
  if (!error.response) return message;
  if (error.response.status >= 500) return message;

  if ((error.response.data as any).error) {
    return (error.response.data as any).error.message ?? message;
  }

  return (error.response.data as any).message ?? message;
}

export function getRTKErrorMessage(
  error: unknown,
  message = 'There was an error processing your request'
) {
  const errorAsAny = error as any;
  if (!errorAsAny.data) return message;
  if (errorAsAny?.status >= 500) return message;
  if (errorAsAny.data.error) return errorAsAny.data.error?.message || message;

  return errorAsAny.data.message || message;
}

export function getServerErrorMessage(
  error: unknown,
  message = 'There was an error processing your request'
) {
  if (isAxiosError(error)) return getAxiosErrorMessage(error, message);
  if ((error as any).data) return getRTKErrorMessage(error, message);
  return message;
}

export function handleServerError(error: unknown) {
  toast(getServerErrorMessage(error), { type: 'error' });
}
