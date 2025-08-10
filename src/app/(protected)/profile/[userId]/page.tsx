
'use client';

import { useEffect, useState } from 'react';
import { getTreesByUser, getUserById } from '@/lib/actions/tree.actions';
import type { Tree, AppUser } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Trees, Star, CheckCircle, Clock, Award, ShieldAlert, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-provider';

export default function ProfilePage() {
  const pathname = usePathname();
  const userId = pathname.split('/').pop() || '';
  const [profileUser, setProfileUser] = useState<AppUser | null>(null);
  const [submittedTrees, setSubmittedTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    async function loadUserData() {
      if (!userId) {
        setLoading(false);
        return;
      };
      
      const [user, trees] = await Promise.all([
        getUserById(userId),
        getTreesByUser(userId),
      ]);
      
      if (user) {
        setProfileUser(user);
        setSubmittedTrees(trees);
      }
      setLoading(false);
    }
    loadUserData();
  }, [userId]);

  const handleCommentClick = (treeId: string) => {
    toast({
      title: 'Otwieranie komentarzy...',
      description: `Wkrótce będziesz mógł komentować drzewo #${treeId}.`,
    });
  };

  const handleReportClick = (treeId: string) => {
    toast({
      variant: 'destructive',
      title: 'Zgłaszanie nadużycia',
      description: `Dziękujemy za zgłoszenie drzewa #${treeId}. Nasz zespół moderacji wkrótce je przejrzy.`,
    });
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profileUser) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4 text-center">
        <h1 className="text-2xl font-bold">Nie znaleziono użytkownika</h1>
        <p className="text-muted-foreground">Żądany użytkownik nie istnieje.</p>
        <Link href="/map" className="mt-4 inline-block text-primary underline">
          Powrót do mapy
        </Link>
      </div>
    );
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <Card className="mb-8 bg-secondary/30 border-primary/20">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-primary/20">
            <AvatarImage src={profileUser.photoURL ?? ''} alt={profileUser.displayName} data-ai-hint="user avatar" />
            <AvatarFallback className="text-3xl">
              {getInitials(profileUser.displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold font-headline">{profileUser.displayName}</h1>
            <p className="text-muted-foreground">{profileUser.email}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 pt-2">
              <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                <Star className="h-5 w-5" />
                <span>{profileUser.points} Punktów</span>
              </div>
              <div className="flex items-center gap-2 text-lg font-semibold text-accent-foreground">
                <Trees className="h-5 w-5" />
                <span>{submittedTrees.length} Zgłoszonych drzew</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-headline">Odznaki</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="secondary" className="p-4 flex flex-col items-center gap-2 h-auto text-center border-yellow-400/50">
            <Award className="h-8 w-8 text-yellow-400" />
            <span className="font-bold">Pionier</span>
            <span className="text-xs">Pierwsze 10 zgłoszeń</span>
          </Badge>
          <Badge variant="secondary" className="p-4 flex flex-col items-center gap-2 h-auto text-center border-green-500/50">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <span className="font-bold">Weryfikator</span>
             <span className="text-xs">5 zweryfikowanych drzew</span>
          </Badge>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 font-headline">Zgłoszenia użytkownika {profileUser.displayName}</h2>
        {submittedTrees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submittedTrees.map((tree) => (
              <Card key={tree.id} className="overflow-hidden flex flex-col bg-secondary/30 border-primary/20">
                <div className="relative h-48 w-full">
                  <Image src={tree.photoUrl} alt={tree.species} fill={true} style={{objectFit: "cover"}} data-ai-hint="ancient tree nature" />
                   <Badge 
                      variant={tree.status === 'Zweryfikowane' ? 'default' : 'secondary'} 
                      className="absolute top-2 right-2"
                   >
                      {tree.status === 'Zweryfikowane' ? <CheckCircle className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                      {tree.status}
                    </Badge>
                </div>
                <CardHeader>
                  <CardTitle>{tree.species}</CardTitle>
                  <CardDescription>
                    Zgłoszono {format(tree.createdAt, 'PPP', { locale: pl })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                   <p className="text-sm text-muted-foreground italic truncate">{tree.description}</p>
                </CardContent>
                 <CardContent className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleCommentClick(tree.id)}>
                      <MessageSquare className="mr-2 h-4 w-4"/> Komentarze
                    </Button>
                    {/* Pokaż przycisk zgłaszania tylko jeśli użytkownik ogląda profil innej osoby */}
                    {currentUser && currentUser.uid !== userId && (
                      <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleReportClick(tree.id)}>
                        <ShieldAlert className="h-4 w-4"/>
                      </Button>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Ten użytkownik nie zgłosił jeszcze żadnych drzew.
          </p>
        )}
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Card className="mb-8 bg-secondary/30">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2 text-center sm:text-left">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div>
        <Skeleton className="h-8 w-56 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-secondary/30">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
