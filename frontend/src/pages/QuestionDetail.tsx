import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown, ChevronLeft, Bold, Italic, Strikethrough, List, Link, Image, Smile } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// Mock question data
const mockQuestion = {
    id: "1",
    title: "How to implement authentication in React with TypeScript?",
    description: "I'm building a React application with TypeScript and need to implement user authentication. What's the best approach for handling login, logout, and protected routes?\n\nI've looked into several options like Firebase Auth, Auth0, and building a custom solution, but I'm not sure which one would be best for my use case.\n\nHere's what I'm currently working with:\n\n```typescript\nconst App = () => {\n  return (\n    <Router>\n      <Routes>\n        <Route path=\"/login\" element={<Login />} />\n        <Route path=\"/dashboard\" element={<Dashboard />} />\n      </Routes>\n    </Router>\n  );\n};\n```\n\nAny suggestions would be greatly appreciated!",
    tags: ["react", "typescript", "authentication", "frontend"],
    author: "jane_doe",
    votes: 15,
    answers: 3,
    timestamp: "2 hours ago",
    isUpvoted: false,
    isDownvoted: false
};

const mockAnswers = [
    {
        id: "1",
        content: "For React with TypeScript authentication, I'd recommend using a combination of React Context and JWT tokens. Here's a basic implementation:\n\n```typescript\ninterface AuthContextType {\n  user: User | null;\n  login: (email: string, password: string) => Promise<void>;\n  logout: () => void;\n  isLoading: boolean;\n}\n\nconst AuthContext = createContext<AuthContextType | undefined>(undefined);\n```\n\nThis approach gives you full control over the authentication flow while maintaining type safety.",
        author: "auth_expert",
        votes: 8,
        timestamp: "1 hour ago",
        isUpvoted: false,
        isDownvoted: false
    },
    {
        id: "2",
        content: "I'd suggest using NextAuth.js if you're open to switching to Next.js, or Clerk for a ready-made solution. Both provide excellent TypeScript support and handle all the edge cases for you.\n\nIf you want to stick with your current setup, Firebase Auth is probably your best bet - it's well-documented and has excellent TypeScript definitions.",
        author: "dev_master",
        votes: 12,
        timestamp: "45 minutes ago",
        isUpvoted: true,
        isDownvoted: false
    }
];

export function QuestionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newAnswer, setNewAnswer] = useState("");
    const [questionVotes, setQuestionVotes] = useState(mockQuestion.votes);
    const [questionUpvoted, setQuestionUpvoted] = useState(false);
    const [questionDownvoted, setQuestionDownvoted] = useState(false);

    const handleVote = (type: 'up' | 'down', isQuestion: boolean, itemId?: string) => {
        if (isQuestion) {
            if (type === 'up') {
                if (questionUpvoted) {
                    setQuestionVotes(prev => prev - 1);
                    setQuestionUpvoted(false);
                } else {
                    setQuestionVotes(prev => prev + (questionDownvoted ? 2 : 1));
                    setQuestionUpvoted(true);
                    setQuestionDownvoted(false);
                }
            } else {
                if (questionDownvoted) {
                    setQuestionVotes(prev => prev + 1);
                    setQuestionDownvoted(false);
                } else {
                    setQuestionVotes(prev => prev - (questionUpvoted ? 2 : 1));
                    setQuestionDownvoted(true);
                    setQuestionUpvoted(false);
                }
            }
        }
        // Handle answer voting similarly
    };

    const handleSubmitAnswer = (e: React.FormEvent) => {
        e.preventDefault();
        if (newAnswer.trim()) {
            // Submit answer logic here
            console.log("New answer:", newAnswer);
            setNewAnswer("");
        }
    };

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
                                    variant={questionUpvoted ? "vote-active" : "vote"}
                                    size="icon"
                                    onClick={() => handleVote('up', true)}
                                >
                                    <ChevronUp className="w-5 h-5" />
                                </Button>

                                <span className={`text-lg font-bold ${questionUpvoted ? 'text-vote-active' : questionDownvoted ? 'text-destructive' : 'text-foreground'
                                    }`}>
                                    {questionVotes}
                                </span>

                                <Button
                                    variant={questionDownvoted ? "vote-active" : "vote"}
                                    size="icon"
                                    onClick={() => handleVote('down', true)}
                                >
                                    <ChevronDown className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-foreground mb-4">
                                    {mockQuestion.title}
                                </h1>

                                <div className="prose prose-invert max-w-none mb-6">
                                    <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                                        {mockQuestion.description}
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {mockQuestion.tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="bg-tag-bg text-tag-text"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>

                                {/* Meta */}
                                <div className="text-sm text-muted-foreground">
                                    Asked by <span className="text-primary font-medium">{mockQuestion.author}</span> • {mockQuestion.timestamp}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Answers Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                        {mockAnswers.length} {mockAnswers.length === 1 ? 'Answer' : 'Answers'}
                    </h2>

                    <div className="space-y-6">
                        {mockAnswers.map((answer) => (
                            <Card key={answer.id} className="bg-card border-border">
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        {/* Vote Section */}
                                        <div className="flex flex-col items-center space-y-1 min-w-[60px]">
                                            <Button
                                                variant={answer.isUpvoted ? "vote-active" : "vote"}
                                                size="icon-sm"
                                                onClick={() => handleVote('up', false, answer.id)}
                                            >
                                                <ChevronUp className="w-4 h-4" />
                                            </Button>

                                            <span className={`text-sm font-medium ${answer.isUpvoted ? 'text-vote-active' : answer.isDownvoted ? 'text-destructive' : 'text-foreground'
                                                }`}>
                                                {answer.votes}
                                            </span>

                                            <Button
                                                variant={answer.isDownvoted ? "vote-active" : "vote"}
                                                size="icon-sm"
                                                onClick={() => handleVote('down', false, answer.id)}
                                            >
                                                <ChevronDown className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="prose prose-invert max-w-none mb-4">
                                                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                                                    {answer.content}
                                                </div>
                                            </div>

                                            <div className="text-sm text-muted-foreground">
                                                Answered by <span className="text-primary font-medium">{answer.author}</span> • {answer.timestamp}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Answer Form */}
                <Card className="bg-card border-border">
                    <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-foreground mb-4">Your Answer</h3>

                        <form onSubmit={handleSubmitAnswer} className="space-y-4">
                            {/* Rich Text Toolbar */}
                            <div className="flex flex-wrap items-center gap-1 p-2 border border-border rounded-t-lg bg-muted/30">
                                <Button variant="ghost" size="icon-sm" type="button">
                                    <Bold className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon-sm" type="button">
                                    <Italic className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon-sm" type="button">
                                    <Strikethrough className="w-4 h-4" />
                                </Button>
                                <div className="w-px h-6 bg-border mx-1" />
                                <Button variant="ghost" size="icon-sm" type="button">
                                    <List className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon-sm" type="button">
                                    <Link className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon-sm" type="button">
                                    <Image className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon-sm" type="button">
                                    <Smile className="w-4 h-4" />
                                </Button>
                            </div>

                            <Textarea
                                placeholder="Write your answer here..."
                                value={newAnswer}
                                onChange={(e) => setNewAnswer(e.target.value)}
                                className="min-h-[150px] rounded-t-none border-t-0"
                                required
                            />

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={!newAnswer.trim()}
                                    className="shadow-button"
                                >
                                    Post Answer
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}