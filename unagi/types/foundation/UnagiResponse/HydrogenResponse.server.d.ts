import type { CachingStrategy } from '../../types.js';
import React from 'react';
export declare class HydrogenResponse extends Response {
    private wait;
    private cacheOptions;
    private proxy;
    status: number;
    statusText: string;
    constructor(...args: ConstructorParameters<typeof Response>);
    doNotStream(): void;
    canStream(): boolean;
    cache(options?: CachingStrategy): CachingStrategy;
    get cacheControlHeader(): string;
    redirect(location: string, status?: number): React.FunctionComponentElement<{
        to: string;
    }>;
}
//# sourceMappingURL=HydrogenResponse.server.d.ts.map