import { AxiosResponse } from 'axios';
// eslint-disable-next-line prettier/prettier
import {
    Manga,
    NETTRUYEN_GENRES,
    NtSearchResponseData,
    ServerResponse,
} from '~/types';

import axiosClient from './axiosClient';

const resource = 'nt';

interface NtSearchResponse extends ServerResponse {
    data: NtSearchResponseData[];
}

interface MangaPreviewResponse extends ServerResponse {
    data: Manga[];
}

export interface NtRepository {
    search: (mangaTitle: string) => Promise<AxiosResponse<NtSearchResponse>>;
    filter: (
        page?: number,
        genres?: NETTRUYEN_GENRES,
        top?: string,
        status?: string,
    ) => Promise<AxiosResponse<MangaPreviewResponse>>;
    getNewMangaUpdated: (
        page?: number,
    ) => Promise<AxiosResponse<MangaPreviewResponse>>;
    getRankingmanga: (
        status?: string,
        top?: string,
        page?: number,
    ) => Promise<AxiosResponse<MangaPreviewResponse>>;
    getNewManga: (
        page?: number,
        genres?: string,
    ) => Promise<AxiosResponse<MangaPreviewResponse>>;
}

const NtApi: NtRepository = {
    getNewManga: (page?: number, genres?: string) => {
        return axiosClient.get(`${resource}/new`, {
            params: {
                page: page ? page : undefined,
                genres: genres ? genres : undefined,
            },
        });
    },
    getRankingmanga: (status?: string, top?: string, page?: number) => {
        return axiosClient.get(`${resource}/ranking`, {
            params: {
                page: page ? page : undefined,
                top: top ? top : undefined,
                status: status ? status : undefined,
            },
        });
    },
    search: (mangaTitle: string) => {
        return axiosClient.get(`${resource}/search`, {
            params: { q: mangaTitle },
        });
    },
    getNewMangaUpdated: (page?: number) => {
        return axiosClient.get(`${resource}/new-updated`, {
            params: { page: page ? page : undefined },
        });
    },
    filter: (
        page?: number,
        genres?: NETTRUYEN_GENRES,
        top?: string,
        status?: string,
    ) => {
        return axiosClient.get(`${resource}/filters`, {
            params: {
                page: page ? page : undefined,
                genres: genres ? genres : undefined,
                top: top ? top : undefined,
                status: status ? status : undefined,
            },
        });
    },
};

export default NtApi;