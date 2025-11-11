import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"

export default function LocationMapPlaceholder() {
  return (
    <Card className="bg-black/30 border-gray-800 rounded-xl overflow-hidden">
      <CardContent className="p-0">
        <div className="w-full h-96 bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center relative overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center space-y-4">
            <div className="p-4 bg-blue-500/10 rounded-full w-fit mx-auto border border-blue-500/20">
              <MapPin className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Live Location Map</h3>
              <p className="text-gray-400 text-sm max-w-xs">
                Add your Google Maps API key in the environment variables to enable real-time location tracking on the
                map.
              </p>
            </div>
            <div className="text-xs text-gray-500 mt-4">Coordinates will be displayed here once configured</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
