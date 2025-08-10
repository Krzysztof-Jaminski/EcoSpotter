
'use client';

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  MapMouseEvent,
} from '@vis.gl/react-google-maps';
import { useEffect, useState, useCallback } from 'react';
import type { Tree, AppUser } from '@/types';
import { getTrees, getUserById } from '@/lib/actions/tree.actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Button } from '../ui/button';
import Link from 'next/link';
import { CheckCircle, Clock, Heart, MessageSquare, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

type NewTreeLocation = { lat: number; lng: number };

export default function MapView() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);
  const [newTreeLocation, setNewTreeLocation] = useState<NewTreeLocation | null>(null);
  const [likedTrees, setLikedTrees] = useState<Set<string>>(new Set());
  
  const [mapCenter, setMapCenter] = useState({ lat: 50.041187, lng: 21.999121 });
  const [submitter, setSubmitter] = useState<AppUser | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchTreeData = async () => {
      const fetchedTrees = await getTrees();
      setTrees(fetchedTrees);
    };
    fetchTreeData();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log('Geolokalizacja nie powiodła się, domyślnie Rzeszów.');
        }
      );
    }
  }, []);

  const selectedTree = trees.find(t => t.id === selectedTreeId);

  useEffect(() => {
    const fetchSubmitter = async () => {
      if (selectedTree) {
        const user = await getUserById(selectedTree.submittedBy);
        setSubmitter(user ?? null);
      } else {
        setSubmitter(null);
      }
    };
    fetchSubmitter();
  }, [selectedTree]);

  const handleMapClick = useCallback((e: MapMouseEvent) => {
    if (e.detail.latLng) {
      setSelectedTreeId(null); // Close existing tree info window
      setNewTreeLocation({ lat: e.detail.latLng.lat, lng: e.detail.latLng.lng });
    }
  }, []);

  const handleMarkerClick = useCallback((treeId: string) => {
    setNewTreeLocation(null); // Close new tree info window
    setSelectedTreeId(treeId);
  }, []);

  const handleCloseInfoWindow = useCallback(() => {
    setSelectedTreeId(null);
    setNewTreeLocation(null);
  }, []);
  
  const handleGoToSubmit = () => {
    if (newTreeLocation) {
        router.push(`/submit?lat=${newTreeLocation.lat}&lng=${newTreeLocation.lng}`);
    }
  };

  const handleLike = (e: React.MouseEvent, treeId: string) => {
    e.stopPropagation();
    const newLikedTrees = new Set(likedTrees);
    if (newLikedTrees.has(treeId)) {
        newLikedTrees.delete(treeId);
        toast({ title: 'Usunięto z ulubionych!' });
    } else {
        newLikedTrees.add(treeId);
        toast({ title: 'Dodano do ulubionych!', description: 'To drzewo zostało dodane do Twojej listy ulubionych.' });
    }
    setLikedTrees(newLikedTrees);
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({ title: 'Otwieranie komentarzy...', description: 'Wkrótce będziesz mógł tutaj komentować.' });
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Brak klucza API Google Maps.</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <Map
        mapId={'ecospotter-map'}
        style={{ width: '100%', height: '100%' }}
        defaultCenter={mapCenter}
        defaultZoom={13}
        gestureHandling={'greedy'}
        disableDefaultUI={false}
        streetViewControl={true}
        mapTypeControl={true}
        zoomControl={true}
        onClick={handleMapClick}
      >
        {trees.map((tree) => (
          <AdvancedMarker
            key={tree.id}
            position={tree.location}
            onClick={() => handleMarkerClick(tree.id)}
          >
             <Pin
              background={tree.status === 'Zweryfikowane' ? 'hsl(var(--primary))' : '#A9A9A9'}
              borderColor={'hsl(var(--primary-foreground))'}
              glyphColor={'hsl(var(--primary-foreground))'}
            />
          </AdvancedMarker>
        ))}

        {selectedTree && (
           <InfoWindow
            position={selectedTree.location}
            onCloseClick={handleCloseInfoWindow}
            >
            <div className="w-80 p-1">
                <Card className="border-0 shadow-none">
                    <div className="relative h-40 w-full">
                         <Image
                            src={selectedTree.photoUrl}
                            alt={`Zdjęcie ${selectedTree.species}`}
                            fill={true}
                            style={{objectFit: 'cover'}}
                            className="rounded-t-lg"
                            data-ai-hint="old tree forest"
                        />
                         <Badge 
                            variant={selectedTree.status === 'Zweryfikowane' ? 'default' : 'secondary'} 
                            className="absolute top-2 right-2"
                        >
                            {selectedTree.status === 'Zweryfikowane' ? <CheckCircle className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                            {selectedTree.status}
                        </Badge>
                    </div>
                    <CardHeader className="p-3">
                        <CardTitle className="text-base font-bold font-headline">{selectedTree.species}</CardTitle>
                        <CardDescription className="text-xs">
                         Zgłoszono {formatDistanceToNow(selectedTree.createdAt, { addSuffix: true, locale: pl })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 text-xs space-y-3">
                        {submitter ? (
                            <p>przez <Link href={`/profile/${submitter.uid}`} className="font-semibold text-primary hover:underline">{submitter.displayName}</Link></p>
                        ) : (
                           <p>przez anonimowego użytkownika</p>
                        )}
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" className="h-8 w-8" onClick={(e) => handleLike(e, selectedTree.id)}>
                            <Heart className={cn("h-4 w-4 text-rose-500", likedTrees.has(selectedTree.id) && "fill-current")} />
                          </Button>
                           <Button size="icon" variant="outline" className="h-8 w-8" onClick={handleComment}>
                            <MessageSquare className="h-4 w-4 text-sky-500" />
                          </Button>
                          <Button size="sm" className="flex-1" asChild>
                            <Link href={`/profile/${selectedTree.submittedBy}`}>Zobacz profil</Link>
                          </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
          </InfoWindow>
        )}

        {newTreeLocation && (
            <>
                <AdvancedMarker
                    position={newTreeLocation}
                    onClick={() => setNewTreeLocation(newTreeLocation)} // Keep it open on click
                >
                    <Pin
                        background={'hsl(var(--primary))'}
                        borderColor={'hsl(var(--primary-foreground))'}
                    >
                       <PlusCircle className="text-primary-foreground" />
                    </Pin>
                </AdvancedMarker>
                <InfoWindow
                    position={newTreeLocation}
                    onCloseClick={handleCloseInfoWindow}
                >
                    <div className="p-2 text-center space-y-2">
                        <p className="text-sm font-medium">Chcesz zgłosić nowe drzewo w tej lokalizacji?</p>
                        <Button onClick={handleGoToSubmit} size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Zgłoś tutaj
                        </Button>
                    </div>
                </InfoWindow>
            </>
        )}

      </Map>
    </APIProvider>
  );
}
