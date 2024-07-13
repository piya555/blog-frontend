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
import {
  createBanner,
  deleteBanner,
  getBanners,
  updateBanner,
} from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import BannerForm from "./BannerForm";

export interface IBanner {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const fetchedBanners = await getBanners();
      setBanners(fetchedBanners);
    } catch (error) {
      toast.error("Failed to fetch banners");
      console.error("Error fetching banners:", error);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      try {
        await deleteBanner(id);
        toast.success("Banner deleted successfully");
        fetchBanners();
      } catch (error) {
        toast.error("Failed to delete banner");
        console.error("Error deleting banner:", error);
      }
    }
  };

  const handleBannerSubmit = async (data: FormData) => {
    try {
      if (editingBanner) {
        await updateBanner(editingBanner.id, data);
        toast.success("Banner updated successfully");
      } else {
        await createBanner(data);
        toast.success("Banner created successfully");
      }
      fetchBanners();
      setIsDialogOpen(false);
      setEditingBanner(null);
    } catch (error) {
      toast.error("Failed to submit banner");
      console.error("Error submitting banner:", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Banner Management</h1>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setEditingBanner(null)}>
            Create New Banner
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? "Edit Banner" : "Create New Banner"}
            </DialogTitle>
          </DialogHeader>
          <BannerForm
            initialData={editingBanner || undefined}
            onSubmit={handleBannerSubmit}
          />
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell>{banner.title}</TableCell>
              <TableCell>
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${banner.imageUrl}`} // banner.imageUrl}
                  alt={banner.title}
                  className="h-10 w-10 object-cover"
                />
              </TableCell>
              <TableCell>{banner.link}</TableCell>
              <TableCell>{banner.isActive ? "Yes" : "No"}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => {
                    setEditingBanner(banner);
                    setIsDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteBanner(banner.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
