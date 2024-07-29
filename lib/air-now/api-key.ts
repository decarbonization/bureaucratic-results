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

import { SereneAuthority, SereneAuthorityAuthenticateOptions, SereneAuthorityRefreshOptions } from "serene-front";
import { setRequestSearchParams } from "serene-front/urls";

export class AirNowApiKey implements SereneAuthority {
    constructor(
        private readonly apiKey: string
    ) {
    }

    get retryLimit(): number {
        return 0;
    }

    get isValid(): boolean {
        return true;
    }

    async refresh({ }: SereneAuthorityRefreshOptions): Promise<void> {
        /* do nothing */
    }

    async authenticate({ fetchRequest }: SereneAuthorityAuthenticateOptions): Promise<Request> {
        return setRequestSearchParams(fetchRequest, [
            ["api_key", this.apiKey],
        ]);
    }
}
