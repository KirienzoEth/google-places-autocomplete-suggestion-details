import { getAutocompleteDetails } from '../src/index';
import { InvalidRequestError } from '../src/google-api/GoogleAPIErrors';

// These are end to end tests and require api key
describe('Google Places E2E Tests', () => {
  describe('getAutocompleteDetails', () => {
    test('can fetch from the autocomplete api', async () => {
      const suggestions = await getAutocompleteDetails('15 Charlotte Street');
      const firstSuggestion = suggestions[0];
      expect(firstSuggestion).toBeDefined();
      expect(firstSuggestion).toHaveProperty('address');
      expect(firstSuggestion).toHaveProperty('components');
      expect(firstSuggestion.components).toHaveProperty('streetNumber');
      expect(firstSuggestion.components).toHaveProperty('streetName');
      expect(firstSuggestion.components).toHaveProperty('city');
      expect(firstSuggestion.components).toHaveProperty('region');
      expect(firstSuggestion.components).toHaveProperty('country');
    });
    test('throws an error if the input is empty', async () => {
      const promise = getAutocompleteDetails('');
      expect(promise).rejects.toThrow(InvalidRequestError);
    });
  });
});
