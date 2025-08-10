
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';

// Dynamically import the MapView component to prevent SSR issues with the Google Maps library
const MapView = dynamic(() => import('@/components/map/map-view'), {
  ssr: false, // This is crucial for libraries that rely on browser-specific APIs like 'window'
  loading: () => <Skeleton className="w-full h-full" />, // Show a skeleton loader while the map is loading
});

export default function MapPage() {
  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        <Button variant="secondary" className="shadow-lg">
          <Filter className="mr-2 h-4 w-4" />
          Filtruj
        </Button>
        <Button variant="secondary" className="shadow-lg">
          <Download className="mr-2 h-4 w-4" />
          Eksportuj
        </Button>
      </div>
      <MapView />
    </div>
  );
}
