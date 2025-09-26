import { useState } from "react";
import { useAuthStore } from "@/stores/auth";
import { getUserDisplayName, getUserInitials } from "@/lib/userUtils";
import { 
  MessageSquare,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Send,
  Smile,
  Image,
  FileText,
  Download,
  Building,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Pin,
  Archive,
  Trash2,
  Plus,
  Filter,
  Circle,
  Shield,
  Camera,
  Mic,
  StopCircle,
  MapPin,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
  File,
  PhoneCall,
  VideoIcon,
  Play,
  Pause,
  UserPlus,
  Settings,
  Info,
  Heart,
  ThumbsUp,
  Laugh,
  Frown,
  Angry,
  Bot
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useConversations, useMessages, type Message as HookMessage } from "@/hooks/useMessaging";
import { ConversationList } from "@/components/messaging/ConversationList";
import { AiMessagingContent } from "@/components/messaging/AiMessagingContent";
import { useEffect, useRef, useState as useStateAlias } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
  type: "text" | "file" | "image" | "audio" | "system";
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isRead: boolean;
  reactions?: { emoji: string; count: number; users: string[] }[];
}

interface Conversation {
  id: string;
  name: string;
  type: "project" | "direct" | "group";
  participants: Participant[];
  lastMessage: Message;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  projectId?: string;
  projectName?: string;
  avatar?: string;
  status: "online" | "offline" | "away";
}

interface Participant {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  company?: string;
}

// NOTE: Demo data removed. Data is now provided by Supabase hooks.

const emojiData = {
  faces: ["😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊","😋","😎","😍","😘","🥰","😗","😙","😚","🙂","🤗","🤩","🤔","🤨","😐","😑","😶","🙄","😏","😣","😥","😮","🤐","😯","😪","😫","😴","😌","😛","😜","😝","🤤","😒","😓","😔","😕","🙃","🤑","😲","☹️","🙁","😖","😞","😟","😤","😢","😭","😦","😧","😨","😩","🤯","😬","😰","😱","🥵","🥶","😳","🤪","😵","😡","😠","🤬","😷","🤒","🤕","🤢","🤮","🤧","🥴","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖"],
  animals: ["😺","😸","😹","😻","😼","😽","🙀","😿","😾","🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐒","🐔","🐧","🐦","🐤","🐣","🐥","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🐛","🦋","🐌","🐞","🐜","🦟","🦗","🕷️","🕸️","🦂","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦞","🦀","🐡","🐠","🐟","🐬","🐳","🐋","🦈","🐊","🐅","🐆","🦓","🦍","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🦙","🐐","🦌","🐕","🐩","🦮","🐕‍🦺","🐈","🐓","🦃","🦚","🦜","🦢","🦩","🕊️","🐇","🐁","🐀","🐿️","🦔"],
  gestures: ["👍","👎","👌","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","✋","🤚","🖐️","🖖","👋","🤝","👏","🙌","👐","🤲","🤜","🤛","✊","👊"],
  hearts: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝","💟"],
  symbols: ["☮️","✝️","☪️","🕉️","☸️","✡️","🔯","🕎","☯️","☦️","🛐","⛎","♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","🆔","⚛️","🉑","☢️","☣️","📴","📳","🈶","🈚","🈸","🈺","🈷️","✴️","🆚","💮","🉐","㊙️","㊗️","🈴","🈵","🈹","🈲","🅰️","🅱️","🆎","🆑","🅾️","🆘","❌","⭕","🛑","⛔","📛","🚫","💯","💢","♨️","🚷","🚯","🚳","🚱","🔞","📵","🚭","❗","❕","❓","❔","‼️","⁉️","🔅","🔆","〽️","⚠️","🚸","🔱","⚜️","🔰","♻️","✅","🈯","💹","❇️","✳️","❎","🌐","💠","Ⓜ️","🌀","💤","🏧","🚾","♿","🅿️","🈳","🈂️","🛂","🛃","🛄","🛅","🚹","🚺","🚼","🚻","🚮","🎦","📶","🈁","🔣","🔤","🔡","🔠","🆖","🆗","🆙","🆒","🆕","🆓"],
  numbers: ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"]
};

