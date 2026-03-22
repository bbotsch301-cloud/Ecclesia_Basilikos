import { useState, useMemo } from "react";
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
  Search,
  ExternalLink,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Copy,
  RefreshCw,
  Filter,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from "@uppy/core";
import { Link } from "wouter";
import type { Download as DownloadType } from "@shared/schema";
import AdminLayout from "@/components/layout/admin-layout";
import { usePageTitle } from "@/hooks/usePageTitle";

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
  isFree: z.boolean().optional(),
  fileUrl: z.string().min(1, "File URL is required"),
});

type DownloadFormData = z.infer<typeof downloadFormSchema>;

type SortField = "title" | "category" | "fileType" | "downloadCount" | "createdAt" | "isPublished";
type SortDirection = "asc" | "desc";

const CATEGORIES = ["Foundation", "Legal Templates", "Study Guides", "Prayers & Declarations"];

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    return value.split("\n").map(s => s.trim()).filter(Boolean);
  }
  return [];
}

function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes || bytes === 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size % 1 === 0 ? size : size.toFixed(1)} ${units[unitIndex]}`;
}

function extensionToFileType(ext: string): string {
  const map: Record<string, string> = {
    pdf: "PDF",
    doc: "DOC",
    docx: "DOCX",
    mp3: "MP3",
    mp4: "MP4",
  };
  return map[ext.toLowerCase().replace(".", "")] || "";
}

function filenameToTitle(name: string): string {
  // Remove extension, replace dashes/underscores with spaces, title-case
  const withoutExt = name.replace(/\.[^.]+$/, "");
  return withoutExt
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function formatDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminDownloads() {
  usePageTitle("Admin - Downloads");
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDownload, setEditingDownload] = useState<DownloadType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [detailView, setDetailView] = useState<DownloadType | null>(null);

  const form = useForm<DownloadFormData>({
    mode: "onBlur",
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
      isFree: false,
      fileUrl: "",
    },
  });

  const { data: downloads, isLoading: downloadsLoading, refetch } = useQuery<DownloadType[]>({
    queryKey: ['/api/admin/downloads'],
    queryFn: getQueryFn({ on401: "returnNull" }),
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
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message || "Failed to create download", variant: "destructive" });
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
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message || "Failed to update download", variant: "destructive" });
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
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message || "Failed to delete download", variant: "destructive" });
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
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message || "Failed to toggle publish status", variant: "destructive" });
    },
  });

  const [aiGenerating, setAiGenerating] = useState(false);

  const handleAiGenerate = async () => {
    const fileUrl = form.getValues("fileUrl");
    const title = form.getValues("title");
    const fileType = form.getValues("fileType");
    const fileSize = form.getValues("fileSize");

    if (!fileUrl) {
      toast({ title: "Upload a file first", description: "Please upload a file before generating metadata.", variant: "destructive" });
      return;
    }

    // Extract filename from URL
    const fileName = fileUrl.split('/').pop() || fileUrl;

    setAiGenerating(true);
    try {
      const res = await apiRequest('POST', '/api/admin/downloads/ai-generate', {
        fileName,
        fileType: fileType || 'PDF',
        fileSize: fileSize || undefined,
        title: title || undefined,
      });
      const metadata = await res.json();

      // Populate form fields with AI-generated content
      if (metadata.description) form.setValue("description", metadata.description);
      if (metadata.category) form.setValue("category", metadata.category);
      if (metadata.iconType) form.setValue("iconType", metadata.iconType);
      if (metadata.whenToUse && Array.isArray(metadata.whenToUse)) {
        form.setValue("whenToUse", metadata.whenToUse.join('\n'));
      }
      if (metadata.contents && Array.isArray(metadata.contents)) {
        form.setValue("contents", metadata.contents.join('\n'));
      }
      if (metadata.whyItMatters) form.setValue("whyItMatters", metadata.whyItMatters);
      if (metadata.scriptureText) form.setValue("scriptureText", metadata.scriptureText);
      if (metadata.scriptureReference) form.setValue("scriptureReference", metadata.scriptureReference);

      toast({ title: "AI Generated", description: "Content fields have been populated. Feel free to edit them." });
    } catch (error: any) {
      toast({ title: "AI Generation Failed", description: error.message || "Failed to generate metadata. Please try again or fill in manually.", variant: "destructive" });
    } finally {
      setAiGenerating(false);
    }
  };

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
      isFree: false,
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
      isFree: false,
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
      isFree: download.isFree || false,
      fileUrl: download.fileUrl,
    });
    setDialogOpen(true);
  };

  const handleDuplicate = (download: DownloadType) => {
    setEditingDownload(null);
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
      title: `${download.title} (Copy)`,
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
      isFree: download.isFree || false,
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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
    return sortDirection === "asc"
      ? <ArrowUp className="h-3 w-3 ml-1" />
      : <ArrowDown className="h-3 w-3 ml-1" />;
  };

  // Filter and sort downloads
  const filteredDownloads = useMemo(() => {
    if (!downloads) return [];

    let result = [...downloads];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.title.toLowerCase().includes(query) ||
        (d.shortTitle && d.shortTitle.toLowerCase().includes(query)) ||
        (d.description && d.description.toLowerCase().includes(query)) ||
        d.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter(d => d.category === categoryFilter);
    }

    // Status filter
    if (statusFilter === "published") {
      result = result.filter(d => d.isPublished);
    } else if (statusFilter === "draft") {
      result = result.filter(d => !d.isPublished);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "fileType":
          comparison = a.fileType.localeCompare(b.fileType);
          break;
        case "downloadCount":
          comparison = (a.downloadCount || 0) - (b.downloadCount || 0);
          break;
        case "createdAt":
          comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
          break;
        case "isPublished":
          comparison = (a.isPublished ? 1 : 0) - (b.isPublished ? 1 : 0);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [downloads, searchQuery, categoryFilter, statusFilter, sortField, sortDirection]);

  const totalDownloads = downloads?.reduce((sum, d) => sum + (d.downloadCount || 0), 0) || 0;
  const publishedCount = downloads?.filter(d => d.isPublished).length || 0;
  const draftCount = (downloads?.length || 0) - publishedCount;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-cinzel">Downloads Management</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage downloadable resources and documents</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Download
            </Button>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
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
              <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{draftCount}</div>
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

        {/* Detail View Dialog */}
        <Dialog open={!!detailView} onOpenChange={(open) => { if (!open) setDetailView(null); }}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            {detailView && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">{detailView.title}</DialogTitle>
                  <DialogDescription className="flex items-center gap-2 pt-1">
                    <Badge variant="outline">{detailView.category}</Badge>
                    <Badge variant="secondary">{detailView.fileType}</Badge>
                    <Badge variant={detailView.isPublished ? "default" : "secondary"}>
                      {detailView.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  {detailView.shortTitle && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Short Title</p>
                      <p>{detailView.shortTitle}</p>
                    </div>
                  )}
                  {detailView.description && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Description</p>
                      <p className="text-gray-700 dark:text-gray-300">{detailView.description}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">File Size</p>
                      <p>{detailView.fileSize || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Downloads</p>
                      <p className="font-semibold">{detailView.downloadCount || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Created</p>
                      <p>{formatDate(detailView.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Updated</p>
                      <p>{formatDate(detailView.updatedAt)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">File URL</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1 truncate">
                        {detailView.fileUrl}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(detailView.fileUrl);
                          toast({ title: "Copied", description: "File URL copied to clipboard" });
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(detailView.fileUrl, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {parseJsonArray(detailView.whenToUse).length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">When to Use</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {parseJsonArray(detailView.whenToUse).map((item, i) => (
                          <li key={i} className="text-gray-700 dark:text-gray-300 text-sm">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {parseJsonArray(detailView.contents).length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Contents</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {parseJsonArray(detailView.contents).map((item, i) => (
                          <li key={i} className="text-gray-700 dark:text-gray-300 text-sm">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {detailView.whyItMatters && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Why It Matters</p>
                      <p className="text-gray-700 dark:text-gray-300">{detailView.whyItMatters}</p>
                    </div>
                  )}
                  {detailView.scriptureText && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <p className="italic text-gray-700 dark:text-gray-300">"{detailView.scriptureText}"</p>
                      {detailView.scriptureReference && (
                        <p className="text-sm font-semibold text-gray-500 mt-1">— {detailView.scriptureReference}</p>
                      )}
                    </div>
                  )}
                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" onClick={() => { setDetailView(null); handleEdit(detailView); }}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setDetailView(null); handleDuplicate(detailView); }}>
                      <Copy className="h-4 w-4 mr-1" /> Duplicate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { togglePublishMutation.mutate(detailView.id); setDetailView(null); }}
                    >
                      {detailView.isPublished ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                      {detailView.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Downloads Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  All Downloads
                  {filteredDownloads.length !== (downloads?.length || 0) && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      (showing {filteredDownloads.length} of {downloads?.length || 0})
                    </span>
                  )}
                </CardTitle>
                <CardDescription>Manage downloadable documents, templates, and resources</CardDescription>
              </div>
            </div>
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title, description, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {downloadsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading downloads...</p>
              </div>
            ) : filteredDownloads.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <button className="flex items-center font-semibold hover:text-gray-900" onClick={() => handleSort("title")}>
                          Title <SortIcon field="title" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button className="flex items-center font-semibold hover:text-gray-900" onClick={() => handleSort("category")}>
                          Category <SortIcon field="category" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button className="flex items-center font-semibold hover:text-gray-900" onClick={() => handleSort("fileType")}>
                          Type <SortIcon field="fileType" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button className="flex items-center font-semibold hover:text-gray-900" onClick={() => handleSort("downloadCount")}>
                          Downloads <SortIcon field="downloadCount" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button className="flex items-center font-semibold hover:text-gray-900" onClick={() => handleSort("isPublished")}>
                          Status <SortIcon field="isPublished" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button className="flex items-center font-semibold hover:text-gray-900" onClick={() => handleSort("createdAt")}>
                          Created <SortIcon field="createdAt" />
                        </button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDownloads.map((download) => (
                      <TableRow key={download.id} className="group">
                        <TableCell className="font-medium max-w-xs">
                          <button
                            className="text-left hover:text-blue-600 transition-colors"
                            onClick={() => setDetailView(download)}
                          >
                            <p className="truncate font-semibold">{download.title}</p>
                            {download.shortTitle && (
                              <p className="text-xs text-gray-500 truncate">{download.shortTitle}</p>
                            )}
                          </button>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{download.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{download.fileType}</Badge>
                          {download.fileSize && (
                            <span className="text-xs text-gray-500 ml-1">{download.fileSize}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Download className="h-3 w-3 text-gray-500" />
                            <span className="font-semibold">{download.downloadCount || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={download.isPublished ? "default" : "secondary"}
                            className={download.isPublished ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                          >
                            {download.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(download.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(download.fileUrl, '_blank')}
                              title="Open file"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePublishMutation.mutate(download.id)}
                              title={download.isPublished ? "Unpublish" : "Publish"}
                              disabled={togglePublishMutation.isPending}
                            >
                              {download.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(download)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDuplicate(download)}
                              title="Duplicate"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" title="Delete">
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
              </div>
            ) : downloads && downloads.length > 0 ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No downloads match your filters</p>
                <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => { setSearchQuery(""); setCategoryFilter("all"); setStatusFilter("all"); }}
                >
                  Clear Filters
                </Button>
              </div>
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

      {/* Create / Edit Dialog */}
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
                          {CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
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

              <FormField
                control={form.control}
                name="isFree"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Free Content</FormLabel>
                      <p className="text-sm text-muted-foreground">Available to free-tier users (Trust content)</p>
                    </div>
                  </FormItem>
                )}
              />

              {/* File Upload + Manual URL */}
              <div className="space-y-3">
                <FormLabel>File *</FormLabel>
                <div className="flex items-center space-x-4">
                  <ObjectUploader
                    maxNumberOfFiles={1}
                    maxFileSize={52428800}
                    onGetUploadParameters={async () => {
                      const res = await fetch("/api/objects/upload", { method: "POST", credentials: "include" });
                      if (!res.ok) throw new Error("Failed to get upload URL");
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
                          form.setValue("fileUrl", normalizedPath, { shouldValidate: true });
                        } catch {
                          form.setValue("fileUrl", uploadURL, { shouldValidate: true });
                        }

                        // Auto-fill title from filename if empty
                        if (!form.getValues("title") && uploadedFile.name) {
                          form.setValue("title", filenameToTitle(uploadedFile.name));
                        }

                        // Auto-fill file type from extension
                        const ext = uploadedFile.extension || uploadedFile.name?.split(".").pop() || "";
                        const detectedType = extensionToFileType(ext);
                        if (detectedType) {
                          form.setValue("fileType", detectedType);
                        }

                        // Auto-fill file size
                        if (uploadedFile.size) {
                          form.setValue("fileSize", formatFileSize(uploadedFile.size));
                        }

                        toast({ title: "File uploaded", description: "File uploaded; title, type, and size auto-filled" });
                      }
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </ObjectUploader>
                  <span className="text-sm text-gray-400">or</span>
                </div>
                {form.watch("fileUrl") && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAiGenerate}
                    disabled={aiGenerating}
                    className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-950"
                  >
                    {aiGenerating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    {aiGenerating ? "Generating..." : "Generate with AI"}
                  </Button>
                )}
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter file URL manually (e.g. /objects/uploads/file.pdf)" {...field} />
                      </FormControl>
                      {field.value && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-600 truncate flex-1">
                            Current: {field.value}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(field.value, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
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
    </AdminLayout>
  );
}
