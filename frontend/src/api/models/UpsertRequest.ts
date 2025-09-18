/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpsertRequest = {
    originId: number;
    destinationId: number;
    type: UpsertRequest.type;
};
export namespace UpsertRequest {
    export enum type {
        FLIGHT = 'FLIGHT',
        BUS = 'BUS',
        SUBWAY = 'SUBWAY',
        UBER = 'UBER',
    }
}

