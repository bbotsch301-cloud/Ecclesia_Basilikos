import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Clock, X } from "lucide-react";
import type { Video } from "@shared/schema";
import { usePageTitle } from "@/hooks/usePageTitle";

function getEmbedUrl(video: Video): string | null {
  if (video.embedUrl) {
    // If it's already an embed URL, use directly
    if (video.embedUrl.includes('/embed/')) return video.embedUrl;
    // Convert youtube.com/watch?v= or youtu.be/ to embed
    const ytMatch = video.embedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    // Vimeo
    const vimeoMatch = video.embedUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return video.embedUrl;
  }
  if (video.videoUrl) {
    const ytMatch = video.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    return null;
  }
  return null;
}

export default function Videos() {
  usePageTitle("Videos");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ['/api/videos/published'],
  });

  // Extract unique categories
  const categories = Array.from(new Set(videos.map(v => v.category))).sort();

  // Find featured video
  const featuredVideo = videos.find(v => v.isFeatured) || (videos.length > 0 ? videos[0] : null);

  // Filter videos
  const filteredVideos = selectedCategory === "all"
    ? videos
    : videos.filter(v => v.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-red-100 text-red-800",
      "bg-purple-100 text-purple-800",
      "bg-amber-100 text-amber-800",
      "bg-teal-100 text-teal-800",
    ];
    const idx = categories.indexOf(category);
    return colors[idx % colors.length] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="pt-16">
      <HeroSection
        title="Videos & Teachings"
        description="In-depth video teachings to guide you on your journey to covenant freedom"
        backgroundImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
      />

      <div className="py-20 bg-covenant-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-covenant-gold mx-auto mb-4"></div>
                <p className="text-gray-600">Loading videos...</p>
              </div>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-16">
              <Play className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Videos Coming Soon</h3>
              <p className="text-gray-600">
                We are preparing video teachings. Check back soon for new content.
              </p>
            </div>
          ) : (
            <>
              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  className={selectedCategory === "all" ? "bg-covenant-blue text-white" : "bg-white text-covenant-blue"}
                  onClick={() => setSelectedCategory("all")}
                >
                  All Videos
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={selectedCategory === category ? "bg-covenant-blue text-white" : "bg-white text-covenant-blue"}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Featured Video */}
              {featuredVideo && selectedCategory === "all" && (
                <div
                  className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12 cursor-pointer"
                  onClick={() => setSelectedVideo(featuredVideo)}
                >
                  <div className="aspect-video bg-gray-200 relative">
                    {featuredVideo.thumbnailUrl ? (
                      <img
                        src={featuredVideo.thumbnailUrl}
                        alt={featuredVideo.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <Play className="h-16 w-16 text-white/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button className="bg-covenant-gold hover:bg-yellow-500 text-covenant-blue rounded-full p-6 shadow-lg transform hover:scale-110 transition-all">
                        <Play size={32} />
                      </Button>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="font-playfair text-2xl font-bold text-covenant-blue mb-4">
                      {featuredVideo.title}
                    </h3>
                    {featuredVideo.description && (
                      <p className="text-covenant-gray leading-relaxed mb-4">
                        {featuredVideo.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {featuredVideo.duration && (
                        <div className="flex items-center text-sm text-covenant-gray">
                          <Clock size={16} className="mr-2" />
                          Duration: {featuredVideo.duration}
                        </div>
                      )}
                      <Badge className="bg-covenant-light text-covenant-blue">Featured</Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Video Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="aspect-video bg-gray-200 relative">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                          <Play className="h-10 w-10 text-white/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button className="bg-covenant-gold text-covenant-blue rounded-full p-4 shadow-lg">
                          <Play size={20} />
                        </Button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-playfair text-lg font-semibold text-covenant-blue mb-2">{video.title}</h4>
                      {video.description && (
                        <p className="text-covenant-gray text-sm mb-3 line-clamp-2">{video.description}</p>
                      )}
                      <div className="flex justify-between items-center text-xs text-covenant-gray">
                        {video.duration && (
                          <div className="flex items-center">
                            <Clock size={12} className="mr-1" />
                            {video.duration}
                          </div>
                        )}
                        <Badge className={getCategoryColor(video.category)}>
                          {video.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-playfair">
              {selectedVideo?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-4">
            {selectedVideo && (() => {
              const embed = getEmbedUrl(selectedVideo);
              if (embed) {
                return (
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src={embed}
                      title={selectedVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                );
              }
              return (
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="h-16 w-16 text-white/30 mx-auto mb-4" />
                    <p className="text-gray-400">Video coming soon</p>
                  </div>
                </div>
              );
            })()}
            {selectedVideo?.description && (
              <p className="text-covenant-gray mt-4">{selectedVideo.description}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
