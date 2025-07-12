import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { QuestionCard } from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";

// Mock data
const mockQuestions = [
    {
        id: "1",
        title: "How to implement authentication in React with TypeScript?",
        description: "I'm building a React application with TypeScript and need to implement user authentication. What's the best approach for handling login, logout, and protected routes?",
        tags: ["react", "typescript", "authentication", "frontend"],
        author: "jane_doe",
        votes: 15,
        answers: 3,
        timestamp: "2 hours ago",
        isUpvoted: false,
        isDownvoted: false
    },
    {
        id: "2",
        title: "Best practices for state management in large React applications",
        description: "I'm working on a large-scale React application and struggling with state management. Should I use Redux, Zustand, or stick with React Context?",
        tags: ["react", "state-management", "redux", "performance"],
        author: "dev_master",
        votes: 42,
        answers: 8,
        timestamp: "5 hours ago",
        isUpvoted: true,
        isDownvoted: false
    },
    {
        id: "3",
        title: "Why is my CSS grid not working properly on mobile devices?",
        description: "I've created a responsive layout using CSS Grid, but it's not displaying correctly on mobile devices. The items are overlapping and the grid breaks.",
        tags: ["css", "grid", "responsive", "mobile"],
        author: "css_newbie",
        votes: 8,
        answers: 0,
        timestamp: "1 day ago",
        isUpvoted: false,
        isDownvoted: false
    },
    {
        id: "4",
        title: "How to optimize database queries in Node.js with Prisma?",
        description: "My application is experiencing slow database queries. I'm using Prisma ORM with PostgreSQL. What are the best practices for query optimization?",
        tags: ["nodejs", "prisma", "database", "optimization", "postgresql"],
        author: "backend_guru",
        votes: 23,
        answers: 5,
        timestamp: "3 days ago",
        isUpvoted: false,
        isDownvoted: false
    }
];

export function Home() {
    const [activeFilter, setActiveFilter] = useState("newest");
    const navigate = useNavigate();

    const handleQuestionClick = (questionId: string) => {
        navigate(`/question/${questionId}`);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Ask Question Button */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Questions</h1>
                        <p className="text-muted-foreground">Find answers to your technical questions</p>
                    </div>

                    <Button
                        size="lg"
                        onClick={() => navigate("/ask")}
                        className="shadow-button"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Ask Question
                    </Button>
                </div>

                {/* Filters */}
                <FilterBar
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />

                {/* Questions List */}
                <div className="space-y-4 mb-8">
                    {mockQuestions.map((question) => (
                        <QuestionCard
                            key={question.id}
                            {...question}
                            onClick={() => handleQuestionClick(question.id)}
                        />
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                        Previous
                    </Button>
                    <Button variant="default" size="sm">
                        1
                    </Button>
                    <Button variant="outline" size="sm">
                        2
                    </Button>
                    <Button variant="outline" size="sm">
                        3
                    </Button>
                    <Button variant="outline" size="sm">
                        Next
                    </Button>
                </div>
            </main>
        </div>
    );
}