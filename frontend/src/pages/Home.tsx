import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { QuestionCard } from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";

interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  votes: number;
  answers: number;
  timestamp: string;
  isUpvoted: boolean;
  isDownvoted: boolean;
}

export function Home() {
  const [activeFilter, setActiveFilter] = useState("newest");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, [activeFilter, searchParams]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append("sort", activeFilter);

      // Add search query if present
      const searchQuery = searchParams.get("search");
      if (searchQuery) {
        queryParams.append("search", searchQuery);
      }

      const response = await fetch(
        `http://localhost:5000/api/questions?${queryParams.toString()}`,
        {
          headers,
        }
      );

      const data = await response.json();

      if (data.success) {
        setQuestions(data.data.questions || []);
      } else {
        setError(data.message || "Failed to fetch questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Failed to fetch questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionClick = (questionId: string) => {
    navigate(`/question/${questionId}`);
  };

  const handleVoteUpdate = (
    questionId: string,
    newVotes: number,
    isUpvoted: boolean,
    isDownvoted: boolean
  ) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId
          ? { ...question, votes: newVotes, isUpvoted, isDownvoted }
          : question
      )
    );
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
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Ask Question Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {searchParams.get("search") ? "Search Results" : "Questions"}
            </h1>
            <p className="text-muted-foreground">
              {searchParams.get("search")
                ? `Showing results for "${searchParams.get("search")}"`
                : "Find answers to your technical questions"}
            </p>
            {searchParams.get("search") && (
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => navigate("/")}
              >
                ← Back to all questions
              </Button>
            )}
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
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading questions...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <Button
                variant="outline"
                onClick={fetchQuestions}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No questions found.</p>
              <Button onClick={() => navigate("/ask")} className="mt-2">
                Ask the first question
              </Button>
            </div>
          ) : (
            questions.map((question) => (
              <QuestionCard
                key={question.id}
                id={question.id}
                title={question.title}
                description={question.description}
                tags={question.tags}
                author={question.author}
                votes={question.votes}
                answers={question.answers}
                timestamp={formatTimestamp(question.timestamp)}
                isUpvoted={question.isUpvoted}
                isDownvoted={question.isDownvoted}
                onClick={() => handleQuestionClick(question.id)}
                onVoteUpdate={handleVoteUpdate}
              />
            ))
          )}
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
