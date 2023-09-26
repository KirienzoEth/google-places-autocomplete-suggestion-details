export default interface IHTTPClient {
  getJSON<T>(url: string | URL, options?: object): Promise<T>;
}
