/** An address and its components. */
export default interface IAddressDetails {
  /** The full formated address. */
  address: string;
  /**
   * The components of the address.
   *
   * Note: Some components might not be included in the address property because they are not mandatory for the address to be valid
   */
  components: {
    streetNumber?: string;
    streetName?: string;
    city?: string;
    region?: string;
    country?: string;
  };
}
