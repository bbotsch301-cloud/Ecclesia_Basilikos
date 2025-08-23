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

const sampleCourses = [
  { id: "1", title: "Trust Fundamentals" },
  { id: "2", title: "Advanced Trust Strategies" },
  { id: "3", title: "Estate Planning Mastery" },
];

const sampleLessons = [
  { id: "1", title: "Introduction to Biblical Trusts", courseId: "1" },
  { id: "2", title: "Legal Structures and Kingdom Authority", courseId: "1" },
  { id: "3", title: "Trustee Responsibilities", courseId: "1" },
];

export default function AdminVideos() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoData | null>(null);
  const [editingFile, setEditingFile] = useState<FileData | null>(null);

  // Remove admin authentication check for development
  // const { data: videos } = useQuery({ queryKey: ['/api/admin/videos'] });
  
  // Sample data - would come from API
  const sampleVideos: VideoData[] = [
    {
      id: "1",
      courseId: "1",
      lessonId: "1", 
      youtubeVideoId: "dQw4w9WgXcQ",
      title: "Introduction to Biblical Trusts",
      description: "Understanding the scriptural foundation of trust relationships",
      courseName: "Trust Fundamentals",
      lessonTitle: "Introduction to Biblical Trusts"
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

  const handleVideoSubmit = async (data: z.infer<typeof videoSchema>) => {
    try {
      // API call would go here
      toast({
        title: "Success",
        description: editingVideo ? "Video updated successfully" : "Video added successfully",
      });
      setVideoDialogOpen(false);
      videoForm.reset();
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

  const filteredLessons = selectedCourse 
    ? sampleLessons.filter(lesson => lesson.courseId === selectedCourse)
    : sampleLessons;

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

                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => {
                        setVideoDialogOpen(false);
                        videoForm.reset();
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
              <SelectItem value="">All Courses</SelectItem>
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
                {sampleVideos.map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-4 border border-covenant-light rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <Youtube className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-covenant-blue">{video.title}</h3>
                        <p className="text-sm text-covenant-gray">
                          {video.courseName} • {video.lessonTitle}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          ID: {video.youtubeVideoId}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingVideo(video);
                          videoForm.reset(video);
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
                {sampleVideos.length === 0 && (
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
                {sampleFiles.map((file) => (
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
                {sampleFiles.length === 0 && (
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