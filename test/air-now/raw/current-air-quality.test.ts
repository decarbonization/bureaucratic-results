import { describe, expect, it } from '@jest/globals';
import { AqiCategory, AqiReadingType } from '../../../lib/air-now/models';
import { currentAirQualityFrom } from '../../../lib/air-now/raw/current-air-quality';
import { RawCurrentObservationResponse } from '../../../lib/air-now/raw/responses';

describe("air-now#raw#current-air-quality module", () => {
    describe("#currentAirQualityFrom", () => {
        const raw: RawCurrentObservationResponse = JSON.parse(`
            [
                {
                    "DateObserved": "2024-06-27",
                    "HourObserved": 21,
                    "LocalTimeZone": "EST",
                    "ReportingArea": "Manhattan",
                    "StateCode": "NY",
                    "Latitude": 40.7834,
                    "Longitude": -73.9662,
                    "ParameterName": "O3",
                    "AQI": 34,
                    "Category": {
                        "Number": 1,
                        "Name": "Good"
                    }
                },
                {
                    "DateObserved": "2024-06-27",
                    "HourObserved": 21,
                    "LocalTimeZone": "EST",
                    "ReportingArea": "Manhattan",
                    "StateCode": "NY",
                    "Latitude": 40.7834,
                    "Longitude": -73.9662,
                    "ParameterName": "PM2.5",
                    "AQI": 23,
                    "Category": {
                        "Number": 1,
                        "Name": "Good"
                    }
                }
            ]
        `);
        const subject = currentAirQualityFrom(raw);

        it("should translate date", () => {
            expect(subject.asOf).toStrictEqual(new Date("2024-06-28T01:00:00.000Z"));
        });

        it("should translate location", () => {
            expect(subject.location).toStrictEqual({ latitude: 40.7834, longitude: -73.9662 });
        });

        it("should average AQI", () => {
            expect(subject.aqi).toStrictEqual(29);
        });

        it("should average category", () => {
            expect(subject.category).toStrictEqual(AqiCategory.good);
        });

        it("should aggregate readings", () => {
            expect(subject.readings).toStrictEqual([
                {
                    type: AqiReadingType.ozone,
                    category: AqiCategory.good,
                    aqi: 34,
                },
                {
                    type: AqiReadingType.fineParticles,
                    category: AqiCategory.good,
                    aqi: 23,
                },
            ]);
        });
    });
});
