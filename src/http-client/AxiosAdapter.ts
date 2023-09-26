import axios, { AxiosRequestConfig } from 'axios';
import IHTTPClient from './IHTTPClient';

export default class AxiosAdapter implements IHTTPClient {
  async getJSON<T>(url: string, options: AxiosRequestConfig = {}): Promise<T> {
    const response = await axios.get(url, {
      ...options,
    });

    return response.data;
  }
}
