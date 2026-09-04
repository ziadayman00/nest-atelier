export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface JSendSuccess<T> {
  status: "success";
  data: T;
}

export interface JSendFail {
  status: "fail";
  data: { message: string };
}

export interface JSendError {
  status: "error";
  message: string;
}
