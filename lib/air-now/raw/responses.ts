/*
 * MIT No Attribution
 * 
 * Copyright 2024 Peter "Kevin" Contreras
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { AqiCategory, AqiReadingType } from "../models/core";

export interface RawCategoryObject {
    readonly Number: AqiCategory;
    readonly Name: string;
}

export interface RawCurrentObservation {
    readonly DateObserved: string;
    readonly HourObserved: number;
    readonly LocalTimeZone: string;
    readonly ReportingArea: string;
    readonly StateCode: string;
    readonly Latitude: number;
    readonly Longitude: number;
    readonly ParameterName: AqiReadingType;
    readonly AQI: number;
    readonly Category: RawCategoryObject;
}

export type RawCurrentObservationResponse = readonly RawCurrentObservation[];

export interface RawForecast {
    readonly DateIssue: string;
    readonly DateForecast: string;
    readonly ReportingArea: string;
    readonly StateCode: string;
    readonly Latitude: number;
    readonly Longitude: number;
    readonly ParameterName: AqiReadingType;
    readonly AQI: number;
    readonly Category: RawCategoryObject;
    readonly ActionDay: boolean;
    readonly Discussion: string;
}

export type RawForecastResponse = readonly RawForecast[];

export const enum RawErrorCategory {
    WebServiceError = "WebServiceError",
}

export interface RawError {
    readonly Message: string;
}

export type RawErrorResponse = {
    readonly [key in RawErrorCategory]: readonly RawError[];
}
