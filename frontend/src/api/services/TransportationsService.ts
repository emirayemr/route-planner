/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Response } from '../models/Response';
import type { Transportation } from '../models/Transportation';
import type { UpsertRequest } from '../models/UpsertRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TransportationsService {
    /**
     * ID ile transport getir
     * @param id
     * @returns Transportation OK
     * @throws ApiError
     */
    public static byId(
        id: number,
    ): CancelablePromise<Transportation> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/transportations/{id}',
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
     * Transport güncelle (originId, destinationId, type)
     * @param id
     * @param requestBody
     * @returns Response OK
     * @throws ApiError
     */
    public static update(
        id: number,
        requestBody: UpsertRequest,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/transportations/{id}',
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
     * Transport sil
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static delete(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/transportations/{id}',
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
     * Tüm transport kayıtlarını listele
     * @returns Transportation OK
     * @throws ApiError
     */
    public static all(): CancelablePromise<Array<Transportation>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/transportations',
            errors: {
                400: `Bad Request`,
                409: `Conflict`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Yeni transport oluştur (originId, destinationId, type)
     * @param requestBody
     * @returns Response OK
     * @throws ApiError
     */
    public static create(
        requestBody: UpsertRequest,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/transportations',
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
