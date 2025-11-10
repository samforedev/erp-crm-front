export interface ApiSuccessResponse<T> {
  data: T;
  message: string;
  isSuccess: boolean;
}

export interface ApiErrorResponse<T> {
  errorCode: string;
  errorMessage: string;
  isSuccess: boolean;
}
