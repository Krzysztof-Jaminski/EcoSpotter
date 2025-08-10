
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, Send, Loader2, X, User, GripVertical } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { getEcologicalAdvice } from '@/ai/flows/eco-assistant-ai-ecological-advice';
import { findTreesNearMe } from '@/ai/flows/eco-assistant-ai-tree-finder';
import { useAuth } from '@/lib/auth-provider';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { usePathname } from 'next/navigation';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

// Promise with timeout
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, ms);

    promise
      .then(value => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch(reason => {
        clearTimeout(timer);
        reject(reason);
      });
  });
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  
  const [height, setHeight] = useState(500);
  const isResizing = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing.current) {
      const newHeight = window.innerHeight - e.clientY - 100; // 100px offset from bottom
      if (newHeight > 300 && newHeight < window.innerHeight * 0.8) {
        setHeight(newHeight);
      }
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let aiResponseText: string;
      const aiRequestTimeout = 15000; // 15 seconds

      if (input.toLowerCase().includes('znajdź drzewa')) {
        const location = 'twoja obecna okolica'; 
        const response = await withTimeout(findTreesNearMe({ userLocation: location }), aiRequestTimeout);
        aiResponseText = `Znalazłem dla Ciebie kilka drzew:\n${response.treeLocations}`;
        if (response.additionalNotes) {
            aiResponseText += `\n\nDodatkowe uwagi: ${response.additionalNotes}`;
        }
      } else {
        const response = await withTimeout(getEcologicalAdvice({ query: input, currentPath: pathname }), aiRequestTimeout);
        aiResponseText = response.advice;
      }
      
      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: aiResponseText, sender: 'ai' };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      const errorMessageText = error instanceof Error && error.message === 'Request timed out'
        ? 'Przepraszam, odpowiedź trwa zbyt długo. Spróbuj zadać inne pytanie.'
        : 'Przepraszam, wystąpił problem z połączeniem. Spróbuj ponownie.';

      const errorMessage: Message = { id: (Date.now() + 1).toString(), text: errorMessageText, sender: 'ai' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };
  
  return (
    <>
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          size="icon"
          className="rounded-full w-14 h-14 shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50">
          <Card 
            className="w-[350px] flex flex-col shadow-2xl" 
            style={{ height: `${height}px` }}
          >
            <CardHeader 
              className="flex flex-row items-center justify-between cursor-grab"
              onMouseDown={handleMouseDown}
            >
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-primary" />
                <CardTitle className="font-headline">EcoAssistant AI</CardTitle>
              </div>
              <GripVertical className="text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex items-end gap-2',
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.sender === 'ai' && (
                        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                            <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          'rounded-lg px-3 py-2 max-w-[80%]',
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      </div>
                       {message.sender === 'user' && user && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                     <div className='flex items-end gap-2 justify-start'>
                        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                            <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg px-3 py-2">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Zapytaj o naturę..."
                    disabled={isLoading}
                  />
                  <Button type="submit" size="icon" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
