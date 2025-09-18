/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Location } from '../models/Location';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LocationsService {
    /**
     * ID ile lokasyon getir
     * @param id
     * @returns Location OK
     * @throws ApiError
     */
    public static byId1(
        id: number,
    ): CancelablePromise<Location> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/locations/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                409: `Conflict`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Lokasyon güncelle
     * @param id
     * @param requestBody
     * @returns Location OK
     * @throws ApiError
     */
    public static update1(
        id: number,
        requestBody: Location,
    ): CancelablePromise<Location> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/locations/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                409: `Conflict`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Lokasyon sil
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static delete1(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/locations/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                409: `Conflict`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Tüm lokasyonları listele
     * @returns Location OK
     * @throws ApiError
     */
    public static all1(): CancelablePromise<Array<Location>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/locations',
            errors: {
                400: `Bad Request`,
                409: `Conflict`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Yeni lokasyon oluştur
     * @param requestBody
     * @returns Location OK
     * @throws ApiError
     */
    public static create1(
        requestBody: Location,
    ): CancelablePromise<Location> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/locations',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                409: `Conflict`,
                500: `Internal Server Error`,
            },
        });
    }
}
