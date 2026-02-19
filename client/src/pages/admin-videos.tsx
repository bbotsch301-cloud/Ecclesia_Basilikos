import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Video,
  Plus,
  Edit,
  Trash2,
  Upload,
  FileText,
  Eye,
  EyeOff,
  Star,
  ArrowLeft,
  Search
} from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from "@uppy/core";

// Matches server's insertVideoSchema (minus id, viewCount, createdAt, updatedAt, createdById)
const videoFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().or(z.literal("")),
  videoUrl: z.string().optional().or(z.literal("")),
  embedUrl: z.string().optional().or(z.literal("")),
  thumbnailUrl: z.string().optional().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional().or(z.literal("")),
  duration: z.string().optional().or(z.literal("")),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

// Matches server's insertResourceSchema (minus id, downloadCount, createdAt, updatedAt, createdById)
const resourceFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  fileUrl: z.string().min(1, "File URL is required"),
  fileType: z.string().min(1, "File type is required"),
  fileSize: z.coerce.number().optional(),
  isPublished: z.boolean().default(false),
});

interface VideoData {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  embedUrl: string | null;
  thumbnailUrl: string | null;
  category: string;
  tags: string | null;
  duration: string | null;
  isPublished: boolean | null;
  isFeatured: boolean | null;
  viewCount: number | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

interface ResourceData {
  id: string;
  title: string;
  description: string | null;
  category: string;
  fileUrl: string;
  fileType: string;
  fileSize: number | null;
  isPublished: boolean | null;
  downloadCount: number | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminVideos() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoData | null>(null);
  const [editingResource, setEditingResource] = useState<ResourceData | null>(null);

  // Real API queries
  const { data: videos, isLoading: videosLoading } = useQuery<VideoData[]>({
    queryKey: ['/api/admin/videos'],
  });

  const { data: resources, isLoading: resourcesLoading } = useQuery<ResourceData[]>({
    queryKey: ['/api/admin/resources'],
  });

  // Forms
  const videoForm = useForm({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      embedUrl: "",
      thumbnailUrl: "",
      category: "",
      tags: "",
      duration: "",
      isPublished: false,
      isFeatured: false,
    },
  });

