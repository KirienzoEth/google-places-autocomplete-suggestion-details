import axios, { AxiosRequestConfig } from 'axios';
import IHTTPClient from './IHTTPClient';

export default class AxiosAdapter implements IHTTPClient {
  async getJSON(
    url: string,
    options: AxiosRequestConfig = {},
  ): Promise<object> {
    const response = await axios.get(url, {
      ...options,
    });

    return response.data;
  }
}
