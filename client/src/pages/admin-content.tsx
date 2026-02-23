import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Image, 
  Type, 
  Code,
  FileText,
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
  Eye,
  Globe,
  Mail
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import EmailTemplateEditor from "@/components/EmailTemplateEditor";
import AdminLayout from "@/components/layout/admin-layout";

interface PageContent {
  id: string;
  pageName: string;
  contentKey: string;
  contentValue: string;
  contentType: 'image' | 'text' | 'html';
  description?: string;
  updatedById: string;
  createdAt: string;
  updatedAt: string;
}

const contentSchema = z.object({
  pageName: z.string().min(1, "Page name is required"),
  contentKey: z.string().min(1, "Content key is required"),
  contentValue: z.string().min(1, "Content value is required"),
  contentType: z.enum(['image', 'text', 'html']),
  description: z.string().optional(),
});

type ContentFormData = z.infer<typeof contentSchema>;

export default function AdminContent() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [pageFilter, setPageFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedContent, setSelectedContent] = useState<PageContent | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "email-templates">("content");

  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      pageName: "",
      contentKey: "",
      contentValue: "",
      contentType: "image",
      description: "",
    },
  });

  const { data: pageContent, isLoading: contentLoading } = useQuery<PageContent[]>({
    queryKey: ['/api/admin/page-content'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const createContentMutation = useMutation({
    mutationFn: async (data: ContentFormData) => {
      return apiRequest('POST', '/api/admin/page-content', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/page-content'] });
      toast({
        title: "Content Created",
        description: "Page content has been created successfully.",
      });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create page content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateContentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContentFormData> }) => {
      return apiRequest('PATCH', `/api/admin/page-content/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/page-content'] });
      toast({
        title: "Content Updated",
        description: "Page content has been updated successfully.",
      });
      setIsEditDialogOpen(false);
      setSelectedContent(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update page content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/admin/page-content/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/page-content'] });
      toast({
        title: "Content Deleted",
        description: "Page content has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete page content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredContent = pageContent?.filter(content => {
    const matchesSearch = content.pageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.contentKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.contentValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPage = pageFilter === "all" || content.pageName === pageFilter;
    const matchesType = typeFilter === "all" || content.contentType === typeFilter;
    
    return matchesSearch && matchesPage && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'text': return <Type className="h-4 w-4" />;
      case 'html': return <Code className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'image': return 'default';
      case 'text': return 'secondary';
      case 'html': return 'outline';
      default: return 'outline';
    }
  };

  const onSubmit = (data: ContentFormData) => {
    if (selectedContent) {
      updateContentMutation.mutate({ 
        id: selectedContent.id, 
        data 
      });
    } else {
      createContentMutation.mutate(data);
    }
  };

  const handleEdit = (content: PageContent) => {
    setSelectedContent(content);
    form.reset({
      pageName: content.pageName,
      contentKey: content.contentKey,
      contentValue: content.contentValue,
      contentType: content.contentType,
      description: content.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedContent(null);
    form.reset({
      pageName: "",
      contentKey: "",
      contentValue: "",
      contentType: "image",
      description: "",
    });
    setIsCreateDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Page Content Management</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage images, text, and content across all website pages</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>
        {/* Recent Changes Summary */}
        <Card className="mb-6 border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Recent Content Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">About Page Images Updated</h4>
              <p className="text-amber-700 dark:text-amber-300 text-sm">
                ✓ Hero background changed to peaceful landscape<br/>
                ✓ Main content image updated to open Bible with golden light<br/>
                ✓ Replaced technology-related imagery with spiritual content
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={pageFilter} onValueChange={setPageFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pages</SelectItem>
                  <SelectItem value="about">About</SelectItem>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="videos">Videos</SelectItem>
                  <SelectItem value="resources">Resources</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-gray-500 flex items-center">
                Total: {filteredContent?.length || 0} items
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab("content")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "content"
                ? "border-covenant-gold text-covenant-gold"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            data-testid="tab-content"
          >
            <FileText className="h-4 w-4 mr-2 inline" />
            Page Content
          </button>
          <button
            onClick={() => setActiveTab("email-templates")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "email-templates"
                ? "border-covenant-gold text-covenant-gold"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            data-testid="tab-email-templates"
          >
            <Mail className="h-4 w-4 mr-2 inline" />
            Email Templates
          </button>
        </div>

        {activeTab === "content" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Page Content
              </CardTitle>
              <CardDescription>
                Manage images, text, and HTML content across all website pages
              </CardDescription>
            </CardHeader>
            <CardContent>
            {contentLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading content...</p>
              </div>
            ) : filteredContent && filteredContent.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Value Preview</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContent.map((content) => (
                    <TableRow key={content.id}>
                      <TableCell>
                        <Badge variant="outline">{content.pageName}</Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {content.contentKey}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTypeBadgeVariant(content.contentType)}>
                          <div className="flex items-center">
                            {getTypeIcon(content.contentType)}
                            <span className="ml-1">{content.contentType}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate text-sm text-gray-600">
                          {content.description || "No description"}
                        </p>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        {content.contentType === 'image' ? (
                          <div className="flex items-center space-x-2">
                            <img 
                              src={content.contentValue} 
                              alt="Preview" 
                              className="w-8 h-8 object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <span className="text-xs text-gray-500 truncate">
                              {content.contentValue.split('/').pop()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm truncate">
                            {content.contentValue.substring(0, 50)}
                            {content.contentValue.length > 50 && '...'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {new Date(content.updatedAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(content)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {content.contentType === 'image' && (
                              <DropdownMenuItem 
                                onClick={() => window.open(content.contentValue, '_blank')}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Image
                              </DropdownMenuItem>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Content</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this content item? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteContentMutation.mutate(content.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No content found</p>
                <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )}
            </CardContent>
          </Card>
        )}

        {activeTab === "email-templates" && (
          <EmailTemplateEditor />
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedContent(null);
          form.reset();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedContent ? 'Edit Content' : 'Create Content'}
            </DialogTitle>
            <DialogDescription>
              {selectedContent 
                ? 'Update the page content information below.' 
                : 'Add new content to a website page.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pageName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Name</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select page" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="about">About</SelectItem>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="videos">Videos</SelectItem>
                          <SelectItem value="resources">Resources</SelectItem>
                          <SelectItem value="contact">Contact</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="html">HTML</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="contentKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Key</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., hero_background, main_image, title_text" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for this content within the page
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contentValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Value</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="URL for images, text content, or HTML markup"
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      The actual content (URL for images, text for text content, HTML for HTML content)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Brief description of this content"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Human-readable description for admin reference
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setIsEditDialogOpen(false);
                    setSelectedContent(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createContentMutation.isPending || updateContentMutation.isPending}
                >
                  {createContentMutation.isPending || updateContentMutation.isPending 
                    ? "Saving..." 
                    : selectedContent ? "Update Content" : "Create Content"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}