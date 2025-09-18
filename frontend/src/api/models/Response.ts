/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Response = {
    id?: number;
    originId?: number;
    originCode?: string;
    destinationId?: number;
    destinationCode?: string;
    type?: Response.type;
};
export namespace Response {
    export enum type {
        FLIGHT = 'FLIGHT',
        BUS = 'BUS',
        SUBWAY = 'SUBWAY',
        UBER = 'UBER',
    }
}

