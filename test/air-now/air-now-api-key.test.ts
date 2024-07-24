import { describe, expect, it } from '@jest/globals';
import { AirNowApiKey } from '../../lib';

describe("air-now module", () => {
    describe("#AirNowApiKey", () => {
        describe("#authenticate", () => {
            it("should decorate request", async () => {
                const subject = new AirNowApiKey("12345");
                const request = await subject.authenticate({ fetchRequest: new Request("about:local") });
                expect(request.url).toStrictEqual("about:local?api_key=12345");
            });
        });
    });
});
