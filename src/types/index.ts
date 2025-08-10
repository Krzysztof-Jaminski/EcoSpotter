
export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  points: number;
  photoURL?: string;
}

export interface Tree {
  id: string;
  species: string;
  diameter: number;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  photoUrl: string;
  submittedBy: string;
  createdAt: Date; // Using native Date for mock data
  isMonument: boolean;
  status: 'Zweryfikowane' | 'Oczekujące';
}
