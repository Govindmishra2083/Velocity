import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"

interface LocationMapProps {
  latitude?: number
  longitude?: number
  zoom?: number
}

export default function LocationMap({ latitude = 20.5937, longitude = 78.9629, zoom = 5 }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initMap = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

        if (!apiKey) {
          setError("Google Maps API key not found. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.")
          setIsLoading(false)
          return
        }

        const loader = new Loader({
          apiKey,
          version: "weekly",
          libraries: ["places"]
        })

        const { Map } = await loader.importLibrary("maps")

        if (mapRef.current) {
          const mapInstance = new Map(mapRef.current, {
            center: { lat: latitude, lng: longitude },
            zoom: zoom,
            styles: [
              {
                featureType: "all",
                elementType: "geometry.fill",
                stylers: [{ weight: "2.00" }]
              },
              {
                featureType: "all",
                elementType: "geometry.stroke",
                stylers: [{ color: "#9c9c9c" }]
              },
              {
                featureType: "all",
                elementType: "labels.text",
                stylers: [{ visibility: "on" }]
              },
              {
                featureType: "landscape",
                elementType: "all",
                stylers: [{ color: "#f2f2f2" }]
              },
              {
                featureType: "landscape",
                elementType: "geometry.fill",
                stylers: [{ color: "#ffffff" }]
              },
              {
                featureType: "landscape.man_made",
                elementType: "geometry.fill",
                stylers: [{ color: "#ffffff" }]
              },
              {
                featureType: "poi",
                elementType: "all",
                stylers: [{ visibility: "off" }]
              },
              {
                featureType: "road",
                elementType: "all",
                stylers: [{ saturation: -100 }, { lightness: 45 }]
              },
              {
                featureType: "road",
                elementType: "geometry.fill",
                stylers: [{ color: "#eeeeee" }]
              },
              {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#7b7b7b" }]
              },
              {
                featureType: "road",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#ffffff" }]
              },
              {
                featureType: "road.highway",
                elementType: "all",
                stylers: [{ visibility: "simplified" }]
              },
              {
                featureType: "road.arterial",
                elementType: "labels.icon",
                stylers: [{ visibility: "off" }]
              },
              {
                featureType: "transit",
                elementType: "all",
                stylers: [{ visibility: "off" }]
              },
              {
                featureType: "water",
                elementType: "all",
                stylers: [{ color: "#46bcec" }, { visibility: "on" }]
              },
              {
                featureType: "water",
                elementType: "geometry.fill",
                stylers: [{ color: "#c8d7d4" }]
              },
              {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#070707" }]
              },
              {
                featureType: "water",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#ffffff" }]
              }
            ]
          })

          setMap(mapInstance)
          setIsLoading(false)
        }
      } catch (err) {
        console.error("Error loading Google Maps:", err)
        setError("Failed to load Google Maps. Please check your API key and internet connection.")
        setIsLoading(false)
      }
    }

    initMap()
  }, [latitude, longitude, zoom])

  if (error) {
    return (
      <Card className="bg-black/30 border-gray-800 rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="w-full h-96 bg-gradient-to-br from-red-900/20 to-black flex flex-col items-center justify-center relative overflow-hidden">
            <div className="relative z-10 text-center space-y-4">
              <div className="p-4 bg-red-500/10 rounded-full w-fit mx-auto border border-red-500/20">
                <MapPin className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Map Error</h3>
                <p className="text-red-400 text-sm max-w-xs">{error}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="bg-black/30 border-gray-800 rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="w-full h-96 bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center relative overflow-hidden">
            <div className="relative z-10 text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 text-sm">Loading map...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black/30 border-gray-800 rounded-xl overflow-hidden">
      <CardContent className="p-0">
        <div ref={mapRef} className="w-full h-96" />
      </CardContent>
    </Card>
  )
}
