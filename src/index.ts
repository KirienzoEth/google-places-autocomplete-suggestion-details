import { config } from 'dotenv';
config();
import googleAPIClient from './google-api';
import { IPlaceDetails, PlaceType } from './google-api/GoogleAPITypes';
import IAddressDetails from './types/IAddressDetails';

function formatPlaceDetails(placeDetails: IPlaceDetails): IAddressDetails {
  const address: IAddressDetails = {
    address: placeDetails.formatted_address,
    components: {},
  };

  placeDetails.address_components.forEach((component) => {
    const types = component.types;
    const value = component.long_name;
    switch (true) {
      case types.includes(PlaceType.street_number):
        address.components.streetNumber = value;
        break;
      case types.includes(PlaceType.route):
        address.components.streetName = value;
        break;
      case types.includes(PlaceType.locality):
        address.components.city = value;
        break;
      case types.includes(PlaceType.administrative_area_level_1):
        address.components.region = value;
        break;
      case types.includes(PlaceType.country):
        address.components.country = value;
        break;

      default:
        break;
    }
  });

  return address;
}

export async function getAutocompleteDetails(
  input: string,
): Promise<IAddressDetails[]> {
  const suggestions = await googleAPIClient.getAutocompleteSuggestionPlaceIDs(
    input,
  );

  const suggestionDetails = await Promise.all(
    suggestions.map((placeID) => googleAPIClient.getPlaceDetails(placeID)),
  );

  const addresses: IAddressDetails[] = [];
  suggestionDetails.forEach((suggestion) => {
    addresses.push(formatPlaceDetails(suggestion));
  });

  return addresses;
}
