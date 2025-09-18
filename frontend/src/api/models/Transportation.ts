/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Location } from './Location';
export type Transportation = {
    id?: number;
    origin?: Location;
    destination?: Location;
    type: Transportation.type;
};
export namespace Transportation {
    export enum type {
        FLIGHT = 'FLIGHT',
        BUS = 'BUS',
        SUBWAY = 'SUBWAY',
        UBER = 'UBER',
    }
}

