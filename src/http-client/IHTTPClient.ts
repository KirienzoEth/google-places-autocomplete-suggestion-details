interface IHTTPClient {
  getJSON(url: string, options?: object): Promise<object>
}


export default IHTTPClient;