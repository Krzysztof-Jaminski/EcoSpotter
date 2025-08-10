
'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './login-form';
import { SignupForm } from './signup-form';
import { Logo } from '../icons/logo';
import { Card, CardHeader, CardContent, CardTitle as UiCardTitle } from '../ui/card';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: 'login' | 'signup';
}

export function AuthDialog({
  open,
  onOpenChange,
  initialTab = 'login',
}: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 border-0 bg-transparent w-full max-w-md shadow-none">
        <DialogTitle className="sr-only">Logowanie / Rejestracja</DialogTitle>
        <Tabs defaultValue={initialTab} className="w-full">
            <Card className="shadow-2xl border-primary/20 bg-card/90 backdrop-blur-sm">
                <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center mb-2">
                        <Logo className="w-16 h-16 text-primary" />
                    </div>
                    <UiCardTitle className="font-headline text-2xl">Witaj w EcoSpotter</UiCardTitle>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Logowanie</TabsTrigger>
                        <TabsTrigger value="signup">Rejestracja</TabsTrigger>
                    </TabsList>
                </CardHeader>
                <CardContent>
                    <TabsContent value="login">
                        <LoginForm />
                    </TabsContent>
                    <TabsContent value="signup">
                        <SignupForm />
                    </TabsContent>
                </CardContent>
            </Card>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
