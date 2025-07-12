import { ChevronUp, ChevronDown, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface QuestionCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  votes: number;
  answers: number;
  isUpvoted?: boolean;
  isDownvoted?: boolean;
  timestamp: string;
  onClick?: () => void;
}

export function QuestionCard({
  title,
  description,
  tags,
  author,
  votes,
  answers,
  isUpvoted = false,
  isDownvoted = false,
  timestamp,
  onClick
}: QuestionCardProps) {
  return (
    <Card 
      className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center space-y-1 min-w-[60px]">
            <Button
              variant={isUpvoted ? "vote-active" : "vote"}
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation();
                // Handle upvote
              }}
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            
            <span className={`text-sm font-medium ${
              isUpvoted ? 'text-vote-active' : isDownvoted ? 'text-destructive' : 'text-foreground'
            }`}>
              {votes}
            </span>
            
            <Button
              variant={isDownvoted ? "vote-active" : "vote"}
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation();
                // Handle downvote
              }}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
            
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="bg-tag-bg text-tag-text hover:bg-tag-bg/80 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span>by <span className="text-primary font-medium">{author}</span></span>
                <span>{timestamp}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>{answers} answers</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}