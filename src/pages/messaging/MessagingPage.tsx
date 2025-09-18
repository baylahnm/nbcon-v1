import { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/auth';
import { useMessagesStore } from '@/features/messages/store/messagesStore';
import { ArrowLeft, Phone, Info, Search, MoreHorizontal, Paperclip, Smile, Mic, Languages, MessageCircle } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export function MessagingPage() {
  const { profile } = useAuthStore();
  const {
    threads,
    activeThreadId,
    messagesByThread,
    loadThreads,
    openThread,
    sendMessage,
    setDraft,
    inputDrafts,
    addReaction,
    toggleHijri,
    hijriEnabled,
    toggleTranslate,
    translationEnabled,
  } = useMessagesStore();

  const [showMobileList, setShowMobileList] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [filter, setFilter] = useState<'all'|'unread'|'starred'|'archived'>('all');
  const draft = inputDrafts[activeThreadId || ''] || '';
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const [showJump, setShowJump] = useState(false);
  const [showMobileInfo, setShowMobileInfo] = useState(false);

  useEffect(() => { loadThreads(filterToFlags(filter)); }, [filter, loadThreads]);

  const activeMessages = useMemo(() => (
    activeThreadId ? (messagesByThread[activeThreadId] || []) : []
  ), [activeThreadId, messagesByThread]);

  useEffect(() => {
    // Auto-scroll to bottom when opening a thread or sending
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [activeThreadId]);

  useEffect(() => {
    const el = messagesScrollRef.current;
    if (!el) return;
    const handler = () => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      setShowJump(!nearBottom);
    };
    el.addEventListener('scroll', handler);
    handler();
    return () => el.removeEventListener('scroll', handler);
  }, [messagesScrollRef, activeMessages.length]);

  function filterToFlags(f:'all'|'unread'|'starred'|'archived'){
    return f==='all' ? undefined :
      f==='unread' ? { unread: true } :
      f==='starred' ? { starred: true } :
      { archived: true };
  }

  const handleOpenThread = (id: string) => {
    openThread(id);
    setShowMobileList(false);
  };

  const handleBackToList = () => setShowMobileList(true);

  const handleSend = async () => {
    if (!activeThreadId || !draft.trim()) return;
    await sendMessage({ threadId: activeThreadId, kind: 'text', body: draft, quotedId: replyTo || undefined });
    setReplyTo(null);
    // Scroll to latest after send
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
  };

  function formatDateLabel(iso: string) {
    const d = new Date(iso);
    const today = new Date();
    const diff = Math.floor((today.setHours(0,0,0,0) - new Date(d).setHours(0,0,0,0)) / 86_400_000);
    const base = diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : d.toLocaleDateString();
    return hijriEnabled ? `${base} (Hijri)` : base;
  }

  const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

  return (
    <div className="w-full mx-auto min-h-[calc(100vh-120px)] p-0" role="main" aria-label="Messages">
      <div className="mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2"><MessageCircle className="h-8 w-8 text-primary" /> Messages</h1>
        <p className="text-muted-foreground">
          Communicate with {profile?.role === 'client' ? 'engineers' : 'clients'} and manage your projects
        </p>
      </div>

      {/* Panels container */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-4" aria-label="Messages layout">
        {/* Threads Panel */}
        <aside className={`${showMobileList ? 'block' : 'hidden lg:block'}`} aria-label="Threads">
          <Card className="h-[calc(100vh-200px)] flex flex-col shadow-[0_2px_2px_hsl(var(--foreground)/0.1),0_-2px_2px_hsl(var(--foreground)/0.06),2px_0_2px_hsl(var(--foreground)/0.06),-2px_0_2px_hsl(var(--foreground)/0.06)]">
            <div className="p-4 border-b space-y-3 threads-header">
              <Input placeholder="Search" className="bg-background" aria-label="Search threads" />
              <Tabs value={filter} onValueChange={(v)=>setFilter(v as any)}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="all" aria-label="All threads">All</TabsTrigger>
                  <TabsTrigger value="unread" aria-label="Unread threads">Unread</TabsTrigger>
                  <TabsTrigger value="starred" aria-label="Starred threads">Starred</TabsTrigger>
                  <TabsTrigger value="archived" aria-label="Archived threads">Archived</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div ref={listRef} className="flex-1 overflow-auto" role="listbox" aria-label="Threads list">
              {threads.length === 0 && (
                <div className="p-6 text-center text-muted-foreground">No conversations yet</div>
              )}
              {threads
                .slice()
                .sort((a,b)=> (b.pinned?1:0) - (a.pinned?1:0))
                .map(t=> (
                <button
                  key={t.id}
                  role="option"
                  className={`w-full text-left px-4 py-3 border-b hover:bg-accent/50 thread-row ${activeThreadId===t.id ? 'bg-accent' : ''}`}
                  onClick={()=>handleOpenThread(t.id)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">{(t.title?.[0]||'N').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{t.title}</span>
                        {t.jobCode && (<span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">{t.jobCode}</span>)}
                        {t.pinned && <span className="text-xs">📌</span>}
                        {t.starred && <span className="text-xs">⭐</span>}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">{t.lastSnippet}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground">now</span>
                      {(t.unreadCount||0) > 0 && <span className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] h-5 min-w-5 px-1">{t.unreadCount}</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </aside>

        {/* Conversation Panel */}
        <section className={`${showMobileList ? 'hidden lg:block' : 'block'} min-h-[50vh]`} aria-label="Conversation">
          <Card className="h-[calc(100vh-200px)] flex flex-col shadow-[0_2px_2px_hsl(var(--foreground)/0.1),0_-2px_2px_hsl(var(--foreground)/0.06),2px_0_2px_hsl(var(--foreground)/0.06),-2px_0_2px_hsl(var(--foreground)/0.06)]">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between messaging-header">
              <div className="flex items-center gap-3 min-w-0">
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={handleBackToList} aria-label="Back to threads">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{threads.find(t=>t.id===activeThreadId)?.title || 'Select a conversation'}</div>
                  {threads.find(t=>t.id===activeThreadId)?.jobCode && (
                    <div className="text-xs text-muted-foreground">{threads.find(t=>t.id===activeThreadId)?.jobCode} · online</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" aria-label="Call"><Phone className="h-4 w-4"/></Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Info/Files"
                  onClick={() => {
                    if (window.matchMedia('(min-width: 1024px)').matches) setShowInfo(s=>!s); else setShowMobileInfo(true);
                  }}
                >
                  <Info className="h-4 w-4"/>
                </Button>
                <Button variant="ghost" size="icon" aria-label="Search in chat"><Search className="h-4 w-4"/></Button>
                <Button variant="ghost" size="icon" aria-label="More"><MoreHorizontal className="h-4 w-4"/></Button>
                <Button variant="ghost" size="sm" onClick={()=>toggleHijri(!hijriEnabled)} aria-pressed={hijriEnabled} aria-label="Toggle Hijri dates">Hijri</Button>
              </div>
            </div>

            {/* Messages list */}
            <div ref={messagesScrollRef} className={`relative flex-1 overflow-auto px-4 py-3 space-y-2 ${isRTL ? 'rtl' : ''}`} aria-live="polite" aria-label="Messages list">
              {activeThreadId ? (
                <div>
                  {activeMessages.map((m, idx) => {
                    const prev = activeMessages[idx-1];
                    const showDate = !prev || new Date(prev.createdAt).toDateString() !== new Date(m.createdAt).toDateString();
                    return (
                      <div key={m.id} className="space-y-2">
                        {showDate && (
                          <div className="sticky top-0 z-10 flex justify-center py-1">
                            <span className="text-xs px-2 py-0.5 rounded bg-accent text-accent-foreground">{formatDateLabel(m.createdAt)}</span>
                          </div>
                        )}
                        <div className={`group max-w-[78%] rounded-2xl px-3 py-2 mb-2 ${m.authorId==='me' ? (isRTL ? 'mr-auto' : 'ml-auto') + ' bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                          {m.quotedId && (
                            <div className="mb-1 text-xs opacity-80 border-l-2 pl-2">
                              Replying to …
                            </div>
                          )}
                          {m.body}
                          {/* Reactions row */}
                          <div className="mt-1 flex flex-wrap gap-1">
                            {(m.reactions||[]).map((r,i)=> (
                              <span key={i} className="text-xs bg-accent/60 text-accent-foreground rounded px-1">{r.emoji}</span>
                            ))}
                          </div>
                          {/* Quick reactions */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex gap-1">
                            {['👍','❤️','🙂','👏','🔥','✅'].map(em=> (
                              <button key={em} className="text-sm" aria-label={`React ${em}`} onClick={()=> activeThreadId && addReaction(activeThreadId, m.id, em, 'me')}>{em}</button>
                            ))}
                            <button className="text-xs underline ml-2" onClick={()=> setReplyTo(m.id)}>Reply</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-full grid place-items-center text-muted-foreground" role="status">Select a conversation</div>
              )}

              {showJump && (
                <button
                  onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-3 py-1 shadow-md"
                  aria-label="Jump to latest"
                >
                  ↓ New
                </button>
              )}
            </div>

            {/* Composer */}
            <div className="p-3 border-t composer-container">
              {replyTo && (
                <div className="mb-2 flex items-center justify-between rounded-md bg-accent text-accent-foreground px-3 py-1 text-xs">
                  <span>Replying… <button className="underline ml-2" onClick={()=>setReplyTo(null)}>Cancel</button></span>
                </div>
              )}
              <div className="flex items-end gap-2">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" aria-label="Attach"><Paperclip className="h-4 w-4"/></Button>
                  <Button variant="ghost" size="icon" aria-label="Emoji"><Smile className="h-4 w-4"/></Button>
                  <Button variant="ghost" size="icon" aria-pressed={translationEnabled} onClick={()=>toggleTranslate(!translationEnabled)} aria-label="Translate EN↔AR"><Languages className="h-4 w-4"/></Button>
                  <Button variant="ghost" size="icon" aria-label="Voice record"><Mic className="h-4 w-4"/></Button>
                </div>
                <textarea
                  rows={Math.min(5, Math.max(1, Math.ceil(draft.length/60)))}
                  value={draft}
                  onChange={(e)=> activeThreadId && setDraft(activeThreadId, e.target.value)}
                  onKeyDown={(e)=>{
                    if (e.key==='Enter' && !e.shiftKey){ e.preventDefault(); handleSend(); }
                  }}
                  placeholder="Type a message"
                  className="flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button onClick={handleSend} disabled={!activeThreadId || !draft.trim()}>Send</Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Info drawer removed on desktop; use mobile sheet only */}
      </div>

      {/* Mobile Info Sheet */}
      <Sheet open={showMobileInfo} onOpenChange={setShowMobileInfo}>
        <SheetContent side="bottom" className="h-[80vh] p-0">
          <Card className="h-full rounded-none">
            <Tabs defaultValue="participants" className="w-full h-full flex flex-col">
              <TabsList className="p-2">
                <TabsTrigger value="participants">Participants</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="participants" className="flex-1 overflow-auto p-4">Coming soon</TabsContent>
              <TabsContent value="media" className="flex-1 overflow-auto p-4">Media grid</TabsContent>
              <TabsContent value="files" className="flex-1 overflow-auto p-4">Files list</TabsContent>
              <TabsContent value="links" className="flex-1 overflow-auto p-4">Links</TabsContent>
              <TabsContent value="starred" className="flex-1 overflow-auto p-4">Starred</TabsContent>
              <TabsContent value="settings" className="flex-1 overflow-auto p-4">Mute · Archive · Pin</TabsContent>
            </Tabs>
          </Card>
        </SheetContent>
      </Sheet>
    </div>
  );
}