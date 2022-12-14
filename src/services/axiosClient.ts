import axios from 'axios';
import queryString from 'query-string';

export const baseURL = `${process.env.NEXT_PUBLIC_BASE_URL}/api`;
export const baseURLv2 = `${process.env.NEXT_PUBLIC_BASE_URL_V2}/api/v2`;

const axiosClient = axios.create({
    baseURL,
    headers: {
        'content-type': 'application/json',
    },
    paramsSerializer: (params) => queryString.stringify(params),
});

export const axiosClientV2 = axios.create({
    baseURL: baseURLv2,
    headers: {
        'content-type': 'application/json',
    },
    paramsSerializer: (params) => queryString.stringify(params),
});

export default axiosClient;
