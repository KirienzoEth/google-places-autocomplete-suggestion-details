export default interface IHTTPClient {
  getJSON(url: string, options?: object): Promise<object>;
}
