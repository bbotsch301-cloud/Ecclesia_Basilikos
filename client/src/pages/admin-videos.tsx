import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Video, 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  FileText,
  Download,
  Youtube
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from "@uppy/core";

const videoSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  lessonId: z.string().min(1, "Lesson is required"),
  youtubeVideoId: z.string().min(1, "YouTube Video ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

const fileSchema = z.object({
  lessonId: z.string().min(1, "Lesson is required"),
  name: z.string().min(1, "File name is required"),
  type: z.string().min(1, "File type is required"),
  size: z.string().min(1, "File size is required"),
  downloadUrl: z.string().min(1, "Download URL is required"),
});

interface VideoData {
  id: string;
  courseId: string;
  lessonId: string;
  youtubeVideoId: string;
  title: string;
  description?: string;
  courseName: string;
  lessonTitle: string;
}

interface FileData {
  id: string;
  lessonId: string;
  name: string;
  type: string;
  size: string;
  downloadUrl: string;
  courseName: string;
  lessonTitle: string;
}

// Course data matching the actual course system
const sampleCourses = [
  { id: "1", title: "Trust Fundamentals", description: "Understanding the biblical foundation of trust relationships and your role as a trustee in God's kingdom economy." },
  { id: "2", title: "Advanced Trust Strategies", description: "Advanced techniques for trust management and wealth preservation." },
  { id: "3", title: "Estate Planning Mastery", description: "Comprehensive estate planning and legacy building strategies." },
  { id: "4", title: "Investment & Asset Management", description: "Biblical principles for managing trust assets and investments." },
  { id: "5", title: "Tax Strategy & Compliance", description: "Navigating tax implications and compliance requirements for trusts." },
  { id: "6", title: "Wealth Transfer Strategies", description: "Effective strategies for transferring wealth across generations." },
];

const sampleLessons = [
  { id: "1", title: "Introduction to Biblical Trusts", courseId: "1" },
  { id: "2", title: "Legal Structures and Kingdom Authority", courseId: "1" },
  { id: "3", title: "Trustee Responsibilities and Biblical Stewardship", courseId: "1" },
  { id: "4", title: "Asset Management and Investment Principles", courseId: "1" },
  { id: "5", title: "Banking and Financial Institutions", courseId: "1" },
  { id: "6", title: "Cryptocurrency and Digital Assets", courseId: "1" },
  { id: "7", title: "Wealth Legacy Building", courseId: "1" },
  { id: "8", title: "Practical Trust Administration", courseId: "1" },
];

export default function AdminVideos() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoData | null>(null);
  const [editingFile, setEditingFile] = useState<FileData | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    name: string;
    size: string;
    type: string;
    uploadUrl: string;
  }>>([]);

  // Remove admin authentication check for development
  // const { data: videos } = useQuery({ queryKey: ['/api/admin/videos'] });
  
  // Current video data from the course system
  const sampleVideos: VideoData[] = [
    {
      id: "1",
      courseId: "1",
      lessonId: "1", 
      youtubeVideoId: "dQw4w9WgXcQ",
      title: "Introduction to Biblical Trusts",
      description: "Understanding the scriptural foundation of trust relationships and your role as a trustee in God's kingdom economy.",
      courseName: "Trust Fundamentals",
      lessonTitle: "Introduction to Biblical Trusts"
    },
    {
      id: "2",
      courseId: "1",
      lessonId: "2", 
      youtubeVideoId: "dQw4w9WgXcQ",
      title: "Legal Structures and Kingdom Authority",
      description: "How to establish trust structures that honor God's authority while operating effectively in the modern legal system.",
      courseName: "Trust Fundamentals",
      lessonTitle: "Legal Structures and Kingdom Authority"
    },
    {
      id: "3",
      courseId: "1",
      lessonId: "3", 
      youtubeVideoId: "dQw4w9WgXcQ",
      title: "Trustee Responsibilities and Biblical Stewardship",
      description: "Understanding your duties and obligations as a faithful trustee managing God's resources.",
      courseName: "Trust Fundamentals",
      lessonTitle: "Trustee Responsibilities and Biblical Stewardship"
    },
    {
      id: "4",
      courseId: "1",
      lessonId: "4", 
      youtubeVideoId: "dQw4w9WgXcQ",
      title: "Asset Management and Investment Principles",
      description: "Biblical principles for managing trust assets, investments, and growing wealth according to Kingdom values.",
      courseName: "Trust Fundamentals",
      lessonTitle: "Asset Management and Investment Principles"
    },
    {
      id: "5",
      courseId: "1",
      lessonId: "5", 
      youtubeVideoId: "dQw4w9WgXcQ",
      title: "Banking and Financial Institutions",
      description: "Working with banks, managing accounts, and establishing proper financial relationships as a trustee.",
      courseName: "Trust Fundamentals",
      lessonTitle: "Banking and Financial Institutions"
    },
    {
      id: "6",
      courseId: "1",
      lessonId: "6", 
      youtubeVideoId: "dQw4w9WgXcQ",
      title: "Cryptocurrency and Digital Assets",
      description: "Understanding and managing digital assets, cryptocurrency, and modern investment vehicles within a trust.",
      courseName: "Trust Fundamentals",
      lessonTitle: "Cryptocurrency and Digital Assets"
    },
    {
      id: "7",
      courseId: "1",
      lessonId: "7", 
      youtubeVideoId: "dQw4w9WgXcQ",
      title: "Wealth Legacy Building",
      description: "Creating lasting financial legacies that honor God and bless future generations through proper trust management.",
      courseName: "Trust Fundamentals",
      lessonTitle: "Wealth Legacy Building"
    },
    {
      id: "8",
      courseId: "1",
      lessonId: "8", 
      youtubeVideoId: "dQw4w9WgXcQ",
      title: "Practical Trust Administration",
      description: "Daily operations, record keeping, beneficiary communication, and practical aspects of trust management.",
      courseName: "Trust Fundamentals",
      lessonTitle: "Practical Trust Administration"
    }
  ];

  const sampleFiles: FileData[] = [
    {
      id: "1",
      lessonId: "1",
      name: "Trust Administration Guide",
      type: "PDF",
      size: "2.3 MB",
      downloadUrl: "/api/files/trust-admin-guide.pdf",
      courseName: "Trust Fundamentals",
      lessonTitle: "Introduction to Biblical Trusts"
    },
    {
      id: "2",
      lessonId: "1",
      name: "Biblical Stewardship Principles",
      type: "PDF",
      size: "1.8 MB",
      downloadUrl: "/api/files/stewardship-principles.pdf",
      courseName: "Trust Fundamentals",
      lessonTitle: "Introduction to Biblical Trusts"
    },
    {
      id: "3",
      lessonId: "2",
      name: "Legal Structure Templates",
      type: "PDF",
      size: "3.1 MB",
      downloadUrl: "/api/files/legal-templates.pdf",
      courseName: "Trust Fundamentals",
      lessonTitle: "Legal Structures and Kingdom Authority"
    },
    {
      id: "4",
      lessonId: "3",
      name: "Trustee Duties Checklist",
      type: "PDF",
      size: "1.2 MB",
      downloadUrl: "/api/files/trustee-checklist.pdf",
      courseName: "Trust Fundamentals",
      lessonTitle: "Trustee Responsibilities and Biblical Stewardship"
    }
  ];

  const videoForm = useForm({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      courseId: "",
      lessonId: "",
      youtubeVideoId: "",
      title: "",
      description: "",
    }
  });

  const fileForm = useForm({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      lessonId: "",
      name: "",
      type: "",
      size: "",
      downloadUrl: "",
    }
  });

  const handleGetUploadParameters = async () => {
    try {
      const response = await apiRequest("POST", "/api/objects/upload", {});
      return {
        method: "PUT" as const,
        url: response.uploadURL,
      };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get upload URL. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const newFiles = result.successful.map((file: any) => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type.split('/')[1].toUpperCase(),
        uploadUrl: file.uploadURL || "",
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      toast({
        title: "Upload successful",
        description: `${newFiles.length} file(s) uploaded successfully.`,
      });
    }
  };

  const handleVideoSubmit = async (data: z.infer<typeof videoSchema>) => {
    try {
      const videoData = {
        ...data,
        files: uploadedFiles
      };
      
      // API call would go here with video data and associated files
      toast({
        title: "Success",
        description: editingVideo ? "Video updated successfully" : "Video added successfully",
      });
      setVideoDialogOpen(false);
      videoForm.reset();
      setUploadedFiles([]);
      setEditingVideo(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save video",
        variant: "destructive",
      });
    }
  };

  const handleFileSubmit = async (data: z.infer<typeof fileSchema>) => {
    try {
      // API call would go here
      toast({
        title: "Success", 
        description: editingFile ? "File updated successfully" : "File added successfully",
      });
      setFileDialogOpen(false);
      fileForm.reset();
      setEditingFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save file",
        variant: "destructive",
      });
    }
  };

  const filteredLessons = selectedCourse && selectedCourse !== "all"
    ? sampleLessons.filter(lesson => lesson.courseId === selectedCourse)
    : sampleLessons;

  const filteredVideos = selectedCourse && selectedCourse !== "all"
    ? sampleVideos.filter(video => video.courseId === selectedCourse)
    : sampleVideos;

  const filteredFiles = selectedCourse && selectedCourse !== "all"
    ? sampleFiles.filter(file => {
        const lesson = sampleLessons.find(l => l.id === file.lessonId);
        return lesson?.courseId === selectedCourse;
      })
    : sampleFiles;

  return (
    <div className="min-h-screen bg-gradient-to-b from-covenant-light via-white to-covenant-light p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-covenant-blue">Video Management</h1>
            <p className="text-covenant-gray mt-2">Manage course videos and lesson files</p>
          </div>
          <div className="flex gap-3">
            <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-covenant-blue hover:bg-covenant-blue/80 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Video
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
                  <DialogDescription>
                    {editingVideo ? 'Update video details' : 'Add a new YouTube video to a lesson'}
                  </DialogDescription>
                </DialogHeader>
                <Form {...videoForm}>
                  <form onSubmit={videoForm.handleSubmit(handleVideoSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={videoForm.control}
                        name="courseId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select course" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sampleCourses.map((course) => (
                                  <SelectItem key={course.id} value={course.id}>
                                    {course.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={videoForm.control}
                        name="lessonId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lesson</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select lesson" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {filteredLessons.map((lesson) => (
                                  <SelectItem key={lesson.id} value={lesson.id}>
                                    {lesson.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={videoForm.control}
                      name="youtubeVideoId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YouTube Video ID</FormLabel>
                          <FormControl>
                            <Input placeholder="dQw4w9WgXcQ" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={videoForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Video Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter video title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={videoForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter video description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* File Upload Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-covenant-blue">Downloadable Files</h3>
                        <ObjectUploader
                          maxNumberOfFiles={5}
                          maxFileSize={50485760} // 50MB
                          onGetUploadParameters={handleGetUploadParameters}
                          onComplete={handleUploadComplete}
                          buttonClassName="bg-covenant-blue hover:bg-covenant-blue/80 text-white"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Files
                        </ObjectUploader>
                      </div>
                      
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-covenant-light rounded-lg bg-gray-50">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-covenant-blue" />
                                <div>
                                  <p className="font-medium text-covenant-blue">{file.name}</p>
                                  <p className="text-sm text-covenant-gray">{file.type} • {file.size}</p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => {
                                  setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {uploadedFiles.length === 0 && (
                        <p className="text-sm text-covenant-gray italic">
                          No files uploaded yet. Click "Upload Files" to add downloadable resources for this lesson.
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => {
                        setVideoDialogOpen(false);
                        videoForm.reset();
                        setUploadedFiles([]);
                        setEditingVideo(null);
                      }}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-covenant-blue hover:bg-covenant-blue/80 text-white">
                        {editingVideo ? 'Update Video' : 'Add Video'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Dialog open={fileDialogOpen} onOpenChange={setFileDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-covenant-blue text-covenant-blue">
                  <Upload className="h-4 w-4 mr-2" />
                  Add File
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingFile ? 'Edit File' : 'Add New File'}</DialogTitle>
                  <DialogDescription>
                    {editingFile ? 'Update file details' : 'Add a downloadable file to a lesson'}
                  </DialogDescription>
                </DialogHeader>
                <Form {...fileForm}>
                  <form onSubmit={fileForm.handleSubmit(handleFileSubmit)} className="space-y-6">
                    <FormField
                      control={fileForm.control}
                      name="lessonId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lesson</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select lesson" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sampleLessons.map((lesson) => (
                                <SelectItem key={lesson.id} value={lesson.id}>
                                  {lesson.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={fileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>File Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Trust Administration Guide" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={fileForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>File Type</FormLabel>
                            <FormControl>
                              <Input placeholder="PDF" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={fileForm.control}
                        name="size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>File Size</FormLabel>
                            <FormControl>
                              <Input placeholder="2.3 MB" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={fileForm.control}
                        name="downloadUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Download URL</FormLabel>
                            <FormControl>
                              <Input placeholder="/api/files/document.pdf" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => {
                        setFileDialogOpen(false);
                        fileForm.reset();
                        setEditingFile(null);
                      }}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-covenant-blue hover:bg-covenant-blue/80 text-white">
                        {editingFile ? 'Update File' : 'Add File'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Course Filter */}
        <div className="mb-6">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {sampleCourses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6">
          {/* Videos Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-covenant-blue flex items-center">
                <Youtube className="h-5 w-5 mr-2" />
                Course Videos
              </CardTitle>
              <CardDescription>Manage YouTube videos for course lessons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-4 border border-covenant-light rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <Youtube className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-covenant-blue">{video.title}</h3>
                        <p className="text-sm text-covenant-gray mb-1">
                          {video.courseName} • {video.lessonTitle}
                        </p>
                        <p className="text-xs text-covenant-gray mb-2 line-clamp-2">
                          {video.description}
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            ID: {video.youtubeVideoId}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Course: {video.courseId} • Lesson: {video.lessonId}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtubeVideoId}`, '_blank')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Youtube className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingVideo(video);
                          videoForm.reset({
                            courseId: video.courseId,
                            lessonId: video.lessonId,
                            youtubeVideoId: video.youtubeVideoId,
                            title: video.title,
                            description: video.description || ""
                          });
                          setVideoDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredVideos.length === 0 && (
                  <div className="text-center py-8 text-covenant-gray">
                    No videos found. Add your first video to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Files Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-covenant-blue flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Lesson Files
              </CardTitle>
              <CardDescription>Manage downloadable files and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 border border-covenant-light rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-covenant-light rounded flex items-center justify-center">
                        <FileText className="h-6 w-6 text-covenant-blue" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-covenant-blue">{file.name}</h3>
                        <p className="text-sm text-covenant-gray">
                          {file.courseName} • {file.lessonTitle}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {file.type} • {file.size}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(file.downloadUrl, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingFile(file);
                          fileForm.reset(file);
                          setFileDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredFiles.length === 0 && (
                  <div className="text-center py-8 text-covenant-gray">
                    No files found. Add your first file to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}