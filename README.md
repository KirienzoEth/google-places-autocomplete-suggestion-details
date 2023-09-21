# Scenario:

A developer of ours was recently integrating into Google Places API when he won back to back LooksRare Raffles and moved to the Bahamas.
He committed this repo with a partial integration, and some testcases before jumping into his new rented privat jet and flying off into the sunset.

We are pretty confident the developer managed to make a solid start on the integration, however there might be a bug or two. It's also clear to the rest of the team that the code isn't production worthy and needs some improvements.

Your task is to finish off this implementation, paying attention to the details, and ensuring the requirements are met with passing tests.

List out any assumptions / tradeoffs / limitations in the final implementation so we can be aware when reviewing the PR and can create tickets for any future technical debt work, security improvements, etc for this feature.

# Task:

To take a partial address input and return full address suggestions along with the address broken into its individual components using the Google Maps API.

# Resources:

Autocomplete Documentation: https://developers.google.com/maps/documentation/places/web-service/autocomplete
Place Documentation: https://developers.google.com/maps/documentation/places/web-service/details
API Key: Go to https://console.cloud.google.com and get one

# Install:

1. yarn install

# Test:

1. yarn install
2. yarn test

# Requirements:

1. All tests should pass and ensure good coverage for new work, we don't know how good the tests are right now, they made need to be improved.
2. Since we know our audience, we only allow Bahamas addresses to be returned
3. Code should be maintainable, and consistent
4. The main library function should return a Promise which resolves to an array of results
5. The result element should contain both the completed suggestion and also the suggestion broken down into its components (unit, street number, street name, suburb, state, postcode, country)
6. The returned result should be typed and easily consumable via users of the library
7. No front-end requirements are necessary, this is purely a backend NodeJS library
8. We want errors to be machine readable

# Assumptions / Tradeoffs / Limitations

1. I kept Axios as the HTTP client for the library, we can change it by creating a new adapter in the src/http-client directory. As long as it matches the `IHTTPClient` interface, there is little to no additional work required.
2. A library built by Google exists for Node.js applications (https://github.com/googlemaps/google-maps-services-js) that would speed up the implementation time.
   1. As the library has been implemented for all of the Google Maps Services API endpoints, I decided not to use it as we only use 2 endpoints.
   2. I did take some type and enums from the library to save some time.
3. The formatted address returned by the Places Details API endpoint is a valid address so I used it as the full address that we will return to users, but:
   1. The address components are not all used to create the full formatted address, this might cause some confusion
   2. If the consistency between the address components and the formatted address is required, we will need to do the concatenation ourselves or filter out the components that are not in the returned formatted address (we can do it directly in `src/index.ts -> formatPlaceDetails`)
4. After some research (e.g: https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/bhsEn.pdf), I found that the Bahamas do not use the following address components:
   1. unit (This might be an API limitation, I didn't see any place type that would match this property)
   2. suburb
   3. postcode
   4. state (the island is what would be the closest to this)
