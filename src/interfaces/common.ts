export interface ServiceResponse<T> {
  data: T;
  message: string;
  status: boolean;
}
