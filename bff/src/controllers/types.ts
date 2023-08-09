import { AxiosResponse } from "axios"

export interface Response<T = any> extends Partial<AxiosResponse<T>> {};