export enum GoogleAPIStatus {
  OK = 'OK',
  REQUEST_DENIED = 'REQUEST_DENIED',
  INVALID_REQUEST = 'INVALID_REQUEST',
  OVER_DAILY_LIMIT = 'OVER_DAILY_LIMIT',
  OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
  ZERO_RESULTS = 'ZERO_RESULTS',
  NOT_FOUND = 'NOT_FOUND',
}

export interface IPlaceDetails {
  address_components: AddressComponent[];
  formatted_address: string;
}

interface ICommonResponseData {
  status: GoogleAPIStatus;
  /** When the top-level status code is other than `OK`, this field contains more detailed information */
  error_message?: string;
}

export interface IPlaceAutocompleteReponse extends ICommonResponseData {
  predictions: { place_id: string }[];
}

export interface IPlaceDetailsReponse extends ICommonResponseData {
  result: IPlaceDetails;
}

/**
 * From https://github.com/googlemaps/google-maps-services-js/blob/master/src/common.ts#L253
 * @see https://developers.google.com/places/web-service/supported_types#table2
 */
export enum PlaceType {
  /**
   * indicates a first-order civil entity below the country level. Within the United States, these administrative levels are states.
   * Not all nations exhibit these administrative levels. In most cases, `administrative_area_level_1` short names will closely match
   * ISO 3166-2 subdivisions and other widely circulated lists; however this is not guaranteed as our geocoding results are based
   * on a variety of signals and location data.
   */
  administrative_area_level_1 = 'administrative_area_level_1',
  /**
   * indicates a second-order civil entity below the country level. Within the United States, these administrative levels are counties.
   * Not all nations exhibit these administrative levels.
   */
  administrative_area_level_2 = 'administrative_area_level_2',
  /**
   * indicates a third-order civil entity below the country level. This type indicates a minor civil division.
   * Not all nations exhibit these administrative levels.
   */
  administrative_area_level_3 = 'administrative_area_level_3',
  /**
   * indicates a fourth-order civil entity below the country level. This type indicates a minor civil division.
   * Not all nations exhibit these administrative levels.
   */
  administrative_area_level_4 = 'administrative_area_level_4',
  /**
   * indicates a fifth-order civil entity below the country level. This type indicates a minor civil division.
   * Not all nations exhibit these administrative levels.
   */
  administrative_area_level_5 = 'administrative_area_level_5',
  archipelago = 'archipelago',
  /** indicates a commonly-used alternative name for the entity. */
  colloquial_area = 'colloquial_area',
  continent = 'continent',
  /** indicates the national political entity, and is typically the highest order type returned by the Geocoder. */
  country = 'country',
  establishment = 'establishment',
  finance = 'finance',
  floor = 'floor',
  food = 'food',
  general_contractor = 'general_contractor',
  geocode = 'geocode',
  health = 'health',
  /** indicates a major intersection, usually of two major roads. */
  intersection = 'intersection',
  landmark = 'landmark',
  /** indicates an incorporated city or town political entity. */
  locality = 'locality',
  /** indicates a prominent natural feature. */
  natural_feature = 'natural_feature',
  /** indicates a named neighborhood */
  neighborhood = 'neighborhood',
  place_of_worship = 'place_of_worship',
  plus_code = 'plus_code',
  point_of_interest = 'point_of_interest',
  /** indicates a political entity. Usually, this type indicates a polygon of some civil administration. */
  political = 'political',
  post_box = 'post_box',
  /** indicates a postal code as used to address postal mail within the country. */
  postal_code = 'postal_code',
  postal_code_prefix = 'postal_code_prefix',
  postal_code_suffix = 'postal_code_suffix',
  postal_town = 'postal_town',
  /** indicates a named location, usually a building or collection of buildings with a common name */
  premise = 'premise',
  room = 'room',
  /** indicates a named route (such as "US 101"). */
  route = 'route',
  street_address = 'street_address',
  street_number = 'street_number',
  /**
   * indicates a first-order civil entity below a locality. For some locations may receive one of the additional types:
   * `sublocality_level_1` to `sublocality_level_5`. Each sublocality level is a civil entity. Larger numbers indicate a smaller
   * geographic area.
   */
  sublocality = 'sublocality',
  sublocality_level_1 = 'sublocality_level_1',
  sublocality_level_2 = 'sublocality_level_2',
  sublocality_level_3 = 'sublocality_level_3',
  sublocality_level_4 = 'sublocality_level_4',
  sublocality_level_5 = 'sublocality_level_5',
  /**
   * indicates a first-order entity below a named location, usually a singular building within a collection of buildings with a
   * common name.
   */
  subpremise = 'subpremise',
  town_square = 'town_square',
}

/**
 * From https://github.com/googlemaps/google-maps-services-js/blob/master/src/common.ts#L1469
 */
export interface AddressComponent {
  /** is an array indicating the *type* of the address component. */
  types: Array<PlaceType>;
  /** is the full text description or name of the address component as returned by the Geocoder. */
  long_name: string;
  /**
   * is an abbreviated textual name for the address component, if available.
   * For example, an address component for the state of Alaska may have a `long_name` of "Alaska" and a `short_name` of "AK"
   * using the 2-letter postal abbreviation.
   */
  short_name: string;
}
