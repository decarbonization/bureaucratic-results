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

export const enum AqiCategory {
    good = 1,
    moderate = 2,
    unhealthyForSensitiveGroups = 3,
    unhealthy = 4,
    veryUnhealthy = 5,
    hazardous = 6,
    unavailable = 7,
}

export const enum AqiReadingType {
    ozone = "O3",
    fineParticles = "PM2.5",
    coarseParticles = "PM10",
}

export interface AqiReading {
    readonly type: AqiReadingType;
    readonly category: AqiCategory;
    readonly aqi: number;
}
