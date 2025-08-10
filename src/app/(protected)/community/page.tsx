
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, ShieldAlert } from 'lucide-react';

const initialPendingSubmissions = [
  {
    id: '5',
    species: 'Buk "Wędrowiec"',
    submittedBy: 'Anna Nowak',
    date: '2024-05-19',
    status: 'Oczekujące',
    upvotes: 15,
    downvotes: 2,
  },
  {
    id: '6',
    species: 'Jesion "Strażnik Pola"',
    submittedBy: 'Piotr Kowalski',
    date: '2024-05-18',
    status: 'Oczekujące',
    upvotes: 8,
    downvotes: 1,
  },
];

const reportedItems = [
    {
      id: '2',
      type: 'Zgłoszenie drzewa',
      reportedBy: 'Piotr Kowalski',
      reason: 'Spam, nieprawdziwe zgłoszenie',
      date: '2024-05-20',
    },
     {
      id: 'comment-42',
      type: 'Komentarz',
      reportedBy: 'Anna Nowak',
      reason: 'Wulgarny język',
      date: '2024-05-19',
    },
]

export default function CommunityPage() {
  const [pendingSubmissions, setPendingSubmissions] = useState(initialPendingSubmissions);

  const handleVote = (id: string, type: 'up' | 'down') => {
    setPendingSubmissions(currentSubmissions =>
      currentSubmissions.map(submission => {
        if (submission.id === id) {
          if (type === 'up') {
            return { ...submission, upvotes: submission.upvotes + 1 };
          } else {
            return { ...submission, downvotes: submission.downvotes + 1 };
          }
        }
        return submission;
      })
    );
  };

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 space-y-12">
      <div>
        <h1 className="text-3xl font-bold font-headline mb-2">Centrum Społeczności</h1>
        <p className="text-muted-foreground">Weryfikuj zgłoszenia, przeglądaj raporty i pomóż w utrzymaniu jakości danych w EcoSpotter.</p>
      </div>

      <Card>
        <CardHeader className="p-6 md:p-8">
          <CardTitle>Zgłoszenia oczekujące na weryfikację</CardTitle>
          <CardDescription>Przejrzyj poniższe zgłoszenia i pomóż nam potwierdzić ich autentyczność. Każdy głos ma znaczenie!</CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gatunek</TableHead>
                  <TableHead className="hidden md:table-cell">Zgłoszony przez</TableHead>
                  <TableHead className="hidden lg:table-cell">Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingSubmissions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium whitespace-normal break-words">{item.species}</TableCell>
                    <TableCell className="hidden md:table-cell whitespace-nowrap">{item.submittedBy}</TableCell>
                    <TableCell className="hidden lg:table-cell whitespace-nowrap">{item.date}</TableCell>
                    <TableCell>
                      <Badge variant='secondary'>{item.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                         <Button variant="outline" size="sm" className="whitespace-nowrap">Szczegóły</Button>
                         <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-600 flex items-center gap-1" onClick={() => handleVote(item.id, 'up')}>
                            <ThumbsUp className="h-4 w-4" />
                            <span className="text-sm font-bold">{item.upvotes}</span>
                         </Button>
                         <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 flex items-center gap-1" onClick={() => handleVote(item.id, 'down')}>
                            <ThumbsDown className="h-4 w-4" />
                             <span className="text-sm font-bold">{item.downvotes}</span>
                         </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader className="p-6 md:p-8">
         <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-destructive" />
            Zgłoszone nadużycia
          </CardTitle>
          <CardDescription>Przejrzyj zgłoszenia od społeczności i zdecyduj o podjęciu akcji moderatorskiej.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 pt-0">
           <div className="overflow-x-auto">
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Typ / Powód</TableHead>
                  <TableHead className="hidden md:table-cell">Zgłoszone przez</TableHead>
                  <TableHead className="hidden lg:table-cell">Data</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium whitespace-normal break-words">
                      <div>{item.type}</div>
                      <div className="text-xs text-muted-foreground md:hidden">{item.reason}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell whitespace-nowrap">{item.reportedBy}</TableCell>
                    <TableCell className="hidden lg:table-cell whitespace-nowrap">{item.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm">Zobacz</Button>
                          <Button variant="outline" size="sm">Odrzuć</Button>
                          <Button variant="destructive" size="sm">Zablokuj</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
