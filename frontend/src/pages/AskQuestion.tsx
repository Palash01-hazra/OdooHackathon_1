import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Bell,
  User,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const navigate = useNavigate();

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim()) && tags.length < 5) {
      setTags([...tags, tag.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title.length < 10) {
      alert("Title must be at least 10 characters long");
      return;
    }

    if (description.length < 20) {
      alert("Description must be at least 20 characters long");
      return;
    }

    if (tags.length === 0) {
      alert("Please add at least one tag");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to ask a question");
        navigate("/auth");
        return;
      }

      const response = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, tags }),
      });

      const data = await response.json();

      if (data.success) {
        navigate("/");
      } else {
        alert(data.message || "Failed to create question");
      }
    } catch (error) {
      console.error("Error creating question:", error);
      alert("Failed to create question. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Ask a Question
            </h1>
            <p className="text-muted-foreground">
              Share your knowledge with the community
            </p>
          </div>

          <Button variant="outline" onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Question Title</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder="What's your programming question? Be specific."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg"
                required
              />
              <p className="text-sm text-muted-foreground mt-2">
                Be specific and imagine you're asking a question to another
                person
              </p>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
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
                placeholder="Provide all the details someone would need to answer your question..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[200px] rounded-t-none border-t-0 focus:border-primary"
                required
              />
              <p className="text-sm text-muted-foreground mt-2">
                Include code samples, error messages, or any relevant context
              </p>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="Add tags (press Enter or comma to add)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={tags.length >= 5}
                />

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-tag-bg text-tag-text cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}

                <p className="text-sm text-muted-foreground">
                  Add up to 5 tags to describe what your question is about (
                  {tags.length}/5)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={
                !title.trim() || !description.trim() || tags.length === 0
              }
              className="shadow-button"
            >
              Post Question
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
