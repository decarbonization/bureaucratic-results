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

import { getTimezoneOffset } from "date-fns-tz";
import { LocationCoordinates } from "serene-front/data";
import { CurrentAirQuality } from "../models/current-air-quality";
import { RawCurrentObservation, RawCurrentObservationResponse } from "./responses";
import { unabbreviateTimeZone } from "./time-zone";

export function currentAirQualityFrom(raw: RawCurrentObservationResponse): CurrentAirQuality {
    if (raw.length === 0) {
        throw new RangeError("Empty current observation response");
    }

    const reference = raw[0];
    const asOf = asOfFrom(reference);
    const timeZone = reference.LocalTimeZone;
    const location = new LocationCoordinates(reference.Latitude, reference.Longitude);
    const reportingArea = reference.ReportingArea;
    const stateCode = reference.StateCode;
    const aqi = Math.round(raw.reduce((acc, o) => acc + o.AQI, 0) / raw.length);
    const category = Math.round(raw.reduce((acc, o) => acc + o.Category.Number, 0) / raw.length);
    const readings = raw.map(o => ({
        type: o.ParameterName,
        category: o.Category.Number,
        aqi: o.AQI,
    }));
    return {
        asOf,
        timeZone,
        location,
        reportingArea,
        stateCode,
        aqi,
        category,
        readings,
    };
}

function asOfFrom(raw: RawCurrentObservation): Date {
    const datePieces = raw.DateObserved.split("-");
    if (datePieces.length !== 3) {
        throw new RangeError(`<${raw.DateObserved}> is not a valid date`);
    }
    const year = parseInt(datePieces[0], 10);
    const month = parseInt(datePieces[1], 10);
    const day = parseInt(datePieces[2], 10);
    const hour = raw.HourObserved;
    const timeZoneName = unabbreviateTimeZone(raw.LocalTimeZone);
    if (timeZoneName === undefined) {
        throw new Error(`Unknown time zone <${raw.LocalTimeZone}>`);
    }
    return new Date(Date.UTC(year, month - 1, day, hour) - getTimezoneOffset(timeZoneName));
}
