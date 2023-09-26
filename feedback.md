# Feedback

# What was done well

1. The user on interface abstraction for applying a simple replacement for the underlyin http library
2. Test cases were improved and extended
3. Numerous bugs and code quality issues were found and fixed
4. Api errors will be parsable with instanceof error types
5. Assumptions documented, extra config adjustments.


# Questions / Feedback

## 1.

What was your reasoning behind creating a mutable array and then using a foreach with push. Rather than a immutable / monad-style `map` based approach
```ts
const addresses: IAddressDetails[] = [];
suggestionDetails.forEach((suggestion) => {
  addresses.push(formatPlaceDetails(suggestion));
});

return addresses;
```

Example of the possible alternative which inherits the correct type.
```ts
const addresses = suggestionDetails.map(formatPlaceDetails)
```

## 2.

Was the use of generics considered to make type-casting easier at the call-site location?
A `string | URL` type could also be used for the url, however a single string input should be fine.
The primary downside there is that there is no com
```diff
interface IHTTPClient {
-  getJSON(url: string, options?: object): Promise<object>
+  getJSON<T>(url: string, options?: object): Promise<T>
}
```

This could help cleanup
```diff
- response = (await this.httpClient.getJSON(
-        url.toString(),
-      )) as IPlaceDetailsReponse;
+ response = await this.httpClient.getJSON<IPlaceDetailsReponse>(url);
```

# 3.

Did you consider passing the options directy rather than spreading? Can you elaborate upon if there was a particular reason for doing this? I can think of some reasons.
```diff
export default class AxiosAdapter implements IHTTPClient {
  async getJSON(
    url: string,
    options: AxiosRequestConfig = {},
  ): Promise<object> {
-   const response = await axios.get(url, { ...options });
+   const response = await axios.get(url, options);

    return response.data;
  }
}
```

# 4.

Singleton's were used in many places, did you choose this deliberately? Was a more dependency injection oriented approach considered at all and what would be some of the pros/cons of each.
```ts
const googleAPIClient = new GoogleAPI(httpClient);

export default googleAPIClient;
```

# 5.

Very minor point, did you have any reasoning behind your preference for default exports over named exports?
```ts
export default interface IGoogleAPI;
export default googleAPIClient;
```

# 6.

Did you consider that this could lead to unexpected runtime failures due to a missing api-key with fallback-value.
As opposed to a clear startup error that would prevent boot, which depending on the env (k8s with probes) could be preferrable.
```ts
this.apiKey = process.env.GOOGLE_PLACE_API_KEY ?? '';
```    


# 7 
Did you consider using Axios's built in `params` opt which allows url serialization for search parameters in a native and less verbose manner?

```ts
const url = new URL(this.DETAILS_API_URL);
url.searchParams.set('key', this.apiKey);
url.searchParams.set('place_id', placeID);
url.searchParams.set('fields', 'formatted_address,address_components');
url.searchParams.set('language', 'en');
```

# 8

The Axios option `validateStatus` allows you to override the deafult `throw` behavior for non 200 codes parse the `headers.status_code` for mapping to the relevant error throw witohut the let-reassign, try-catch overhead and then a follow up `checkResponseStatus` call. It's not critical, but it may help with some readability of the methods and allow for more dry and generic base google-api http call method invocation handling this in one spot.
```ts
let response;
try {
  response = (await this.httpClient.getJSON(
    url.toString(),
  )) as IPlaceAutocompleteReponse;
} catch (error: unknown) {
  throw new UnexpectedAPIError(
    `An unexpected error occured${
      error instanceof Error ? `: ${error.message}` : ''
    }`,
  );
}

this.checkResponseStatus(response.status, response.error_message);
```