import { IPlaceDetails } from './GoogleAPITypes';

export default interface IGoogleAPI {
  getPlaceDetails(placeID: string): Promise<IPlaceDetails>;
  getAutocompleteSuggestionPlaceIDs(input: string): Promise<string[]>;
}
