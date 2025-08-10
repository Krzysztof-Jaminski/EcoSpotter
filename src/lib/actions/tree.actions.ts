'use server';

import type { Tree, AppUser } from '@/types';
import { revalidatePath } from 'next/cache';

// --- MOCK USERS ---
const mockUsers: AppUser[] = [
  {
    uid: 'mock-user-id',
    email: 'test@example.com',
    displayName: 'Eko Wojownik',
    points: 1337,
    photoURL: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    uid: 'user-2',
    email: 'anna.nowak@example.com',
    displayName: 'Anna Nowak',
    points: 520,
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
    {
    uid: 'user-3',
    email: 'piotr.kowalski@example.com',
    displayName: 'Piotr Kowalski',
    points: 250,
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const defaultTreeImage = 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=600&auto=format&fit=crop';

// MOCK FUNCTION: This would fetch from Firestore in a real app
const mockTrees: Tree[] = [
    {
      id: '1',
      species: 'Dąb "Warcisław"',
      diameter: 350,
      description: "Najstarszy dąb w okolicy, świadek wielu historycznych wydarzeń. Jego potężna korona daje schronienie licznym gatunkom ptaków.",
      location: { lat: 50.0614, lng: 22.0045 },
      photoUrl: defaultTreeImage,
      submittedBy: 'mock-user-id',
      createdAt: new Date(),
      isMonument: true,
      status: "Zweryfikowane",
    },
    {
      id: '2',
      species: 'Wierzba płacząca "Helena"',
      diameter: 180,
      description: "Piękna wierzba nad brzegiem rzeki, ulubione miejsce spotkań zakochanych. Jej gałęzie tworzą naturalną altanę.",
      location: { lat: 50.041187, lng: 21.999121 },
      photoUrl: defaultTreeImage,
      submittedBy: 'user-2',
      createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
      isMonument: false,
      status: "Zweryfikowane",
    },
    {
      id: '3',
      species: 'Klon "Pogromca Betonu"',
      diameter: 120,
      description: "Niezwykły klon, który wyrósł w szczelinie chodnika, symbol siły natury w miejskiej dżungli. Inspiruje mieszkańców do dbania o zieleń.",
      location: { lat: 50.049, lng: 22.001 },
      photoUrl: defaultTreeImage,
      submittedBy: 'user-3',
      createdAt: new Date(Date.now() - 86400000 * 12), // 12 days ago
      isMonument: false,
      status: "Zweryfikowane",
    },
     {
      id: '4',
      species: 'Lipa "Pszczeli Raj"',
      diameter: 250,
      description: "Rozłożysta lipa, której kwiaty przyciągają setki pszczół. Lokalni pszczelarze cenią ją za wyjątkowy miód.",
      location: { lat: 50.035, lng: 21.98 },
      photoUrl: defaultTreeImage,
      submittedBy: 'mock-user-id',
      createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
      isMonument: true,
      status: "Zweryfikowane",
    },
    {
      id: '5',
      species: 'Buk "Wędrowiec"',
      diameter: 280,
      description: "Stary buk na skraju lasu, popularny cel spacerów. Mówi się, że pod jego korzeniami ukryty jest skarb.",
      location: { lat: 50.055, lng: 22.023 },
      photoUrl: defaultTreeImage,
      submittedBy: 'user-2',
      createdAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
      isMonument: true,
      status: "Oczekujące",
    },
    {
      id: '6',
      species: 'Jesion "Strażnik Pola"',
      diameter: 210,
      description: "Samotny jesion na środku pola, daje cień zmęczonym rolnikom. Jego liście pięknie przebarwiają się jesienią.",
      location: { lat: 50.021, lng: 21.995 },
      photoUrl: defaultTreeImage,
      submittedBy: 'user-3',
      createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
      isMonument: false,
      status: "Oczekujące",
    },
];


export async function getTrees(): Promise<Tree[]> {
  return Promise.resolve(mockTrees);
}

export async function getTreesByUser(userId: string): Promise<Tree[]> {
  const userTrees = mockTrees.filter(tree => tree.submittedBy === userId);
  return Promise.resolve(userTrees);
}

export async function addMockTree(tree: Omit<Tree, 'id' | 'createdAt'>) {
    const newTree: Tree = {
        ...tree,
        id: (mockTrees.length + 1).toString(),
        createdAt: new Date(),
    };
    mockTrees.push(newTree);
    revalidatePath('/map');
    revalidatePath(`/profile/${tree.submittedBy}`);
    return newTree;
}

export async function getUserById(userId: string): Promise<AppUser | undefined> {
  return Promise.resolve(mockUsers.find(user => user.uid === userId));
}

export async function getAllUsers(): Promise<AppUser[]> {
    return Promise.resolve(mockUsers);
}
