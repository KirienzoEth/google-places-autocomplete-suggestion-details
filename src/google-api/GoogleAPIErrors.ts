/** Indicates that the request is missing an API key or the key is invalid. */
export class RequestDeniedError extends Error {}

/** Indicates that the referenced location (placeID) was not found in the Places database. */
export class PlaceNotFoundError extends Error {}

/**
 * Indicates any of the following:
 *  - You have exceeded the QPS limits.
 *  - Billing has not been enabled on your account.
 *  - The monthly $200 credit, or a self-imposed usage cap, has been exceeded.
 *  - The provided method of payment is no longer valid (for example, a credit card has expired).
 * See the [Maps FAQ](https://developers.google.com/maps/faq#over-limit-key-error) to learn how to fix this.
 */
export class OverQueryLimitError extends Error {}

/** Indicates that the request was invalid, possibly due to a malformed input. */
export class InvalidRequestError extends Error {}

/** Indicates that the API failed to resolve the request for an unknown reason. */
export class UnexpectedAPIError extends Error {}