  const resourceForm = useForm({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      fileUrl: "",
      fileType: "",
      fileSize: undefined as number | undefined,
      isPublished: false,
    },
  });

  // Video mutations
  const videoMutation = useMutation({
    mutationFn: async (data: z.infer<typeof videoFormSchema>) => {
      if (editingVideo) {
        return apiRequest('PATCH', `/api/admin/videos/${editingVideo.id}`, data);
      }
      return apiRequest('POST', '/api/admin/videos', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/videos'] });
      toast({
        title: "Success",
        description: editingVideo ? "Video updated successfully" : "Video created successfully",
      });
      setVideoDialogOpen(false);
      videoForm.reset();
      setEditingVideo(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save video",
        variant: "destructive",
      });
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/admin/videos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/videos'] });
      toast({ title: "Video Deleted", description: "Video has been deleted successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message || "Failed to delete video", variant: "destructive" });
    },
  });

  const toggleVideoPublishedMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('PATCH', `/api/admin/videos/${id}/toggle-published`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/videos'] });
      toast({ title: "Status Updated", description: "Video publish status updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message || "Failed to update video", variant: "destructive" });
    },
  });

  // Resource mutations
  const resourceMutation = useMutation({
    mutationFn: async (data: z.infer<typeof resourceFormSchema>) => {
      if (editingResource) {
        return apiRequest('PATCH', `/api/admin/resources/${editingResource.id}`, data);
      }
      return apiRequest('POST', '/api/admin/resources', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/resources'] });
      toast({
        title: "Success",
        description: editingResource ? "Resource updated successfully" : "Resource created successfully",
      });
      setResourceDialogOpen(false);
      resourceForm.reset();
      setEditingResource(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save resource",
        variant: "destructive",
      });
    },
  });

  const deleteResourceMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/admin/resources/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/resources'] });
      toast({ title: "Resource Deleted", description: "Resource has been deleted successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message || "Failed to delete resource", variant: "destructive" });
    },
  });

  const toggleResourcePublishedMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('PATCH', `/api/admin/resources/${id}/toggle-published`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/resources'] });
      toast({ title: "Status Updated", description: "Resource publish status updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message || "Failed to update resource", variant: "destructive" });
    },
  });

  // Upload handler for resource files
  const handleGetUploadParameters = async () => {
    try {
      const response = await apiRequest("POST", "/api/objects/upload", {});
      const data = await response.json();
      return { method: "PUT" as const, url: data.uploadURL };
    } catch (error) {
      toast({ title: "Error", description: "Failed to get upload URL.", variant: "destructive" });
      throw error;
    }
  };

  const handleResourceUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const file = result.successful[0] as any;
      resourceForm.setValue("fileUrl", file.uploadURL || file.response?.uploadURL || "");
      resourceForm.setValue("fileType", file.type?.split('/')[1]?.toUpperCase() || "FILE");
      resourceForm.setValue("fileSize", file.size || 0);
      toast({ title: "Upload successful", description: `${file.name} uploaded successfully.` });
    }
  };

  // Filtering
  const filteredVideos = videos?.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (video.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResources = resources?.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (resource.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Videos & Resources</h1>
                <p className="text-gray-600 dark:text-gray-300">Manage video content and downloadable resources</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search videos and resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="videos">
          <TabsList>
            <TabsTrigger value="videos">
              <Video className="h-4 w-4 mr-2" />
              Videos ({videos?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="resources">
              <FileText className="h-4 w-4 mr-2" />
              Resources ({resources?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Videos Tab */}
          <TabsContent value="videos">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Videos</CardTitle>
                  <CardDescription>Manage video teachings and content</CardDescription>
                </div>
                <Button onClick={() => {
                  setEditingVideo(null);
                  videoForm.reset();
                  setVideoDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Video
                </Button>
              </CardHeader>
              <CardContent>
                {videosLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading videos...</p>
                  </div>
                ) : filteredVideos && filteredVideos.length > 0 ? (
                  <div className="space-y-4">
                    {filteredVideos.map((video) => (
                      <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-20 h-14 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                            {video.thumbnailUrl ? (
                              <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover rounded" />
                            ) : (
                              <Video className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold truncate">{video.title}</h3>
                            {video.description && (
                              <p className="text-sm text-gray-500 line-clamp-1">{video.description}</p>
                            )}
                            <div className="flex gap-2 mt-1 flex-wrap">
                              <Badge variant="outline">{video.category}</Badge>
                              {video.duration && <Badge variant="outline">{video.duration}</Badge>}
                              <Badge variant={video.isPublished ? "default" : "secondary"}>
                                {video.isPublished ? "Published" : "Draft"}
                              </Badge>
                              {video.isFeatured && (
                                <Badge variant="default">
                                  <Star className="h-3 w-3 mr-1" />Featured
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500 flex items-center">
                                {video.viewCount || 0} views
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleVideoPublishedMutation.mutate(video.id)}
                            title={video.isPublished ? "Unpublish" : "Publish"}
                          >
                            {video.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingVideo(video);
                              videoForm.reset({
                                title: video.title,
                                description: video.description || "",
                                videoUrl: video.videoUrl || "",
                                embedUrl: video.embedUrl || "",
                                thumbnailUrl: video.thumbnailUrl || "",
                                category: video.category,
                                tags: video.tags || "",
                                duration: video.duration || "",
                                isPublished: video.isPublished ?? false,
                                isFeatured: video.isFeatured ?? false,
                              });
                              setVideoDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Video</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{video.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteVideoMutation.mutate(video.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">No videos found</p>
                    <p className="text-gray-500 text-sm">Add your first video to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Resources</CardTitle>
                  <CardDescription>Manage downloadable files and documents</CardDescription>
                </div>
                <Button onClick={() => {
                  setEditingResource(null);
                  resourceForm.reset();
                  setResourceDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resource
                </Button>
              </CardHeader>
              <CardContent>
                {resourcesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading resources...</p>
                  </div>
                ) : filteredResources && filteredResources.length > 0 ? (
                  <div className="space-y-4">
                    {filteredResources.map((resource) => (
                      <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                            <FileText className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold truncate">{resource.title}</h3>
                            {resource.description && (
                              <p className="text-sm text-gray-500 line-clamp-1">{resource.description}</p>
                            )}
                            <div className="flex gap-2 mt-1 flex-wrap">
                              <Badge variant="outline">{resource.category}</Badge>
                              <Badge variant="outline">{resource.fileType}</Badge>
                              {resource.fileSize != null && (
                                <Badge variant="outline">{(resource.fileSize / 1000000).toFixed(1)} MB</Badge>
                              )}
                              <Badge variant={resource.isPublished ? "default" : "secondary"}>
                                {resource.isPublished ? "Published" : "Draft"}
                              </Badge>
                              <span className="text-xs text-gray-500 flex items-center">
                                {resource.downloadCount || 0} downloads
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleResourcePublishedMutation.mutate(resource.id)}
                            title={resource.isPublished ? "Unpublish" : "Publish"}
                          >
                            {resource.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingResource(resource);
                              resourceForm.reset({
                                title: resource.title,
                                description: resource.description || "",
                                category: resource.category,
                                fileUrl: resource.fileUrl,
                                fileType: resource.fileType,
                                fileSize: resource.fileSize ?? undefined,
                                isPublished: resource.isPublished ?? false,
                              });
                              setResourceDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{resource.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteResourceMutation.mutate(resource.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">No resources found</p>
                    <p className="text-gray-500 text-sm">Add your first resource to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Video Dialog */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
            <DialogDescription>
              {editingVideo ? 'Update video details' : 'Add a new video to your content library'}
            </DialogDescription>
          </DialogHeader>
          <Form {...videoForm}>
            <form onSubmit={videoForm.handleSubmit((data) => videoMutation.mutate(data))} className="space-y-4">
              <FormField control={videoForm.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl><Input placeholder="Video title" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={videoForm.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="Video description" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                <FormField control={videoForm.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl><Input placeholder="e.g., Trust Fundamentals" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={videoForm.control} name="duration" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl><Input placeholder="e.g., 45 minutes" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={videoForm.control} name="videoUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl><Input placeholder="Direct video URL" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={videoForm.control} name="embedUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Embed URL</FormLabel>
                    <FormControl><Input placeholder="YouTube/Vimeo embed URL" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={videoForm.control} name="thumbnailUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL</FormLabel>
                    <FormControl><Input placeholder="Thumbnail image URL" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={videoForm.control} name="tags" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl><Input placeholder="Comma-separated tags" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="flex gap-6">
                <FormField control={videoForm.control} name="isPublished" render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Published</FormLabel>
                  </FormItem>
                )} />
                <FormField control={videoForm.control} name="isFeatured" render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Featured</FormLabel>
                  </FormItem>
                )} />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => {
                  setVideoDialogOpen(false);
                  videoForm.reset();
                  setEditingVideo(null);
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={videoMutation.isPending}>
                  {videoMutation.isPending ? "Saving..." : editingVideo ? "Update Video" : "Add Video"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Resource Dialog */}
      <Dialog open={resourceDialogOpen} onOpenChange={setResourceDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingResource ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
            <DialogDescription>
              {editingResource ? 'Update resource details' : 'Add a new downloadable resource'}
            </DialogDescription>
          </DialogHeader>
          <Form {...resourceForm}>
            <form onSubmit={resourceForm.handleSubmit((data) => resourceMutation.mutate(data))} className="space-y-4">
              <FormField control={resourceForm.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl><Input placeholder="Resource title" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={resourceForm.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="Resource description" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                <FormField control={resourceForm.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl><Input placeholder="e.g., Trust Documents" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={resourceForm.control} name="fileType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Type</FormLabel>
                    <FormControl><Input placeholder="e.g., pdf, audio" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={resourceForm.control} name="fileUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>File URL</FormLabel>
                  <div className="flex gap-2">
                    <FormControl><Input placeholder="File URL (or use upload)" {...field} /></FormControl>
                    <ObjectUploader
                      maxNumberOfFiles={1}
                      maxFileSize={52428800}
                      onGetUploadParameters={handleGetUploadParameters}
                      onComplete={handleResourceUploadComplete}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </ObjectUploader>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={resourceForm.control} name="isPublished" render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!mt-0">Published</FormLabel>
                </FormItem>
              )} />

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => {
                  setResourceDialogOpen(false);
                  resourceForm.reset();
                  setEditingResource(null);
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={resourceMutation.isPending}>
                  {resourceMutation.isPending ? "Saving..." : editingResource ? "Update Resource" : "Add Resource"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
