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

import { addDays } from "date-fns";
import { LocationCoordinates } from "serene-front/data";
import { AirQualityForecast, AirQualityForecastDay } from "../models/air-quality-forecast";
import { RawForecast, RawForecastResponse } from "./responses";

export function airQualityForecastFrom(raw: RawForecastResponse): AirQualityForecast {
    if (raw.length === 0) {
        throw new RangeError("Empty current observation response");
    }

    const rawByDate = segmentByDate(raw);
    const days: AirQualityForecastDay[] = [];
    for (const [forecastStart, raw] of rawByDate) {
        const forecastEnd = addDays(forecastStart, 1);
        const reference = raw[0];
        const location = new LocationCoordinates(reference.Latitude, reference.Longitude);
        const reportingArea = reference.ReportingArea;
        const stateCode = reference.StateCode;
        const readings = raw.map(o => ({
            type: o.ParameterName,
            category: o.Category.Number,
            aqi: o.AQI,
        }));
        const actionDay = raw.some(o => o.ActionDay);
        const discussion = Array.from(
            raw.reduce(
                (acc, o) => acc.add(o.Discussion),
                new Set<string>()
            )
        ).join("\n");
        days.push({
            forecastStart,
            forecastEnd,
            location,
            reportingArea,
            stateCode,
            readings,
            actionDay,
            discussion,
        });
    }
    return {
        days,
    };
}

function* segmentByDate(raw: RawForecastResponse): IterableIterator<[Date, RawForecast[]]> {
    const byRawDate = new Map<string, RawForecast[]>();
    for (const forecast of raw) {
        const rawDate = forecast.DateForecast;
        let segment = byRawDate.get(rawDate);
        if (segment === undefined) {
            segment = [];
            byRawDate.set(rawDate, segment);
        }
        segment.push(forecast);
    }
    for (const [rawDate, segment] of byRawDate.entries()) {
        yield [new Date(rawDate), segment];
    }
}
