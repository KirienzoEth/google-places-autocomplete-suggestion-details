import axios from 'axios';
import AxiosAdapter from './AxiosAdapter';

describe('AxiosAdapter', () => {
  describe('getJSON', () => {
    test('Accept a string as the URL', async () => {
      const getJSONMock = jest.spyOn(axios, 'get');

      getJSONMock.mockResolvedValueOnce({ data: {} });

      const httpClient = new AxiosAdapter();
      const promise = httpClient.getJSON('https://www.google.com');

      await expect(promise).resolves.toStrictEqual({});
    });
    test('Accept an URL object as the URL', async () => {
      const getJSONMock = jest.spyOn(axios, 'get');

      getJSONMock.mockResolvedValueOnce({ data: {} });

      const httpClient = new AxiosAdapter();
      const promise = httpClient.getJSON(new URL('https://www.google.com'));

      await expect(promise).resolves.toStrictEqual({});
    });
  });
});
