"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createPost, deletePost, getPosts, updatePost } from "@/lib/api";
import { Post, UpdatePostInput } from "@/models/interface";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import PostForm from "./post-form";

export default function PostManagementPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<UpdatePostInput | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      toast.error("Failed to fetch posts");
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: FormData) => {
    try {
      if (editingPost) {
        await updatePost(editingPost.id as string, data);
        toast.success("Post updated successfully");
      } else {
        await createPost(data);
        toast.success("Post created successfully");
      }
      fetchPosts();
      setIsDialogOpen(false);
      setEditingPost(null);
    } catch (error) {
      toast.error(
        editingPost ? "Failed to update post" : "Failed to create post"
      );
      console.error("Error saving post:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId);
        toast.success("Post deleted successfully");
        fetchPosts();
      } catch (error) {
        toast.error("Failed to delete post");
        console.error("Error deleting post:", error);
      }
    }
  };

  const mapPostToUpdateInput = (post: Post): UpdatePostInput => ({
    ...post,
    categories: post.categories.map((category) => category.id),
    tags: post.tags.map((tag) => tag.id),
    thumbnail: post.thumbnail ? new File([], "") : undefined,
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Post Management</h1>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setEditingPost(null)}>Create New Post</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Edit Post" : "Create New Post"}
            </DialogTitle>
          </DialogHeader>
          <PostForm
            initialData={editingPost || undefined}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <p>Loading posts...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => {
                      setEditingPost(mapPostToUpdateInput(post));
                      setIsDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
