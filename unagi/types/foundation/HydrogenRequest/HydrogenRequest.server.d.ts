import type { ShopifyContextValue, LocalizationContextValue } from '../ShopifyProvider/types.js';
import type { QueryCacheControlHeaders } from '../../utilities/log/log-cache-header.js';
import type { QueryTiming } from '../../utilities/log/log-query-timeline.js';
import type { ResolvedHydrogenConfig, PreloadOptions, QueryKey, RuntimeContext } from '../../types.js';
import { HelmetData as HeadData } from 'react-helmet-async';
import type { SessionSyncApi } from '../session/session-types.js';
export declare type PreloadQueryEntry = {
    key: QueryKey;
    fetcher: (request: HydrogenRequest) => Promise<unknown>;
    preload?: PreloadOptions;
};
export declare type PreloadQueriesByURL = Map<string, PreloadQueryEntry>;
export declare type AllPreloadQueries = Map<string, PreloadQueriesByURL>;
export declare type RouterContextData = {
    routeRendered: boolean;
    serverProps: Record<string, any>;
    routeParams: Record<string, string>;
};
export declare class HydrogenRequest extends Request {
    cookies: Map<string, string>;
    id: string;
    time: number;
    normalizedUrl: string;
    ctx: {
        cache: Map<string, any>;
        head: HeadData;
        hydrogenConfig?: ResolvedHydrogenConfig;
        shopifyConfig?: ShopifyContextValue;
        queryCacheControl: Array<QueryCacheControlHeaders>;
        queryTimings: Array<QueryTiming>;
        preloadQueries: PreloadQueriesByURL;
        analyticsData: any;
        router: RouterContextData;
        buyerIpHeader?: string;
        session?: SessionSyncApi;
        runtime?: RuntimeContext;
        scopes: Map<string, Record<string, any>>;
        localization?: LocalizationContextValue;
        [key: string]: any;
    };
    constructor(input: any);
    constructor(input: RequestInfo, init?: RequestInit);
    previouslyLoadedRequest(): boolean;
    private parseCookies;
    isRscRequest(): boolean;
    savePreloadQuery(query: PreloadQueryEntry): void;
    getPreloadQueries(): PreloadQueriesByURL | undefined;
    savePreloadQueries(): void;
    getBuyerIp(): string | null;
    cacheKey(lockKey?: boolean): Request;
    formData(): Promise<FormData>;
}
//# sourceMappingURL=HydrogenRequest.server.d.ts.map