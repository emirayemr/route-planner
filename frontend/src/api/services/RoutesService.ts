/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Route } from '../models/Route';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RoutesService {
    /**
     * Geçerli rotaları getir
     * Kurallar: (1) max 3 bacak, (2) tam 1 FLIGHT zorunlu, (3) varsa before/after transferler FLIGHT dışı,
     * (4) ardışık bağlantıda varış == sonraki kalkış. Bonus için 'date' parametresi gönderilebilir.
     *
     * @param origin Origin location code (örn. IST, TAK)
     * @param destination Destination location code (örn. LHR, WEM)
     * @param date Opsiyonel tarih (YYYY-MM-DD). BONUS: operatingDays varsa filtrelenir.
     * @returns Route OK
     * @throws ApiError
     */
    public static routes(
        origin: string,
        destination: string,
        date?: string,
    ): CancelablePromise<Array<Route>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/routes',
            query: {
                'origin': origin,
                'destination': destination,
                'date': date,
            },
            errors: {
                400: `Bad Request`,
                409: `Conflict`,
                500: `Internal Server Error`,
            },
        });
    }
}
