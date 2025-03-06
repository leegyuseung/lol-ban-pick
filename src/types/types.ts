// types.ts

export interface ApiResponse<T> {
  result_code: number;
  result: T;
  message: string;
}
