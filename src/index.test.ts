import { getAutocompleteDetails } from '.';
import googleAPIClient from './google-api';
import { PlaceType } from './google-api/GoogleAPITypes';

describe('getAutocompleteDetails', () => {
  test('returns a promise', () => {
    const getAutocompleteSuggestionPlaceIDsMock = jest.spyOn(
      googleAPIClient,
      'getAutocompleteSuggestionPlaceIDs',
    );
    getAutocompleteSuggestionPlaceIDsMock.mockResolvedValueOnce([]);

    const promise = getAutocompleteDetails('Test input');
    expect(promise).toBeInstanceOf(Promise);
  });
  test('returns an empty array if no autocomplete suggestions were found', async () => {
    const getAutocompleteSuggestionPlaceIDsMock = jest.spyOn(
      googleAPIClient,
      'getAutocompleteSuggestionPlaceIDs',
    );
    getAutocompleteSuggestionPlaceIDsMock.mockResolvedValueOnce([]);

    const result = await getAutocompleteDetails('Test input');
    expect(result).toStrictEqual([]);
  });
  test('returns a formatted address with its components', async () => {
    const getPlaceDetailsMock = jest.spyOn(googleAPIClient, 'getPlaceDetails');
    getPlaceDetailsMock.mockResolvedValueOnce({
      formatted_address: '42 Some Street, City, Country',
      address_components: [
        {
          long_name: '42',
          short_name: '42',
          types: [PlaceType.street_number],
        },
        {
          long_name: 'Some Street',
          short_name: 'Some St',
          types: [PlaceType.route],
        },
        {
          long_name: 'City',
          short_name: 'City',
          types: [PlaceType.locality, PlaceType.political],
        },
        {
          long_name: 'Region',
          short_name: 'Region',
          types: [PlaceType.administrative_area_level_1, PlaceType.political],
        },
        {
          long_name: 'Country',
          short_name: 'CT',
          types: [PlaceType.country, PlaceType.political],
        },
      ],
    });

    const getAutocompleteSuggestionPlaceIDsMock = jest.spyOn(
      googleAPIClient,
      'getAutocompleteSuggestionPlaceIDs',
    );
    getAutocompleteSuggestionPlaceIDsMock.mockResolvedValueOnce(['placeID']);

    const details = await getAutocompleteDetails('Test Input');
    expect(details).toHaveLength(1);
    expect(details[0].address).toStrictEqual('42 Some Street, City, Country');
    expect(details[0].components).toBeDefined();
    expect(details[0].components.streetNumber).toEqual('42');
    expect(details[0].components.streetName).toEqual('Some Street');
    expect(details[0].components.city).toEqual('City');
    expect(details[0].components.region).toEqual('Region');
    expect(details[0].components.country).toEqual('Country');
  });
});
