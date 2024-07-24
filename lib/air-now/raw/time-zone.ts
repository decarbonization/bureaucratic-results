const usTimeZoneNames: { [key: string]: string } = {
    "AST": "America/Puerto_Rico",
    "EST": "America/New_York",
    "EDT": "America/New_York",
    "CST": "America/Detroit",
    "CDT": "America/Detroit",
    "MST": "America/Denver",
    "MDT": "America/Denver",
    "PST": "America/Los_Angeles",
    "PDT": "America/Los_Angeles",
    "AKST": "America/Anchorage",
    "AKDT": "America/Anchorage",
    "HST": "Pacific/Honolulu",
    "HAST": "Pacific/Honolulu",
    "HADT": "Pacific/Honolulu",
    "SST": "Pacific/Midway",
    "SDT": "Pacific/Midway",
    "CHST": "Pacific/Guam",
};

export function unabbreviateTimeZone(abbreviation: string): string | undefined {
    return usTimeZoneNames[abbreviation.toUpperCase()];
}