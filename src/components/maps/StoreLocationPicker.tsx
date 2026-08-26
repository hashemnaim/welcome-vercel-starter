import { useEffect, useMemo, useRef, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { Crosshair, KeyRound, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const KEY_STORAGE = "shoplancer:gmaps-key";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MapValue extends LatLng {
  address?: string;
}

interface Props {
  value: MapValue | null;
  onChange: (value: MapValue) => void;
  lang: "en" | "ar";
}

const DEFAULT_CENTER: LatLng = { lat: 30.0444, lng: 31.2357 }; // Cairo

const tx = (lang: "en" | "ar", en: string, ar: string) =>
  lang === "ar" ? ar : en;

/* ------------------------ Internal map content ----------------------- */
const MapContent = ({ value, onChange, lang }: Props) => {
  const map = useMap();
  const places = useMapsLibrary("places");
  const geocoding = useMapsLibrary("geocoding");
  const inputRef = useRef<HTMLInputElement>(null);
  const center = value ?? DEFAULT_CENTER;

  // Reverse geocode whenever the marker moves
  const reverseGeocode = (latLng: LatLng) => {
    if (!geocoding) {
      onChange(latLng);
      return;
    }
    const geocoder = new geocoding.Geocoder();
    geocoder.geocode(
      { location: latLng },
      (
        results: Array<{ formatted_address?: string }> | null,
        status: string,
      ) => {
        const address =
          status === "OK" && results && results[0]
            ? results[0].formatted_address
            : undefined;
        onChange({ ...latLng, address });
      },
    );
  };

  // Wire up the Places Autocomplete on the search input
  useEffect(() => {
    if (!places || !inputRef.current) return;
    const ac = new places.Autocomplete(inputRef.current, {
      fields: ["geometry", "formatted_address", "name"],
    });
    const listener = ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      const loc = place.geometry?.location;
      if (!loc) return;
      const next = {
        lat: loc.lat(),
        lng: loc.lng(),
        address: place.formatted_address,
      };
      onChange(next);
      map?.panTo(next);
      map?.setZoom(15);
    });
    return () => listener.remove();
  }, [places, map, onChange]);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next: LatLng = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        map?.panTo(next);
        map?.setZoom(15);
        reverseGeocode(next);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <div className="relative h-[300px] overflow-hidden rounded-2xl border border-border">
      {/* Search bar */}
      <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex gap-2">
        <div className="pointer-events-auto flex flex-1 items-center gap-2 rounded-full border border-border bg-background/95 px-3 py-1.5 shadow-elevated backdrop-blur">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder={tx(
              lang,
              "Search address or place…",
              "ابحث عن عنوان أو مكان…",
            )}
            className="h-7 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
          />
        </div>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          onClick={useCurrentLocation}
          aria-label={tx(
            lang,
            "Use my current location",
            "استخدم موقعي الحالي",
          )}
          className="pointer-events-auto h-9 w-9 rounded-full shadow-elevated"
        >
          <Crosshair className="h-4 w-4" />
        </Button>
      </div>

      <Map
        defaultCenter={center}
        defaultZoom={value ? 15 : 11}
        mapId="shoplancer-vendor-map"
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        onClick={(e) => {
          if (!e.detail.latLng) return;
          reverseGeocode({
            lat: e.detail.latLng.lat,
            lng: e.detail.latLng.lng,
          });
        }}
        className="h-full w-full"
      >
        {value && (
          <AdvancedMarker
            position={value}
            draggable
            onDragEnd={(e) => {
              const ll = e.latLng;
              if (!ll) return;
              reverseGeocode({ lat: ll.lat(), lng: ll.lng() });
            }}
          />
        )}
      </Map>
    </div>
  );
};

/* --------------------------- Public component ------------------------ */
export const StoreLocationPicker = ({ value, onChange, lang }: Props) => {
  const envKey =
    (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ?? "";
  const runtimeKey =
    typeof window !== "undefined"
      ? (localStorage.getItem(KEY_STORAGE) ?? "")
      : "";
  const apiKey = envKey || runtimeKey;

  if (!apiKey) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
        {tx(
          lang,
          "Google Maps API key is not configured.",
          "مفتاح Google Maps غير مهيأ.",
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <APIProvider
        apiKey={apiKey}
        libraries={["places", "geocoding"]}
        language={lang === "ar" ? "ar" : "en"}
      >
        <MapContent value={value} onChange={onChange} lang={lang} />
      </APIProvider>
      <div className="flex items-start gap-2 rounded-lg border border-border bg-card px-3 py-2 text-[11px] text-muted-foreground">
        <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          {value ? (
            <>
              <div className="truncate font-medium text-foreground">
                {value.address ?? tx(lang, "Pinned location", "الموقع المحدد")}
              </div>
              <div className="font-mono">
                {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
              </div>
            </>
          ) : (
            <span>
              {tx(
                lang,
                "Tap the map to drop a pin.",
                "اضغط على الخريطة لتحديد الموقع.",
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
