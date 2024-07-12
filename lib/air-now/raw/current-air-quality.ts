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

import { CurrentAirQuality } from "../models/current-air-quality";
import { RawCurrentObservationResponse } from "./responses";

export function currentAirQualityFrom(raw: RawCurrentObservationResponse): CurrentAirQuality {
    if (raw.length === 0) {
        throw new RangeError("Empty current observation response");
    }

    const reference = raw[0];
    const asOf = new Date(reference.DateObserved);
    asOf.setHours(reference.HourObserved);
    const timeZone = reference.LocalTimeZone;
    const location = {
        latitude: reference.Latitude,
        longitude: reference.Longitude,
    };
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
