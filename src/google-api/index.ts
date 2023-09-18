import { config } from 'dotenv';
import httpClient from '../http-client';
import GoogleAPI from './GoogleAPI';

config();

const googleAPIClient = new GoogleAPI(httpClient);

export default googleAPIClient;
