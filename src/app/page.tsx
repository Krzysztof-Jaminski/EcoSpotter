
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Bot, Download, CheckCircle, Leaf } from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import { AuthDialog } from '@/components/auth/auth-dialog';

export default function Home() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<'login' | 'signup'>('login');

  const openDialog = (tab: 'login' | 'signup') => {
    setInitialTab(tab);
    setAuthDialogOpen(true);
  };

  return (
    <>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} initialTab={initialTab} />
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 w-full z-20 border-b border-white/10">
          <Link href="/" className="flex items-center justify-center" prefetch={false}>
            <Logo className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold font-headline">EcoSpotter</span>
          </Link>
          <nav className="ml-auto flex gap-2 sm:gap-4">
            <Button variant="ghost" onClick={() => openDialog('login')}>
              Logowanie
            </Button>
            <Button onClick={() => openDialog('signup')} className="bg-primary hover:bg-primary/90 shadow-lg text-primary-foreground">
              Zarejestruj się
            </Button>
          </nav>
        </header>
        <main className="flex-1">
         <section className="w-full py-20 md:py-32 lg:py-40 xl:py-48 text-center z-10 relative">
            <div className="container px-4 md:px-6">
              <div className="max-w-3xl mx-auto space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
                  <span className="text-primary">Eco</span>
                  <span>Spotter</span>
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl">
                  Zmapuj przyszłość naszej planety, jedno drzewo na raz.
                </p>
                <div className="pt-6">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-full shadow-lg" onClick={() => openDialog('signup')}>
                    Zacznij już teraz
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section id="features" className="w-full py-12 md:py-24 lg:py-32 z-10 relative">
            <div className="container space-y-12 px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                    Platforma dla strażników przyrody
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    EcoSpotter to więcej niż mapa. To narzędzie do aktywnej ochrony, edukacji i budowania społeczności, która dba o zielone dziedzictwo naszej planety.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <Card className="feature-card bg-card/80 border-primary/20 transition-all shadow-lg">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-headline">Mapuj i odkrywaj</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Zgłaszaj drzewa-pomniki i inne cenne obiekty przyrodnicze. Filtruj mapę według gatunku, statusu weryfikacji lub lokalizacji.</p>
                  </CardContent>
                </Card>
                 <Card className="feature-card bg-card/80 border-primary/20 transition-all shadow-lg">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-headline">Weryfikacja społeczności</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Zdobywaj punkty i odznaki za swoją aktywność. Komentuj i oceniaj zgłoszenia innych, pomagając w budowaniu wiarygodnej bazy danych.</p>
                  </CardContent>
                </Card>
                <Card className="feature-card bg-card/80 border-primary/20 transition-all shadow-lg">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-headline">EcoAssistant AI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Nasz inteligentny asystent pomoże Ci zidentyfikować gatunki na podstawie zdjęcia i udzieli porad, jak dbać o zieleń.</p>
                  </CardContent>
                </Card>
                 <Card className="feature-card bg-card/80 border-primary/20 transition-all shadow-lg">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-headline">Współpraca z gminą</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Twoje zweryfikowane zgłoszenia mogą stać się podstawą do oficjalnego objęcia drzew ochroną pomnikową we współpracy z samorządem.</p>
                  </CardContent>
                </Card>
                 <Card className="feature-card bg-card/80 border-primary/20 transition-all shadow-lg">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Download className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-headline">Eksportuj dane</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Pobieraj dane o drzewach w popularnych formatach (CSV, GeoJSON), aby wykorzystać je w swoich analizach lub projektach.</p>
                  </CardContent>
                </Card>
                 <Card className="feature-card bg-card/80 border-primary/20 transition-all shadow-lg">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Leaf className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-headline">Baza wiedzy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Dowiedz się więcej o gatunkach drzew, ich roli w ekosystemie oraz kryteriach, jakie muszą spełniać, by zostać pomnikiem przyrody.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-white/10 z-10 relative bg-background">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} EcoSpotter. Wszelkie prawa zastrzeżone.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link
              href="#"
              className="text-xs hover:underline underline-offset-4"
              prefetch={false}
            >
              Warunki korzystania z usługi
            </Link>
            <Link
              href="#"
              className="text-xs hover:underline underline-offset-4"
              prefetch={false}
            >
              Prywatność
            </Link>
          </nav>
        </footer>
      </div>
    </>
  );
}
