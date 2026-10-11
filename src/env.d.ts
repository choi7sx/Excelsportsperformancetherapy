/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="google.maps" />

interface ImportMetaEnv {
  readonly PUBLIC_GA_MEASUREMENT_ID?: string;
  readonly PUBLIC_GOOGLE_MAPS_API_KEY?: string;
  readonly PUBLIC_GOOGLE_PLACE_ID?: string;
}
