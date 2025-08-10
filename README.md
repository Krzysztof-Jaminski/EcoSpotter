# 🌳 EcoSpotter - Aplikacja do Mapowania Drzew

**EcoSpotter** to nowoczesna aplikacja webowa, która pozwala użytkownikom odkrywać, mapować i uczyć się o ważnych drzewach w ich okolicy. Aplikacja wykorzystuje sztuczną inteligencję do udzielania porad ekologicznych i pomocy w identyfikacji drzew.

## 🚀 Funkcje Aplikacji

- **🗺️ Interaktywna Mapa** - Oznaczaj i przeglądaj lokalizacje drzew
- **🤖 Asystent AI** - Otrzymuj porady ekologiczne i pomoc w identyfikacji gatunków
- **📱 Responsywny Design** - Działa na wszystkich urządzeniach
- **🔥 Firebase Backend** - Bezpieczna autoryzacja i baza danych
- **🌍 Geolokalizacja** - Automatyczne wykrywanie Twojej lokalizacji
- **📊 System Punktów** - Zdobywaj punkty za zgłaszanie drzew

## 🛠️ Technologie

- **Frontend:** Next.js 15, React 18, TypeScript
- **Styling:** Tailwind CSS, Radix UI
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Maps:** Google Maps API z @vis.gl/react-google-maps
- **AI:** Google Gemini AI przez Genkit
- **Deployment:** Firebase Hosting

## 📋 Wymagania

- **Node.js** (wersja 18 lub nowsza)
- **Konto Google** do utworzenia projektu Firebase
- **Package manager:** `npm`, `yarn` lub `pnpm`

## ⚡ Szybki Start

### 1. Sklonuj Repozytorium

```bash
git clone <URL_REPOZYTORIUM>
cd EcoSpotter
```

### 2. Zainstaluj Zależności

```bash
npm install
# lub
yarn install
# lub
pnpm install
```

### 3. Skonfiguruj Firebase

1. **Utwórz Projekt Firebase:**
   - Przejdź do [Firebase Console](https://console.firebase.google.com/)
   - Kliknij "Add project" i postępuj zgodnie z instrukcjami

2. **Włącz Usługi:**
   - **Authentication** → Email/Password provider
   - **Firestore Database** → Utwórz bazę w trybie testowym
   - **Storage** → Utwórz bucket w trybie testowym

3. **Pobierz Konfigurację:**
   - W projekcie kliknij ikonę Web (`</>`)
   - Skopiuj dane konfiguracyjne

### 4. Skonfiguruj Google Maps API

1. **Pobierz Klucz API:**
   - Przejdź do [Google Cloud Console](https://console.cloud.google.com/)
   - Utwórz projekt i włącz Maps JavaScript API
   - Wygeneruj klucz API

2. **Zabezpiecz Klucz:**
   - Ogranicz do `localhost:9002/*` (development)
   - Dodaj swój domenę produkcyjną

### 5. Utwórz Plik Environment

Stwórz plik `.env.local` w głównym katalogu:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="twój_firebase_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="twój_projekt.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="twój_projekt_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="twój_projekt.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="twój_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="twój_app_id"

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="twój_google_maps_api_key"

# Gemini AI (opcjonalnie)
GEMINI_API_KEY="twój_gemini_api_key"
```

### 6. Uruchom Aplikację

```bash
# Serwer deweloperski
npm run dev

# Aplikacja będzie dostępna na: http://localhost:9002
```

## 🏗️ Struktura Projektu

```
EcoSpotter/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # Komponenty React
│   │   ├── auth/           # Autoryzacja
│   │   ├── map/            # Mapa i lokalizacja
│   │   ├── forms/          # Formularze
│   │   └── ui/             # Komponenty UI
│   ├── lib/                # Utilities i konfiguracja
│   ├── ai/                 # Integracja AI
│   └── types/              # Definicje TypeScript
├── public/                  # Statyczne pliki
└── docs/                    # Dokumentacja
```

## 🔧 Dostępne Skrypty

```bash
npm run dev          # Serwer deweloperski
npm run build        # Build produkcyjny
npm run start        # Serwer produkcyjny
npm run lint         # Sprawdź kod
npm run typecheck    # Sprawdź typy TypeScript
```

## 🌐 Deployment

### Vercel (Zalecane)

Vercel to najlepsza platforma do hostowania aplikacji Next.js.

#### Opcja 1: Deployment przez Vercel Dashboard

1. **Przygotuj Projekt:**
   ```bash
   # Upewnij się że wszystko działa lokalnie
   npm run build
   npm run start
   ```

2. **Wdróż na Vercel:**
   - Przejdź na [vercel.com](https://vercel.com)
   - Zaloguj się przez GitHub/GitLab/Bitbucket
   - Kliknij "New Project"
   - Wybierz repozytorium EcoSpotter
   - Vercel automatycznie wykryje Next.js i skonfiguruje build

3. **Skonfiguruj Zmienne Środowiskowe:**
   - W projekcie Vercel przejdź do "Settings" → "Environment Variables"
   - Dodaj wszystkie zmienne z `.env.local`:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
     NEXT_PUBLIC_FIREBASE_PROJECT_ID
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
     NEXT_PUBLIC_FIREBASE_APP_ID
     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
     GEMINI_API_KEY
     ```

4. **Automatyczny Deployment:**
   - Każdy push do `main` branch automatycznie wdroży nową wersję
   - Pull Requesty tworzą preview deployments
   - Automatyczne HTTPS i CDN

5. **Domeny:**
   - Vercel automatycznie przypisuje domenę `twój-projekt.vercel.app`
   - Możesz dodać własną domenę w "Settings" → "Domains"
   - Darmowe SSL certyfikaty

#### Opcja 2: Vercel CLI

```bash
# Zainstaluj Vercel CLI
npm install -g vercel

# Zaloguj się
vercel login

# Wdróż
vercel

# Lub wdróż do produkcji
vercel --prod
```

### Firebase Hosting (Alternatywa)

Jeśli wolisz Firebase Hosting:
```bash
# Zainstaluj Firebase CLI
npm install -g firebase-tools

# Zaloguj się
firebase login

# Zbuduj aplikację
npm run build

# Wdróż
firebase deploy
```

## 🤝 Współpraca

1. Fork repozytorium
2. Utwórz branch dla nowej funkcji (`git checkout -b feature/AmazingFeature`)
3. Commit zmiany (`git commit -m 'Add some AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

## 📝 Licencja

Ten projekt jest licencjonowany pod licencją MIT - zobacz plik [LICENSE](LICENSE) dla szczegółów.

## 🆘 Wsparcie

Jeśli masz pytania lub problemy:
- Otwórz [Issue](https://github.com/twoja-nazwa/EcoSpotter/issues)
- Sprawdź [dokumentację Firebase](https://firebase.google.com/docs)
- Przeczytaj [dokumentację Next.js](https://nextjs.org/docs)

## 🙏 Podziękowania

- [Next.js](https://nextjs.org/) - Framework React
- [Firebase](https://firebase.google.com/) - Backend i hosting
- [Google Maps](https://developers.google.com/maps) - Mapy i geolokalizacja
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - Komponenty UI

---

**🌱 Sadź drzewa, mapuj świat, chroń przyrodę!** 🌱
