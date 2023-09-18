import IHTTPClient from '../http-client/IHTTPClient';
import GoogleAPI from './GoogleAPI';
import {
  InvalidRequestError,
  OverQueryLimitError,
  PlaceNotFoundError,
  RequestDeniedError,
  UnexpectedAPIError,
} from './GoogleAPIErrors';
import {
  GoogleAPIStatus,
  IPlaceAutocompleteReponse,
  IPlaceDetailsReponse,
  PlaceType,
} from './GoogleAPITypes';

describe('GoogleAPI', () => {
  describe('getAutocompleteSuggestionPlaceIDs', () => {
    test('returns place IDs of suggestions', async () => {
      const httpClientMock = {
        getJSON: jest.fn().mockResolvedValue({
          predictions: [
            { place_id: '123abc' },
            { place_id: '234cbd' },
            { place_id: '345bde' },
          ],
          status: GoogleAPIStatus.OK,
        } as IPlaceAutocompleteReponse),
      } as IHTTPClient;

      const service = new GoogleAPI(httpClientMock);
      const placeIds = await service.getAutocompleteSuggestionPlaceIDs('Test');
      expect(placeIds).toStrictEqual(['123abc', '234cbd', '345bde']);
    });
    test('returns an empty array if there are no suggestion', async () => {
      const httpClientMock = {
        getJSON: jest.fn().mockResolvedValue({
          predictions: [],
          status: GoogleAPIStatus.ZERO_RESULTS,
        } as IPlaceAutocompleteReponse),
      } as IHTTPClient;

      const service = new GoogleAPI(httpClientMock);
      const placeIds = await service.getAutocompleteSuggestionPlaceIDs(
        'InputWithNoSuggestions',
      );
      expect(placeIds).toStrictEqual([]);
    });
    test('throws an exception if an expected error occurs', async () => {
      const httpClientMock = {
        getJSON: jest.fn().mockRejectedValue({ message: 'error message' }),
      } as IHTTPClient;

      const service = new GoogleAPI(httpClientMock);
      const promise = service.getAutocompleteSuggestionPlaceIDs('Test');
      expect(promise).rejects.toThrow(UnexpectedAPIError);
      expect(promise).rejects.toThrowError(
        'An unexpected error occured: error message',
      );
    });
    test('throws an exception if the API key is missing', async () => {
      const httpClientMock = {
        getJSON: jest.fn().mockResolvedValue({
          predictions: [],
          status: GoogleAPIStatus.REQUEST_DENIED,
        } as IPlaceAutocompleteReponse),
      } as IHTTPClient;

      const service = new GoogleAPI(httpClientMock);
      const promise = service.getAutocompleteSuggestionPlaceIDs('Test');
      expect(promise).rejects.toThrow(RequestDeniedError);
    });
    test('throws an exception if the input is not valid', async () => {
      const httpClientMock = {
        getJSON: jest.fn().mockResolvedValue({
          predictions: [],
          status: GoogleAPIStatus.INVALID_REQUEST,
        } as IPlaceAutocompleteReponse),
      } as IHTTPClient;

      const service = new GoogleAPI(httpClientMock);
      const promise = service.getAutocompleteSuggestionPlaceIDs('');
      expect(promise).rejects.toThrow(InvalidRequestError);
    });
    test('throws an exception if the user has issues with his Google Cloud account', async () => {
      const httpClientMock = {
        getJSON: jest.fn().mockResolvedValue({
          predictions: [],
          status: GoogleAPIStatus.OVER_QUERY_LIMIT,
        } as IPlaceAutocompleteReponse),
      } as IHTTPClient;

      const service = new GoogleAPI(httpClientMock);
      const promise = service.getAutocompleteSuggestionPlaceIDs('Test');
      expect(promise).rejects.toThrow(OverQueryLimitError);
    });
  });

  describe('getPlaceDetails', () => {
    test('returns a formatted address with its components', async () => {
      const apiResponse: IPlaceDetailsReponse = {
        result: {
          formatted_address: '15 Charlotte Street, Nassau, The Bahamas',
          address_components: [
            {
              long_name: '15',
              short_name: '15',
              types: [PlaceType.street_number],
            },
            {
              long_name: 'Charlotte Street',
              short_name: 'Charlotte St',
              types: [PlaceType.route],
            },
            {
              long_name: 'Nassau',
              short_name: 'Nassau',
              types: [PlaceType.locality, PlaceType.political],
            },
            {
              long_name: 'New Providence',
              short_name: 'New Providence',
              types: [
                PlaceType.administrative_area_level_1,
                PlaceType.political,
              ],
            },
            {
              long_name: 'The Bahamas',
              short_name: 'BS',
              types: [PlaceType.country, PlaceType.political],
            },
          ],
        },
        status: GoogleAPIStatus.OK,
      };

      const httpClientMock: IHTTPClient = {
        getJSON: jest.fn().mockResolvedValue(apiResponse),
      };

      const service = new GoogleAPI(httpClientMock);
      const details = await service.getPlaceDetails('placeID');
      expect(details).toStrictEqual({ ...apiResponse.result });
    });
    test('throws an exception if an unexpected error occurs', async () => {
      const httpClientMock = {
        getJSON: jest.fn().mockRejectedValue({ message: 'error message' }),
      } as IHTTPClient;

      const service = new GoogleAPI(httpClientMock);
      const promise = service.getPlaceDetails('placeID');
      expect(promise).rejects.toThrow(UnexpectedAPIError);
      expect(promise).rejects.toThrowError(
        'An unexpected error occured: error message',
      );
    });
    test('throws an exception if the API key is missing', async () => {
      const httpClientMock = {
        getJSON: jest.fn().mockResolvedValue({
          result: {},
          status: GoogleAPIStatus.REQUEST_DENIED,
          error_message: 'You must use an API key',
        } as IPlaceDetailsReponse),
      } as IHTTPClient;

      const service = new GoogleAPI(httpClientMock);
      const promise = service.getPlaceDetails('placeID');
      expect(promise).rejects.toThrow(RequestDeniedError);
      expect(promise).rejects.toThrowError('You must use an API key');
    });
    test('throws an exception if the input is not valid', async () => {
      const httpClientMock = {
        getJSON: jest.fn().mockResolvedValue({
          result: {},
          status: GoogleAPIStatus.INVALID_REQUEST,
          error_message: "Invalid 'placeid' parameter",
        } as IPlaceDetailsReponse),
      } as IHTTPClient;

      const service = new GoogleAPI(httpClientMock);
      const promise = service.getPlaceDetails('');
      expect(promise).rejects.toThrow(InvalidRequestError);
      expect(promise).rejects.toThrowError("Invalid 'placeid' parameter");
    });
    test('throws an exception if the user has issues with his Google Cloud account', async () => {
      const httpClientMock = {
        getJSON: jest.fn().mockResolvedValue({
          result: {},
          status: GoogleAPIStatus.OVER_QUERY_LIMIT,
          error_message: 'google account issue',
        } as IPlaceDetailsReponse),
      } as IHTTPClient;

      const service = new GoogleAPI(httpClientMock);
      const promise = service.getPlaceDetails('placeID');
      expect(promise).rejects.toThrow(OverQueryLimitError);
      expect(promise).rejects.toThrowError('google account issue');
    });
    test('throws an exception if the place ID does not match with anything', async () => {
      const httpClientMock = {
        getJSON: jest.fn().mockResolvedValue({
          result: {},
          status: GoogleAPIStatus.NOT_FOUND,
          error_message: 'not found error',
        } as IPlaceDetailsReponse),
      } as IHTTPClient;

      const service = new GoogleAPI(httpClientMock);
      const promise = service.getPlaceDetails('notPlaceID');
      expect(promise).rejects.toThrow(PlaceNotFoundError);
      expect(promise).rejects.toThrowError('not found error');
    });
  });
});
