import axios, { AxiosRequestConfig } from 'axios';
import IHTTPClient from './IHTTPClient';

export default class AxiosAdapter implements IHTTPClient {
  async getJSON<T>(
    url: string | URL,
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    const input = url instanceof URL ? url.toString() : url;
    const response = await axios.get(input, options);

    return response.data;
  }
}
