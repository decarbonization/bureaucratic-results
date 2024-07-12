import { describe, expect, it } from '@jest/globals';
import { AqiCategory, AqiReadingType } from '../../../lib/air-now/models';
import { airQualityForecastFrom } from '../../../lib/air-now/raw/air-quality-forecast';
import { RawForecastResponse } from '../../../lib/air-now/raw/responses';

describe("air-now#raw#air-quality-forecast module", () => {
    describe("#airQualityForecastFrom", () => {
        const raw: RawForecastResponse = JSON.parse(`
            [
                {
                    "DateIssue": "2024-06-27",
                    "DateForecast": "2024-06-27",
                    "ReportingArea": "Manhattan",
                    "StateCode": "NY",
                    "Latitude": 40.7834,
                    "Longitude": -73.9662,
                    "ParameterName": "O3",
                    "AQI": -1,
                    "Category": {
                        "Number": 1,
                        "Name": "Good"
                    },
                    "ActionDay": false,
                    "Discussion": ""
                },
                {
                    "DateIssue": "2024-06-27",
                    "DateForecast": "2024-06-27",
                    "ReportingArea": "Manhattan",
                    "StateCode": "NY",
                    "Latitude": 40.7834,
                    "Longitude": -73.9662,
                    "ParameterName": "PM2.5",
                    "AQI": -1,
                    "Category": {
                        "Number": 1,
                        "Name": "Good"
                    },
                    "ActionDay": false,
                    "Discussion": ""
                },
                {
                    "DateIssue": "2024-06-27",
                    "DateForecast": "2024-06-28",
                    "ReportingArea": "Manhattan",
                    "StateCode": "NY",
                    "Latitude": 40.7834,
                    "Longitude": -73.9662,
                    "ParameterName": "O3",
                    "AQI": -1,
                    "Category": {
                        "Number": 1,
                        "Name": "Good"
                    },
                    "ActionDay": false,
                    "Discussion": ""
                },
                {
                    "DateIssue": "2024-06-27",
                    "DateForecast": "2024-06-28",
                    "ReportingArea": "Manhattan",
                    "StateCode": "NY",
                    "Latitude": 40.7834,
                    "Longitude": -73.9662,
                    "ParameterName": "PM2.5",
                    "AQI": -1,
                    "Category": {
                        "Number": 1,
                        "Name": "Good"
                    },
                    "ActionDay": false,
                    "Discussion": ""
                },
                {
                    "DateIssue": "2024-06-27",
                    "DateForecast": "2024-06-29",
                    "ReportingArea": "Manhattan",
                    "StateCode": "NY",
                    "Latitude": 40.7834,
                    "Longitude": -73.9662,
                    "ParameterName": "O3",
                    "AQI": -1,
                    "Category": {
                        "Number": 1,
                        "Name": "Good"
                    },
                    "ActionDay": false,
                    "Discussion": ""
                },
                {
                    "DateIssue": "2024-06-27",
                    "DateForecast": "2024-06-29",
                    "ReportingArea": "Manhattan",
                    "StateCode": "NY",
                    "Latitude": 40.7834,
                    "Longitude": -73.9662,
                    "ParameterName": "PM2.5",
                    "AQI": -1,
                    "Category": {
                        "Number": 1,
                        "Name": "Good"
                    },
                    "ActionDay": false,
                    "Discussion": ""
                }
            ]
        `);
        const subject = airQualityForecastFrom(raw);

        it("should translate dates", () => {
            expect(subject.days.map(day => day.forecastStart)).toStrictEqual([
                new Date("2024-06-27T00:00:00.000Z"),
                new Date("2024-06-28T00:00:00.000Z"),
                new Date("2024-06-29T00:00:00.000Z"),
            ]);
            expect(subject.days.map(day => day.forecastEnd)).toStrictEqual([
                new Date("2024-06-28T00:00:00.000Z"),
                new Date("2024-06-29T00:00:00.000Z"),
                new Date("2024-06-30T00:00:00.000Z"),
            ]);
        });

        it("should translate location", () => {
            expect(subject.days.map(day => day.location)).toStrictEqual([
                { latitude: 40.7834, longitude: -73.9662 },
                { latitude: 40.7834, longitude: -73.9662 },
                { latitude: 40.7834, longitude: -73.9662 },
            ]);
        });

        it("should aggregate readings", () => {
            expect(subject.days.map(day => day.readings)).toStrictEqual([
                [
                    { aqi: -1, category: AqiCategory.good, type: AqiReadingType.ozone, },
                    { aqi: -1, category: AqiCategory.good, type: AqiReadingType.fineParticles, },
                ],
                [
                    { aqi: -1, category: AqiCategory.good, type: AqiReadingType.ozone, },
                    { aqi: -1, category: AqiCategory.good, type: AqiReadingType.fineParticles, },
                ],
                [
                    { aqi: -1, category: AqiCategory.good, type: AqiReadingType.ozone, },
                    { aqi: -1, category: AqiCategory.good, type: AqiReadingType.fineParticles, },
                ],
            ]);
        });
    });
});
