
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { addMockTree, getTrees } from '@/lib/actions/tree.actions';
import { useAuth } from '@/lib/auth-provider';
import { useRouter, useSearchParams } from 'next/navigation';
import { ecoAssistantAISubmissionAssistant } from '@/ai/flows/eco-assistant-ai-submission-assistant';
import type { Tree } from '@/types';

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from '@vis.gl/react-google-maps';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
const defaultTreeImage = 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=600&auto=format&fit=crop';

const formSchema = z.object({
  species: z.string().min(2, { message: 'Gatunek jest wymagany.' }),
  diameter: z.coerce
    .number()
    .min(1, { message: 'Średnica musi być liczbą dodatnią.' }),
  description: z.string().min(10, { message: 'Opis musi mieć co najmniej 10 znaków.' }),
  isMonument: z.boolean().default(false).optional(),
  photo: z.any().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

export function TreeSubmissionForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, addPoints } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mapCenter, setMapCenter] = useState({ lat: 50.041187, lng: 21.999121 });
  const [trees, setTrees] = useState<Tree[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      species: '',
      diameter: 0,
      description: '',
      isMonument: false,
      location: mapCenter,
    },
  });
  
  const photoRef = form.register("photo");

  useEffect(() => {
    async function fetchData() {
      const fetchedTrees = await getTrees();
      setTrees(fetchedTrees);
    }
    fetchData();

    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (lat && lng) {
      const newPos = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      };
      setMapCenter(newPos);
      form.setValue('location', newPos);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMapCenter(newPos);
        form.setValue('location', newPos);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLocation = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      form.setValue('location', newLocation, { shouldValidate: true });
    }
  }, [form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiAssist = async () => {
    if (!preview) {
        toast({ variant: "destructive", title: "Najpierw wybierz zdjęcie." });
        return;
    }

    setIsAiLoading(true);
    try {
        const result = await ecoAssistantAISubmissionAssistant({ photoDataUri: preview });
        if (result.species) {
            form.setValue('species', result.species, { shouldValidate: true });
            toast({ title: "Asystent AI", description: `Sądzimy, że to może być ${result.species}.` });
        }
    } catch (error) {
        toast({ variant: "destructive", title: "Asystent AI nie zadziałał", description: "Nie udało się zidentyfikować drzewa." });
    } finally {
        setIsAiLoading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ variant: 'destructive', title: 'Musisz być zalogowany.' });
      return;
    }

    setIsLoading(true);
    
    await addMockTree({
      ...values,
      photoUrl: defaultTreeImage,
      submittedBy: user.uid,
      status: 'Oczekujące',
      isMonument: values.isMonument || false
    });
    
    addPoints(10); // Award 10 points

    setIsLoading(false);

    toast({ title: 'Zgłoszenie udane!', description: 'Dziękujemy za Twój wkład. Zdobyłeś 10 punktów!' });
    router.push('/map');
  }

  return (
    <Card className="bg-secondary/30 border-primary/20">
      <CardContent className="p-4 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormItem>
              <FormLabel>Lokalizacja</FormLabel>
              <FormDescription>Przeciągnij zielony znacznik, aby ustawić lokalizację drzewa.</FormDescription>
              <div className="h-64 md:h-80 w-full rounded-md overflow-hidden border">
                <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                  <Map
                    defaultCenter={mapCenter}
                    defaultZoom={15}
                    gestureHandling={'greedy'}
                    disableDefaultUI={false}
                    zoomControl={true}
                    scrollwheel={true}
                    onClick={(e) => {
                      if (e.detail.latLng) {
                          const newLocation = { lat: e.detail.latLng.lat, lng: e.detail.latLng.lng };
                          form.setValue('location', newLocation, { shouldValidate: true });
                      }
                    }}
                    mapId="submission-map"
                  >
                    {trees.map(tree => (
                       <AdvancedMarker key={tree.id} position={tree.location} >
                          <Pin
                            background={'hsl(var(--muted))'}
                            borderColor={'hsl(var(--muted-foreground))'}
                            glyphColor={'hsl(var(--muted-foreground))'}
                          />
                       </AdvancedMarker>
                    ))}
                    <AdvancedMarker 
                      position={form.watch('location')} 
                      draggable={true} 
                      onDragEnd={handleMarkerDragEnd}
                    >
                       <Pin
                        background={'hsl(var(--primary))'}
                        borderColor={'hsl(var(--primary-foreground))'}
                        glyphColor={'hsl(var(--primary-foreground))'}
                      />
                    </AdvancedMarker>
                  </Map>
                </APIProvider>
              </div>
               <FormMessage>{form.formState.errors.location?.message}</FormMessage>
            </FormItem>

            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zdjęcie</FormLabel>
                   <FormControl>
                    <Input type="file" accept="image/*" {...photoRef} onChange={handleFileChange} ref={fileInputRef}/>
                  </FormControl>
                  {preview && <img src={preview} alt="Podgląd drzewa" className="mt-4 rounded-md max-h-64 w-full object-contain" />}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2 relative">
                 <FormField
                    control={form.control}
                    name="species"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Gatunek</FormLabel>
                        <FormControl>
                            <Input placeholder="np. Dąb, Sosna, Klon" {...field} className="sm:text-base"/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAiAssist}
                    disabled={isAiLoading || !preview}
                    className="w-full sm:w-auto mt-2 sm:mt-0 sm:absolute sm:-top-9 sm:right-0"
                >
                    {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Zidentyfikuj gatunek
                </Button>
            </div>

            <FormField
              control={form.control}
              name="diameter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Średnica pnia (w cm)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="np. 150" {...field} className="sm:text-base"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Opis</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Opisz historię drzewa, jego cechy szczególne, itp." {...field} className="sm:text-base"/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            
            <FormField
              control={form.control}
              name="isMonument"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Drzewo prawdopodobnie spełnia kryteria pomnika przyrody
                    </FormLabel>
                    <FormDescription>
                      Zaznacz, jeśli uważasz, że drzewo jest wystarczająco okazałe.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />


            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Zgłoś drzewo'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
