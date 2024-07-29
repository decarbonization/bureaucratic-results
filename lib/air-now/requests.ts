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

import convert from "convert";
import { format } from "date-fns";
import { SereneRequest, SereneRequestParseOptions, SereneRequestPrepareOptions } from "serene-front";
import { LocationCoordinates } from "serene-front/data";
import { AirNowApiKey } from "./api-key";
import { AirQualityForecast } from "./models/air-quality-forecast";
import { CurrentAirQuality } from "./models/current-air-quality";
import { airQualityForecastFrom } from "./raw/air-quality-forecast";
import { currentAirQualityFrom } from "./raw/current-air-quality";

const baseUrl = "https://www.airnowapi.org/aq";

export interface CurrentAirQualityQueryOptions {
    readonly location: LocationCoordinates;
    readonly distance?: number;
}

export class CurrentAirQualityQuery implements SereneRequest<AirNowApiKey, CurrentAirQuality> {
    constructor(private readonly options: CurrentAirQualityQueryOptions) {
    }

    prepare({ }: SereneRequestPrepareOptions<AirNowApiKey>): Request {
        const url = new URL(`${baseUrl}/observation/latLong/current`);
        url.searchParams.set("format", "application/json");
        url.searchParams.set("latitude", String(this.options.location.latitude));
        url.searchParams.set("longitude", String(this.options.location.longitude));
        if (this.options.distance !== undefined) {
            url.searchParams.set("distance", String(convert(this.options.distance, "meters").to("mile")));
        }
        return new Request(url);
    }

    async parse({ fetchResponse }: SereneRequestParseOptions<AirNowApiKey>): Promise<CurrentAirQuality> {
        const raw = await fetchResponse.json();
        return currentAirQualityFrom(raw);
    }
}

export interface AirQualityForecastQueryOptions {
    readonly location: LocationCoordinates;
    readonly distance?: number;
    readonly date?: Date;
}

export class AirQualityForecastQuery implements SereneRequest<AirNowApiKey, AirQualityForecast> {
    constructor(private readonly options: AirQualityForecastQueryOptions) {
    }

    prepare({ }: SereneRequestPrepareOptions<AirNowApiKey>): Request {
        const url = new URL(`${baseUrl}/forecast/latLong`);
        url.searchParams.set("format", "application/json");
        url.searchParams.set("latitude", String(this.options.location.latitude));
        url.searchParams.set("longitude", String(this.options.location.longitude));
        if (this.options.distance !== undefined) {
            url.searchParams.set("distance", String(convert(this.options.distance, "meters").to("mile")));
        }
        if (this.options.date !== undefined) {
            url.searchParams.set("date", format(this.options.date, "yyyy-mm-dd"));
        }
        return new Request(url);
    }

    async parse({ fetchResponse }: SereneRequestParseOptions<AirNowApiKey>): Promise<AirQualityForecast> {
        const raw = await fetchResponse.json();
        return airQualityForecastFrom(raw);
    }
}
