import IHTTPClient from '../http-client/IHTTPClient';
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
} from './GoogleAPITypes';
import IGoogleAPI from './IGoogleAPI';

export default class GoogleAPI implements IGoogleAPI {
  private httpClient: IHTTPClient;
  private apiKey: string;
  private readonly AUTOCOMPLETE_API_URL =
    'https://maps.googleapis.com/maps/api/place/autocomplete/json';
  private readonly DETAILS_API_URL =
    'https://maps.googleapis.com/maps/api/place/details/json';

  constructor(httpClient: IHTTPClient) {
    this.apiKey = process.env.GOOGLE_PLACE_API_KEY ?? '';
    this.httpClient = httpClient;
  }

  async getPlaceDetails(placeID: string) {
    const url = new URL(this.DETAILS_API_URL);
    url.searchParams.set('key', this.apiKey);
    url.searchParams.set('place_id', placeID);
    url.searchParams.set('fields', 'formatted_address,address_components');
    url.searchParams.set('language', 'en');

    let response;
    try {
      response = (await this.httpClient.getJSON(
        url.toString(),
      )) as IPlaceDetailsReponse;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new UnexpectedAPIError(
        `An unexpected error occured: ${error.message}`,
      );
    }

    this.checkResponseStatus(response.status, response.error_message);

    return response.result;
  }

  async getAutocompleteSuggestionPlaceIDs(input: string): Promise<string[]> {
    const url = new URL(this.AUTOCOMPLETE_API_URL);
    url.searchParams.set('key', this.apiKey);
    url.searchParams.set('input', input);
    url.searchParams.set('components', 'country:bs');
    url.searchParams.set('language', 'en');
    url.searchParams.set('types', 'address');

    let response;
    try {
      response = (await this.httpClient.getJSON(
        url.toString(),
      )) as IPlaceAutocompleteReponse;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new UnexpectedAPIError(
        `An unexpected error occured: ${error.message}`,
      );
    }

    this.checkResponseStatus(response.status, response.error_message);

    return response.predictions.map((prediction) => prediction.place_id);
  }

  private checkResponseStatus(status: GoogleAPIStatus, message?: string) {
    switch (status) {
      case GoogleAPIStatus.REQUEST_DENIED:
        throw new RequestDeniedError(message);
      case GoogleAPIStatus.INVALID_REQUEST:
        throw new InvalidRequestError(message);
      case GoogleAPIStatus.OVER_QUERY_LIMIT:
        throw new OverQueryLimitError(message);
      case GoogleAPIStatus.NOT_FOUND:
        throw new PlaceNotFoundError(message);
    }
  }
}
