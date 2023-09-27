/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.3.1.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as demobot_demos from "../demobot_demos";
import type * as demobot_playlist from "../demobot_playlist";
import type * as demoplayer_chats from "../demoplayer_chats";
import type * as init from "../init";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  demobot_demos: typeof demobot_demos;
  demobot_playlist: typeof demobot_playlist;
  demoplayer_chats: typeof demoplayer_chats;
  init: typeof init;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
