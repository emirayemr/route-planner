/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Leg = {
    transportationId?: number;
    originCode?: string;
    destinationCode?: string;
    type?: Leg.type;
};
export namespace Leg {
    export enum type {
        FLIGHT = 'FLIGHT',
        BUS = 'BUS',
        SUBWAY = 'SUBWAY',
        UBER = 'UBER',
    }
}

