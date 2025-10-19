import { cn } from "@/pages/1-HomePage/others/lib/utils";
import { useState } from "react";
import { Heart, User, Bold, Italic, Underline, Strikethrough, Smile, ArrowUp } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  likes: number;
}

interface CommentReplyProps {
  comments?: Comment[];
  className?: string;
}

export const CommentReply = ({ 
  comments = [
    {
      id: "1",
      author: "Yassine Zanina",
      content: "I've been using this product for a few days now and I'm really impressed! The interface is intuitive and easy to use, and the features are exactly what I need to streamline my workflow.",
      timestamp: "Wednesday, March 13th at 2:45pm",
      likes: 14
    },
    {
      id: "2",
      author: "Sarah Johnson",
      content: "This course exceeded my expectations. The instructor explains complex concepts in a way that's easy to understand. Highly recommended for anyone looking to improve their skills.",
      timestamp: "Tuesday, March 12th at 4:30pm",
      likes: 8
    },
    {
      id: "3",
      author: "Ahmed Al-Rashid",
      content: "Excellent content and delivery. The practical examples really help solidify the learning. I've already started applying these techniques in my projects.",
      timestamp: "Monday, March 11th at 10:15am",
      likes: 12
    },
    {
      id: "4",
      author: "Maria Garcia",
      content: "The course structure is well-organized and the pace is perfect. I appreciate the real-world examples and case studies provided throughout the lessons.",
      timestamp: "Sunday, March 10th at 7:20pm",
      likes: 6
    },
    {
      id: "5",
      author: "David Chen",
      content: "Great course! The instructor's teaching style is engaging and the material is comprehensive. I've learned a lot and feel more confident in my abilities now.",
      timestamp: "Saturday, March 9th at 3:45pm",
      likes: 9
    }
  ],
  className 
}: CommentReplyProps) => {
  const [likeCount, setLikeCount] = useState(comments[0]?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className={cn("bg-card border border-border/50 rounded-lg p-4 space-y-4", className)}>
      <h3 className="text-base font-bold tracking-tight">Comments</h3>
      
      <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2 comment-reply-scroll">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleLike}
            className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-colors",
                isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )} 
            />
            <span className="text-sm">{likeCount}</span>
          </button>
        </div>

        {comments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-muted rounded-full p-2 flex-shrink-0">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border/40 pt-4">
        <div className="space-y-3">
          <textarea 
            placeholder="Add a comment..."
            className="w-full min-h-[80px] p-3 border border-border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button 
                type="button"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button 
                type="button"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </button>
              <button 
                type="button"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                title="Underline"
              >
                <Underline className="h-4 w-4" />
              </button>
              <button 
                type="button"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                title="Strikethrough"
              >
                <Strikethrough className="h-4 w-4" />
              </button>
              <button 
                type="button"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                title="Emoji"
              >
                <Smile className="h-4 w-4" />
              </button>
            </div>
            <button 
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              title="Send"
            >
              <ArrowUp className="h-4 w-4" />
              <span className="text-sm">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
