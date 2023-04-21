export type ResponseType<T = any> = {
  headers?: any;
  success: boolean;
  data:
    | T
    | {
        message?: string;
      };
};

export type Noop = () => void;
