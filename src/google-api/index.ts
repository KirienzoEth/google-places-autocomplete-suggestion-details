import httpClient from '../http-client';
import GoogleAPI from './GoogleAPI';

const googleAPIClient = new GoogleAPI(httpClient);

export default googleAPIClient;
