import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  Eye,
  EyeOff,
  ArrowLeft,
  FileText,
  BarChart3,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from "@uppy/core";
import { Link } from "wouter";
import type { Download as DownloadType } from "@shared/schema";

const downloadFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortTitle: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  fileType: z.string().min(1, "File type is required"),
  fileSize: z.string().optional(),
  iconType: z.string().optional(),
  description: z.string().optional(),
  whenToUse: z.string().optional(),
  whyItMatters: z.string().optional(),
  contents: z.string().optional(),
  scriptureText: z.string().optional(),
  scriptureReference: z.string().optional(),
  isPublic: z.boolean().optional(),
  fileUrl: z.string().min(1, "File upload is required"),
});

type DownloadFormData = z.infer<typeof downloadFormSchema>;

export default function AdminDownloads() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDownload, setEditingDownload] = useState<DownloadType | null>(null);

  // Temporarily disabled admin check for development
  // useEffect(() => {
  //   if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
  //     window.location.href = '/';
  //   }
  // }, [isAuthenticated, isLoading, user]);

  const form = useForm<DownloadFormData>({
    resolver: zodResolver(downloadFormSchema),
    defaultValues: {
      title: "",
      shortTitle: "",
      category: "",
      fileType: "",
      fileSize: "",
      iconType: "file-text",
      description: "",
      whenToUse: "",
      whyItMatters: "",
      contents: "",
      scriptureText: "",
      scriptureReference: "",
      isPublic: false,
      fileUrl: "",
    },
  });

  const { data: downloads, isLoading: downloadsLoading } = useQuery<DownloadType[]>({
    queryKey: ['/api/admin/downloads'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: DownloadFormData) => {
      const payload = {
        ...data,
        whenToUse: data.whenToUse ? JSON.stringify(data.whenToUse.split('\n').filter(Boolean)) : undefined,
        contents: data.contents ? JSON.stringify(data.contents.split('\n').filter(Boolean)) : undefined,
        shortTitle: data.shortTitle || undefined,
        fileSize: data.fileSize || undefined,
        iconType: data.iconType || undefined,
        description: data.description || undefined,
        whyItMatters: data.whyItMatters || undefined,
        scriptureText: data.scriptureText || undefined,
        scriptureReference: data.scriptureReference || undefined,
      };
      return apiRequest('POST', '/api/admin/downloads', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/downloads'] });
      toast({ title: "Success", description: "Download created successfully" });
      closeDialog();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create download", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: DownloadFormData) => {
      const payload = {
        ...data,
        whenToUse: data.whenToUse ? JSON.stringify(data.whenToUse.split('\n').filter(Boolean)) : undefined,
        contents: data.contents ? JSON.stringify(data.contents.split('\n').filter(Boolean)) : undefined,
        shortTitle: data.shortTitle || undefined,
        fileSize: data.fileSize || undefined,
        iconType: data.iconType || undefined,
        description: data.description || undefined,
        whyItMatters: data.whyItMatters || undefined,
        scriptureText: data.scriptureText || undefined,
        scriptureReference: data.scriptureReference || undefined,
      };
      return apiRequest('PUT', `/api/admin/downloads/${editingDownload!.id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/downloads'] });
      toast({ title: "Success", description: "Download updated successfully" });
      closeDialog();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update download", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/admin/downloads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/downloads'] });
      toast({ title: "Success", description: "Download deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete download", variant: "destructive" });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('PATCH', `/api/admin/downloads/${id}/toggle-published`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/downloads'] });
      toast({ title: "Success", description: "Published status toggled" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to toggle publish status", variant: "destructive" });
    },
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingDownload(null);
    form.reset({
      title: "",
      shortTitle: "",
      category: "",
      fileType: "",
      fileSize: "",
      iconType: "file-text",
      description: "",
      whenToUse: "",
      whyItMatters: "",
      contents: "",
      scriptureText: "",
      scriptureReference: "",
      isPublic: false,
      fileUrl: "",
    });
  };

  const handleCreate = () => {
    setEditingDownload(null);
    form.reset({
      title: "",
      shortTitle: "",
      category: "",
      fileType: "",
      fileSize: "",
      iconType: "file-text",
      description: "",
      whenToUse: "",
      whyItMatters: "",
      contents: "",
      scriptureText: "",
      scriptureReference: "",
      isPublic: false,
      fileUrl: "",
    });
    setDialogOpen(true);
  };

  const handleEdit = (download: DownloadType) => {
    setEditingDownload(download);
    let whenToUseText = "";
    try {
      const parsed = JSON.parse(download.whenToUse || "[]");
      whenToUseText = Array.isArray(parsed) ? parsed.join('\n') : (download.whenToUse || "");
    } catch {
      whenToUseText = download.whenToUse || "";
    }
    let contentsText = "";
    try {
      const parsed = JSON.parse(download.contents || "[]");
      contentsText = Array.isArray(parsed) ? parsed.join('\n') : (download.contents || "");
    } catch {
      contentsText = download.contents || "";
    }
    form.reset({
      title: download.title,
      shortTitle: download.shortTitle || "",
      category: download.category,
      fileType: download.fileType,
      fileSize: download.fileSize || "",
      iconType: download.iconType || "file-text",
      description: download.description || "",
      whenToUse: whenToUseText,
      whyItMatters: download.whyItMatters || "",
      contents: contentsText,
      scriptureText: download.scriptureText || "",
      scriptureReference: download.scriptureReference || "",
      isPublic: download.isPublic || false,
      fileUrl: download.fileUrl,
    });
    setDialogOpen(true);
  };

  const onSubmit = (data: DownloadFormData) => {
    if (editingDownload) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const totalDownloads = downloads?.reduce((sum, d) => sum + (d.downloadCount || 0), 0) || 0;
  const publishedCount = downloads?.filter(d => d.isPublished).length || 0;

  // Temporarily disabled admin check for development
  // if (isLoading || !isAuthenticated || user?.role !== 'admin') {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Loading admin panel...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-cinzel">Downloads Management</h1>
                <p className="text-gray-600 dark:text-gray-300">Manage downloadable resources and documents</p>
              </div>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Download
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{downloads?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Download Count</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDownloads}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              All Downloads
            </CardTitle>
            <CardDescription>Manage downloadable documents, templates, and resources</CardDescription>
          </CardHeader>
          <CardContent>
            {downloadsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading downloads...</p>
              </div>
            ) : downloads && downloads.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>File Type</TableHead>
                    <TableHead>File Size</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downloads.map((download) => (
                    <TableRow key={download.id}>
                      <TableCell className="font-medium max-w-xs">
                        <div>
                          <p className="truncate">{download.title}</p>
                          {download.shortTitle && (
                            <p className="text-xs text-gray-500 truncate">{download.shortTitle}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{download.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{download.fileType}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{download.fileSize || "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Download className="h-3 w-3 text-gray-500" />
                          <span className="font-semibold">{download.downloadCount || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={download.isPublished ? "default" : "secondary"}>
                          {download.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePublishMutation.mutate(download.id)}
                            title={download.isPublished ? "Unpublish" : "Publish"}
                          >
                            {download.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(download)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Download</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{download.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(download.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No downloads found</p>
                <p className="text-gray-500 text-sm">Click "Add Download" to create your first downloadable resource</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDownload ? "Edit Download" : "Create New Download"}</DialogTitle>
            <DialogDescription>
              {editingDownload ? "Update the download details below." : "Fill in the details to create a new downloadable resource."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shortTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Short display title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Foundation">Foundation</SelectItem>
                          <SelectItem value="Legal Templates">Legal Templates</SelectItem>
                          <SelectItem value="Study Guides">Study Guides</SelectItem>
                          <SelectItem value="Prayers & Declarations">Prayers & Declarations</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fileType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PDF">PDF</SelectItem>
                          <SelectItem value="DOC">DOC</SelectItem>
                          <SelectItem value="DOCX">DOCX</SelectItem>
                          <SelectItem value="MP3">MP3</SelectItem>
                          <SelectItem value="MP4">MP4</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fileSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 2.4 MB" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="iconType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scroll">Scroll</SelectItem>
                        <SelectItem value="shield">Shield</SelectItem>
                        <SelectItem value="book-open">Book Open</SelectItem>
                        <SelectItem value="scale">Scale</SelectItem>
                        <SelectItem value="crown">Crown</SelectItem>
                        <SelectItem value="file-text">File Text</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter description" rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="whenToUse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>When to Use (one item per line)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter items, one per line" rows={4} className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What's Inside / Contents (one item per line)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter items, one per line" rows={4} className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="whyItMatters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Why It Matters</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Explain why this resource matters" rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="scriptureText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scripture Text</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter scripture text" rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="scriptureReference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scripture Reference</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. John 8:36" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Is Public</FormLabel>
                      <p className="text-sm text-muted-foreground">Allow access without authentication</p>
                    </div>
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>File Upload *</FormLabel>
                <div className="flex items-center space-x-4">
                  <ObjectUploader
                    maxNumberOfFiles={1}
                    maxFileSize={52428800}
                    onGetUploadParameters={async () => {
                      const res = await fetch("/api/objects/upload", { method: "POST", credentials: "include" });
                      const { uploadURL } = await res.json();
                      return { method: "PUT" as const, url: uploadURL };
                    }}
                    onComplete={(result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
                      if (result.successful && result.successful.length > 0) {
                        const uploadedFile = result.successful[0];
                        const uploadURL = uploadedFile.uploadURL || "";
                        try {
                          const objectPath = new URL(uploadURL).pathname;
                          const uploadsIndex = objectPath.indexOf('/uploads/');
                          const normalizedPath = uploadsIndex !== -1
                            ? `/objects${objectPath.slice(uploadsIndex)}`
                            : `/objects${objectPath}`;
                          form.setValue("fileUrl", normalizedPath);
                          toast({ title: "File uploaded", description: "File uploaded successfully" });
                        } catch {
                          form.setValue("fileUrl", uploadURL);
                        }
                      }
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </ObjectUploader>
                  {form.watch("fileUrl") && (
                    <span className="text-sm text-green-600 truncate max-w-xs">
                      ✓ File uploaded
                    </span>
                  )}
                </div>
                {form.formState.errors.fileUrl && (
                  <p className="text-sm text-red-500">{form.formState.errors.fileUrl.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending)
                    ? "Saving..."
                    : editingDownload ? "Update Download" : "Create Download"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}