const emojiCategories = [
  { id: "all", name: "All", icon: "😀" },
  { id: "faces", name: "Faces", icon: "😀" },
  { id: "animals", name: "Animals", icon: "🐶" },
  { id: "gestures", name: "Gestures", icon: "👍" },
  { id: "hearts", name: "Hearts", icon: "❤️" },
  { id: "symbols", name: "Symbols", icon: "☮️" },
  { id: "numbers", name: "Numbers", icon: "0️⃣" }
];

export function MessagesContent() {
  const { profile, user } = useAuthStore();
  
  // Debug: Log user data
  console.log('MessagesContent - User from auth store:', user);
  console.log('MessagesContent - Profile from auth store:', profile);

  
  // Get current user data
  const currentUserName = getUserDisplayName(profile);
  const currentUserInitials = getUserInitials(profile);
  
  const { conversations, isLoading: convLoading, refetch: refetchConversations } = useConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { messages, isLoading: msgLoading, sendMessage, refetch: refetchMessages } = useMessages(selectedConversationId);
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  // Debug: Log messages and conversation state
  console.log('MessagesContent - Selected conversation ID:', selectedConversationId);
  console.log('MessagesContent - Messages:', messages);
  console.log('MessagesContent - Messages loading:', msgLoading);

  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAllEmojis, setShowAllEmojis] = useState(false);
  const [emojiSearchQuery, setEmojiSearchQuery] = useState("");
  const [emojiCategory, setEmojiCategory] = useState("all");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showVoiceCall, setShowVoiceCall] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);

  // Get filtered emojis based on search and category
  const getFilteredEmojis = () => {
    let emojis = [];
    
    if (emojiCategory === "all") {
      emojis = Object.values(emojiData).flat();
    } else {
      emojis = emojiData[emojiCategory as keyof typeof emojiData] || [];
    }
    
    if (emojiSearchQuery) {
      // Simple search - you could enhance this with more sophisticated matching
      emojis = emojis.filter(emoji => 
        emoji.includes(emojiSearchQuery) || 
        emojiSearchQuery.toLowerCase().includes(emoji)
      );
    }
    
    return emojis;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setIsSending(true);
    try {
      await sendMessage(newMessage);
      setNewMessage("");
      // Force refresh messages after sending
      if (refetchMessages) {
        setTimeout(() => {
          refetchMessages();
        }, 100);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleEmojiPickerClose = (open: boolean) => {
    setShowEmojiPicker(open);
    if (!open) {
      // Reset search and category when closing
      setEmojiSearchQuery("");
      setEmojiCategory("all");
      setShowAllEmojis(false);
    }
  };

  const uploadAndSendFile = async (file: File) => {
    if (!selectedConversationId || !file) return;
    setIsSending(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id;
      if (!userId) return;

      const path = `${selectedConversationId}/${userId}-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('messages').upload(path, file, { upsert: false });
      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage.from('messages').getPublicUrl(path);

      const isImage = file.type?.startsWith('image/');
      const isAudio = file.type?.startsWith('audio/');
      const { error: insertError } = await supabase.from('messages').insert([
        {
          conversation_id: selectedConversationId,
          sender_id: userId,
          content: file.name,
          message_type: isImage ? 'image' : isAudio ? 'audio' : 'file',
          file_url: publicUrl.publicUrl
        }
      ]);
      if (insertError) throw insertError;
    } catch (e) {
      console.error('File send failed', e);
    } finally {
      setIsSending(false);
    }
  };

  // Voice recording controls
  const startVoiceRecording = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks: BlobPart[] = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          const file = Object.assign(blob, { name: `voice-${Date.now()}.webm` }) as File;
          await uploadAndSendFile(file);
        } catch (err) {
          console.error('Failed to save voice message', err);
        } finally {
          // stop all tracks
          stream.getTracks().forEach(t => t.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone permission denied or unavailable', err);
    }
  };

  const stopVoiceRecording = () => {
    if (!isRecording) return;
    if (recordingIntervalRef.current) {
      window.clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  const createNewConversation = async (name: string, type: "direct" | "group" | "project"): Promise<void> => {
    try {
      // Get user from auth store instead of Supabase auth (since we're using mock auth)
      const userId = user?.id;
      if (!userId) {
        console.error('No user ID found in auth store');
        return;
      }

      console.log('Creating conversation for user:', userId);

      // For demo purposes, create a conversation with the current user as both client and engineer
      // In a real app, you'd select participants or create based on job assignments
      const { data, error } = await supabase
        .from('conversations')
        .insert([
          {
            client_id: userId,
            engineer_id: userId, // For demo, same user
            // Note: conversations table doesn't have name/type columns, 
            // these would be stored in a separate table or as metadata
          }
        ])
        .select();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Conversation created successfully:', data);
      
      // Force refresh conversations
      if (refetchConversations) {
        await refetchConversations();
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw error;
    }
  };

  // Voice/Video call functions
  const startCall = (type: "voice" | "video") => {
    if (type === "voice") {
      setShowVoiceCall(true);
    } else {
      setShowVideoCall(true);
    }
  };

  const endCall = () => {
    setShowVoiceCall(false);
    setShowVideoCall(false);
  };

  // Message reactions
  const addReaction = (messageId: string, emoji: string) => {
    // This would update the database in a real implementation
    console.log(`Adding reaction ${emoji} to message ${messageId}`);
  };

  // Conversation management
  const handleConversationAction = async (action: "pin" | "archive" | "delete") => {
    if (!selectedConversationId) return;
    
    try {
      if (action === "delete") {
        // Delete the conversation from the database
        const { error } = await supabase
          .from('conversations')
          .delete()
          .eq('id', selectedConversationId);

        if (error) {
          console.error('Error deleting conversation:', error);
          return;
        }

        // Clear the selected conversation
        setSelectedConversationId(null);
        
        // Refresh the conversations list
        if (refetchConversations) {
          await refetchConversations();
        }
        
        console.log('Conversation deleted successfully');
        // You could add a toast notification here if you have a toast system
        // toast.success('Conversation deleted successfully');
      } else {
        // For pin and archive, just log for now
        console.log(`Conversation action: ${action}`);
      }
    } catch (error) {
      console.error('Failed to perform conversation action:', error);
    }
  };

  // File download
  const downloadFile = (fileName: string, fileUrl?: string) => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.click();
    }
  };

  useEffect(() => {
    const markRead = async () => {
      if (!selectedConversationId) return;
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id;
      if (!userId) return;
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', selectedConversationId)
        .neq('sender_id', userId)
        .is('read_at', null);
    };
    markRead();
  }, [selectedConversationId]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString("en-SA");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-success";
      case "away": return "bg-warning";
      case "offline": return "bg-muted";
      default: return "bg-muted";
    }
  };

  // Auto-select the first conversation when available
  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);


  return (
    <>

      {/* Voice Call Modal */}
      {showVoiceCall && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="mb-6">
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {selectedConversation?.job?.title ? (
                    <Building className="w-10 h-10" />
                  ) : selectedConversation?.type === "group" ? (
                    <Users className="w-10 h-10" />
                  ) : (
                    (selectedConversation?.client_profile?.first_name || selectedConversation?.engineer_profile?.first_name || '?').charAt(0)
                  )}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-medium">
                {selectedConversation?.job?.title || `${selectedConversation?.client_profile?.first_name ?? ''} ${selectedConversation?.client_profile?.last_name ?? ''}`.trim() || `${selectedConversation?.engineer_profile?.first_name ?? ''} ${selectedConversation?.engineer_profile?.last_name ?? ''}`.trim()}
              </h3>
              <p className="text-sm text-muted-foreground">Voice call in progress...</p>
            </div>
            <div className="flex justify-center gap-4">
              <Button 
                size="lg"
                className="bg-destructive hover:bg-destructive/90 rounded-full"
                onClick={endCall}
              >
                <PhoneCall className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {showVideoCall && (
        <div className="fixed inset-0 bg-background/45 flex items-center justify-center z-50">
          <div className="bg-muted rounded-lg overflow-hidden max-w-4xl w-full mx-4 h-[600px] relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
              <Button size="lg" variant="outline" className="rounded-full bg-background/20 border-border/30">
                <Mic className="w-6 h-6" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full bg-background/20 border-border/30">
                <VideoIcon className="w-6 h-6" />
              </Button>
              <Button 
                size="lg"
                className="bg-destructive hover:bg-destructive/90 rounded-full"
                onClick={endCall}
              >
                <PhoneCall className="w-6 h-6" />
              </Button>
            </div>
            <div className="absolute top-4 right-4">
              <div className="bg-background/50 rounded-lg p-2 text-foreground">
                <p className="text-sm">Video call with {selectedConversation?.job?.title || `${selectedConversation?.client_profile?.first_name ?? ''} ${selectedConversation?.client_profile?.last_name ?? ''}`.trim() || `${selectedConversation?.engineer_profile?.first_name ?? ''} ${selectedConversation?.engineer_profile?.last_name ?? ''}`.trim()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex h-screen overflow-hidden">
        {/* AI Mode Toggle */}
        {!isAiMode && (
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAiMode(true)}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Bot className="w-4 h-4 mr-2" />
              AI Assistant
            </Button>
          </div>
        )}

        {/* Conversations Sidebar */}
        {!isAiMode && (
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
            onNewConversation={createNewConversation}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            isLoading={convLoading}
          />
        )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col border-l border-sidebar-border">
        {/* Chat Header */}
         <div className="p-6 border-b border-sidebar-border bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedConversation && (
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {selectedConversation.job?.title ? (
                      <Building className="w-5 h-5" />
                    ) : (
                      (selectedConversation.client_profile?.first_name || selectedConversation.engineer_profile?.first_name || '?')
                        .charAt(0)
                    )}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <h3 className="font-medium">{selectedConversation ? (selectedConversation.job?.title || `${selectedConversation.client_profile?.first_name ?? ''} ${selectedConversation.client_profile?.last_name ?? ''}`.trim() || `${selectedConversation.engineer_profile?.first_name ?? ''} ${selectedConversation.engineer_profile?.last_name ?? ''}`.trim()) : ''}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {selectedConversation && (
                    <Circle className={`w-2 h-2 ${getStatusColor('online')}`} />
                  )}
                  <span>
                    {selectedConversation?.job?.title ? 'Project conversation' : 'Direct conversation'}
                  </span>
                  {selectedConversation?.job?.title && (
                    <>
                      <span>•</span>
                      <span>{selectedConversation.job.title}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => startCall("voice")}>
                <Phone className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => startCall("video")}>
                <Video className="w-4 h-4" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48" align="end">
                  <div className="space-y-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => handleConversationAction("pin")}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Pin Conversation
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => handleConversationAction("archive")}
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </Button>
                    <Separator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full justify-start text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this conversation? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => handleConversationAction("delete")}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 bg-muted/30">
          <div className="space-y-4 max-w-4xl mx-auto">
            {(!selectedConversationId && !convLoading) && (
              <div className="text-center text-muted-foreground py-10">Select a conversation to start messaging.</div>
            )}
            {(msgLoading) && (
              <div className="text-center text-muted-foreground py-10">Loading messages...</div>
            )}
            {selectedConversationId && !msgLoading && messages.length === 0 && (
              <div className="text-center text-muted-foreground py-10">
                No messages yet. Start the conversation!
                <br />
                <span className="text-xs">Debug: Conversation ID: {selectedConversationId}</span>
              </div>
            )}
            {messages.map((message: HookMessage) => {
              const isCurrentUser = message.sender_id === user?.id;
              const isSystem = message.message_type === "system";
              const originalFileName = message.fileName ?? message.file_name ?? message.file_url?.split('/')?.pop() ?? '';
              const displayFileName = originalFileName || 'Attachment';
              const lowerFileName = originalFileName.toLowerCase();
              const fileSize = message.fileSize ?? (typeof message.file_size === 'number' ? message.file_size : undefined);
              const fileUrl = message.file_url ?? undefined;

              if (isSystem) {
                return (
                  <div key={message.id} className="flex justify-center">
                    <div className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
                      {message.content}
                    </div>
                  </div>
                );
              }

              return (
                <div key={message.id} className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  {!isCurrentUser && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-muted-foreground text-muted-foreground text-xs">
                        {(message.sender_profile?.first_name || '?').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`max-w-lg ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
                    {!isCurrentUser && (
                      <div className="text-sm font-medium mb-1">
                        {`${message.sender_profile?.first_name ?? ''} ${message.sender_profile?.last_name ?? ''}`.trim()}
                      </div>
                    )}

                    <div className={`rounded-lg px-4 py-2 ${
                      isCurrentUser 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-background border border-sidebar-border'
                    }`}>
                      {message.message_type === "file" ? (
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded ${isCurrentUser ? 'bg-primary/20' : 'bg-muted'}`}>
                            {lowerFileName.endsWith('.dwg') ? (
                              <FileText className="w-5 h-5" />
                            ) : lowerFileName.endsWith('.pdf') ? (
                              <File className="w-5 h-5" />
                            ) : lowerFileName.endsWith('.mp3') || lowerFileName.endsWith('.webm') ? (
                              <Mic className="w-5 h-5" />
                            ) : (
                              <Paperclip className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{displayFileName}</p>
                            {typeof fileSize === 'number' && (
                              <p className={`text-xs ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                {formatFileSize(fileSize)}
                              </p>
                            )}
                          </div>
                          {fileUrl && (
                            <Button 
                              size="sm" 
                              variant={isCurrentUser ? "ghost" : "outline"}
                              onClick={() => downloadFile(displayFileName, fileUrl)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ) : message.message_type === "image" ? (
                        <div className="flex flex-col gap-2">
                          <img
                            src={message.file_url}
                            alt={message.content || 'Image'}
                            className="max-h-64 rounded border border-sidebar-border object-contain bg-background"
                          />
                          <a
                            href={message.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className={`text-xs underline ${isCurrentUser ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}
                          >
                            Open full size
                          </a>
                        </div>
                      ) : message.message_type === "audio" ? (
                        <div className="flex items-center gap-3 max-w-sm">
                          <audio controls src={message.file_url} className="w-full" />
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      )}

                      {/* Message Reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {message.reactions.map((reaction, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant="secondary"
                              className="h-6 px-2 text-xs"
                              onClick={() => addReaction(message.id, reaction.emoji)}
                            >
                              {reaction.emoji} {reaction.count}
                            </Button>
                          ))}
                        </div>
                      )}

                      {/* Quick reaction buttons for non-current user messages */}
                      {!isCurrentUser && message.message_type !== "system" && (
                        <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 w-6 p-0 text-xs"
                            onClick={() => addReaction(message.id, "👍")}
                          >
                            👍
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 w-6 p-0 text-xs"
                            onClick={() => addReaction(message.id, "❤️")}
                          >
                            ❤️
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 w-6 p-0 text-xs"
                            onClick={() => addReaction(message.id, "😀")}
                          >
                            😀
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className={`text-xs text-muted-foreground mt-1 ${isCurrentUser ? 'text-right' : ''}`}>
                      {formatTime(message.created_at)}
                      {isCurrentUser && <CheckCircle className="w-3 h-3 inline ml-1" />}
                    </div>
                  </div>

                  {isCurrentUser && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">NB</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="sticky bottom-0 p-4 bg-background border-t border-sidebar-border">
          <div className="flex items-end gap-3 w-full max-w-full mx-auto">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      uploadAndSendFile(f);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      uploadAndSendFile(f);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      uploadAndSendFile(f);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isSending} aria-label="Attach file">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => imageInputRef.current?.click()} disabled={isSending} aria-label="Attach image">
                  <Image className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => cameraInputRef.current?.click()} disabled={isSending} aria-label="Open camera">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div className="relative">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="resize-none pr-20"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <Popover open={showEmojiPicker} onOpenChange={handleEmojiPickerClose}>
                    <PopoverTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <Smile className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-3" align="end">
                      {/* Search Bar */}
                      <div className="relative mb-3">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                        <Input
                          placeholder="Search emojis..."
                          value={emojiSearchQuery}
                          onChange={(e) => setEmojiSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      
                      {/* Category Filter */}
                      <div className="flex gap-1 mb-3 pb-2.5 overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-card hover:scrollbar-thumb-primary/80">
                        {emojiCategories.map((category) => (
                          <Button
                            key={category.id}
                            variant={emojiCategory === category.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setEmojiCategory(category.id)}
                            className="flex-shrink-0 h-8 px-2"
                          >
                            <span className="mr-1">{category.icon}</span>
                            <span className="text-xs">{category.name}</span>
                          </Button>
                        ))}
                      </div>
                      
                      {/* Emojis Grid */}
                      <div className="grid grid-cols-8 gap-1 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-card hover:scrollbar-thumb-primary/80">
                        {getFilteredEmojis().slice(0, showAllEmojis ? undefined : 64).map((emoji) => (
                          <Button
                            key={emoji}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-muted"
                            onClick={() => {
                              setNewMessage((prev) => prev + emoji);
                              setShowEmojiPicker(false);
                            }}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                      
                      {/* View More/Less Button */}
                      {getFilteredEmojis().length > 64 && (
                        <div className="mt-3 pt-3 border-t border-sidebar-border">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAllEmojis(!showAllEmojis)}
                            className="w-full"
                          >
                            {showAllEmojis ? 'View Less' : 'View More'}
                          </Button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                  {!isRecording ? (
                    <Button size="sm" variant="ghost" onClick={startVoiceRecording} aria-label="Start recording">
                      <Mic className="w-4 h-4" />
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-destructive font-medium">
                        {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                      </span>
                      <Button size="sm" variant="ghost" onClick={stopVoiceRecording} aria-label="Stop recording">
                        <StopCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90" 
              disabled={!newMessage.trim() || !selectedConversationId || isSending}
              onClick={handleSendMessage}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Participants Sidebar (Optional) */}
      <div className="w-64 bg-background border-l border-sidebar-border p-6 hidden xl:block">
        <h3 className="font-medium mb-4">
          {selectedConversation?.job?.title ? "Project Team" : "Participants"}
        </h3>
        <div className="space-y-3">
          {selectedConversation && (
            <div className="text-sm text-muted-foreground">Participants will appear here when implemented.</div>
          )}
        </div>

        {selectedConversation?.job?.title && (
          <>
            <Separator className="my-4" />
            <div>
              <h4 className="font-medium mb-3">Project Info</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedConversation.job.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Active Project</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span>SCE Compliant</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* AI Messaging Mode */}
      {isAiMode && (
        <AiMessagingContent 
          onBack={() => setIsAiMode(false)}
        />
      )}
    </div>
    </>
  );
}










