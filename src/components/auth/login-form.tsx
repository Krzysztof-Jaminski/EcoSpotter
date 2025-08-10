'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email({ message: 'Proszę podać poprawny adres email.' }),
  password: z.string().min(1, { message: 'Hasło jest wymagane.' }),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleGuestLogin = () => {
    setIsLoading(true);
     login();
     toast({
      title: 'Zalogowano jako gość',
      description: "Witaj w EcoSpotter! Możesz teraz eksplorować aplikację.",
    });
    router.push('/map');
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    login();
    toast({
      title: 'Logowanie udane',
      description: "Witaj z powrotem w EcoSpotter!",
    });
    router.push('/map');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="nazwa@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hasło</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Zaloguj się'}
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={handleGuestLogin} disabled={isLoading}>
                <User className="mr-2 h-4 w-4" />
                Kontynuuj jako gość
            </Button>
        </div>
      </form>
    </Form>
  );
}
