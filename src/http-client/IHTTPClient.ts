export default interface IHTTPClient {
  getJSON<T>(url: string, options?: object): Promise<T>;
}
