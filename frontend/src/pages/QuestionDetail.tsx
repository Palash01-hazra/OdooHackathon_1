import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  Bold,
  Italic,
  Strikethrough,
  List,
  Link,
  Image,
  Smile,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:5000/api";

interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  votes: number;
  answers: Answer[];
  timestamp: string;
  isUpvoted: boolean;
  isDownvoted: boolean;
}

interface Answer {
  id: string;
  content: string;
  author: string;
  votes: number;
  timestamp: string;
  isAccepted: boolean;
  isUpvoted: boolean;
  isDownvoted: boolean;
}

export function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  useEffect(() => {
    if (id) {
      fetchQuestion(id);
    }
  }, [id]);

  const fetchQuestion = async (questionId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        setQuestion(data.data.question);
      } else {
        setError("Failed to fetch question");
      }
    } catch (err) {
      setError("Failed to fetch question");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (
    type: "up" | "down",
    isQuestion: boolean,
    itemId?: string
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote",
        variant: "destructive",
      });
      return;
    }

    try {
      const targetId = isQuestion ? id : itemId;
      const endpoint = isQuestion
        ? `${API_BASE_URL}/questions/${targetId}/vote`
        : `${API_BASE_URL}/answers/${targetId}/vote`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        const data = await response.json();

        if (isQuestion && question) {
          setQuestion({
            ...question,
            votes: data.data.votes,
            isUpvoted: data.data.isUpvoted,
            isDownvoted: data.data.isDownvoted,
          });
        } else if (!isQuestion && question) {
          setQuestion({
            ...question,
            answers: question.answers.map((answer) =>
              answer.id === itemId
                ? {
                    ...answer,
                    votes: data.data.votes,
                    isUpvoted: data.data.isUpvoted,
                    isDownvoted: data.data.isDownvoted,
                  }
                : answer
            ),
          });
        }

        toast({
          title: "Vote recorded",
          description: `Your ${type}vote has been recorded`,
        });
      } else {
        throw new Error("Failed to vote");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to record vote",
        variant: "destructive",
      });
    }
  };

  const submitAnswer = async () => {
    if (!newAnswer.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to post an answer",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmittingAnswer(true);
      const response = await fetch(`${API_BASE_URL}/answers/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newAnswer,
        }),
      });

      if (response.ok) {
        setNewAnswer("");
        if (id) {
          fetchQuestion(id);
        }
        toast({
          title: "Answer posted",
          description: "Your answer has been posted successfully",
        });
      } else {
        const errorData = await response.json();
        console.log("Answer post error:", errorData);

        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Please log in again to post an answer",
            variant: "destructive",
          });
          // Optionally redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          toast({
            title: "Error",
            description: errorData.message || "Failed to post answer",
            variant: "destructive",
          });
        }
        return;
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to post answer",
        variant: "destructive",
      });
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading question...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">
              {error || "Question not found"}
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Questions
          </Button>
        </div>

        {/* Question */}
        <Card className="bg-gradient-card border-border mb-8">
          <CardContent className="p-8">
            <div className="flex gap-6">
              {/* Vote Section */}
              <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                <Button
                  variant={question.isUpvoted ? "secondary" : "outline"}
                  size="icon"
                  onClick={() => handleVote("up", true)}
                >
                  <ChevronUp className="w-5 h-5" />
                </Button>

                <span
                  className={`text-lg font-bold ${
                    question.isUpvoted
                      ? "text-green-600"
                      : question.isDownvoted
                      ? "text-red-600"
                      : "text-foreground"
                  }`}
                >
                  {question.votes}
                </span>

                <Button
                  variant={question.isDownvoted ? "secondary" : "outline"}
                  size="icon"
                  onClick={() => handleVote("down", true)}
                >
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </div>

              {/* Content Section */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-4">
                  {question.title}
                </h1>

                <div className="text-foreground mb-6 whitespace-pre-wrap leading-relaxed">
                  {question.description}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {question.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-tag-bg text-tag-text hover:bg-tag-bg/80"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="text-sm text-muted-foreground">
                  Asked by{" "}
                  <span className="text-primary font-medium">
                    {question.author}
                  </span>{" "}
                  • {formatTimestamp(question.timestamp)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            {question.answers.length}{" "}
            {question.answers.length === 1 ? "Answer" : "Answers"}
          </h2>

          <div className="space-y-6">
            {question.answers.map((answer) => (
              <Card key={answer.id} className="bg-gradient-card border-border">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center space-y-1 min-w-[60px]">
                      <Button
                        variant={answer.isUpvoted ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => handleVote("up", false, answer.id)}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>

                      <span
                        className={`text-sm font-medium ${
                          answer.isUpvoted
                            ? "text-green-600"
                            : answer.isDownvoted
                            ? "text-red-600"
                            : "text-foreground"
                        }`}
                      >
                        {answer.votes}
                      </span>

                      <Button
                        variant={answer.isDownvoted ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => handleVote("down", false, answer.id)}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>

                      {answer.isAccepted && (
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-2">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                      )}
                    </div>

                    {/* Answer Content */}
                    <div className="flex-1">
                      <div className="text-foreground mb-4 whitespace-pre-wrap leading-relaxed">
                        {answer.content}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Answered by{" "}
                        <span className="text-primary font-medium">
                          {answer.author}
                        </span>{" "}
                        • {formatTimestamp(answer.timestamp)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Answer Form */}
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Your Answer
            </h3>

            <div className="space-y-4">
              {/* Formatting Toolbar */}
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Strikethrough className="w-4 h-4" />
                </Button>
                <div className="w-px h-4 bg-border mx-1"></div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Link className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Image className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>

              <Textarea
                placeholder="Write your answer here..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="min-h-[200px] bg-background border-border focus:border-primary"
              />

              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Please provide a detailed answer to help the questioner.
                </p>
                <Button
                  onClick={submitAnswer}
                  disabled={!newAnswer.trim() || submittingAnswer}
                  className="min-w-[120px]"
                >
                  {submittingAnswer ? "Posting..." : "Post Answer"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
