import { useState, lazy, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/usePageTitle";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Mail,
  Plus,
  Send,
  Trash2,
  Edit2,
  Eye,
  Loader2,
  Users,
} from "lucide-react";

const RichTextEditor = lazy(() => import("@/components/RichTextEditor"));

interface Campaign {
  id: string;
  subject: string;
  body: string;
  status: string | null;
  sentAt: string | null;
  recipientCount: number | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

interface SubscriberData {
  subscribers: Array<{ id: string; email: string; subscribed_at: string }>;
  count: number;
}

export default function AdminNewsletter() {
  usePageTitle("Newsletter Campaigns");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showCreate, setShowCreate] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [previewCampaign, setPreviewCampaign] = useState<Campaign | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/admin/newsletter-campaigns"],
  });

  const { data: subscriberData } = useQuery<SubscriberData>({
    queryKey: ["/api/admin/newsletter-subscribers"],
  });

  const subscriberCount = subscriberData?.count || 0;

  const createMutation = useMutation({
    mutationFn: async (data: { subject: string; body: string }) => {
      const res = await apiRequest("POST", "/api/admin/newsletter-campaigns", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/newsletter-campaigns"] });
      setShowCreate(false);
      setSubject("");
      setBody("");
      toast({ title: "Campaign draft created" });
    },
    onError: () => {
      toast({ title: "Failed to create campaign", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { subject?: string; body?: string } }) => {
      const res = await apiRequest("PUT", `/api/admin/newsletter-campaigns/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/newsletter-campaigns"] });
      setEditingCampaign(null);
      setSubject("");
      setBody("");
      toast({ title: "Campaign updated" });
    },
    onError: () => {
      toast({ title: "Failed to update campaign", variant: "destructive" });
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/admin/newsletter-campaigns/${id}/send`);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/newsletter-campaigns"] });
      toast({ title: `Campaign sent to ${data.recipientCount} subscribers` });
    },
    onError: () => {
      toast({ title: "Failed to send campaign", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/admin/newsletter-campaigns/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/newsletter-campaigns"] });
      toast({ title: "Campaign deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete campaign", variant: "destructive" });
    },
  });

  const openEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setSubject(campaign.subject);
    setBody(campaign.body);
  };

  const handleSave = () => {
    if (editingCampaign) {
      updateMutation.mutate({ id: editingCampaign.id, data: { subject, body } });
    } else {
      createMutation.mutate({ subject, body });
    }
  };

  const isFormOpen = showCreate || !!editingCampaign;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Newsletter Campaigns</h1>
            <p className="text-gray-500 text-sm mt-1">
              <Users className="h-4 w-4 inline mr-1" />
              {subscriberCount} subscriber{subscriberCount !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            onClick={() => { setShowCreate(true); setSubject(""); setBody(""); setEditingCampaign(null); }}
            className="bg-covenant-blue hover:bg-covenant-blue/90 text-white"
          >
            <Plus className="h-4 w-4 mr-1" /> New Campaign
          </Button>
        </div>

        {/* Create/Edit Form */}
        {isFormOpen && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                {editingCampaign ? "Edit Campaign" : "New Campaign Draft"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Newsletter subject line..."
                  />
                </div>
                <div>
                  <Label>Body</Label>
                  <Suspense fallback={<div className="h-48 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
                    <RichTextEditor
                      content={body}
                      onChange={setBody}
                      placeholder="Write your newsletter content..."
                      minHeight="200px"
                    />
                  </Suspense>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={!subject.trim() || !body.trim() || createMutation.isPending || updateMutation.isPending}
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    )}
                    {editingCampaign ? "Update Draft" : "Save Draft"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => { setShowCreate(false); setEditingCampaign(null); setSubject(""); setBody(""); }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Campaign List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : campaigns.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No campaigns yet</h3>
              <p className="text-gray-500 text-sm">Create your first newsletter campaign to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 truncate">{campaign.subject}</h3>
                        <Badge
                          variant={campaign.status === "sent" ? "default" : "secondary"}
                          className={campaign.status === "sent" ? "bg-green-100 text-green-800" : ""}
                        >
                          {campaign.status === "sent" ? "Sent" : "Draft"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>Created {new Date(campaign.createdAt).toLocaleDateString()}</span>
                        {campaign.sentAt && (
                          <span>Sent {new Date(campaign.sentAt).toLocaleDateString()}</span>
                        )}
                        {campaign.recipientCount != null && (
                          <span>{campaign.recipientCount} recipients</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Preview */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setPreviewCampaign(campaign)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Preview: {campaign.subject}</DialogTitle>
                          </DialogHeader>
                          <div className="border rounded-lg p-6 mt-2">
                            <div dangerouslySetInnerHTML={{ __html: campaign.body }} />
                          </div>
                        </DialogContent>
                      </Dialog>

                      {campaign.status !== "sent" && (
                        <>
                          {/* Edit */}
                          <Button variant="ghost" size="sm" onClick={() => openEdit(campaign)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>

                          {/* Send */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                                <Send className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Send Campaign?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will send "{campaign.subject}" to {subscriberCount} subscriber{subscriberCount !== 1 ? "s" : ""}.
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => sendMutation.mutate(campaign.id)}
                                  disabled={sendMutation.isPending}
                                >
                                  {sendMutation.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                                  Send to {subscriberCount} subscribers
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          {/* Delete */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Campaign?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the draft campaign "{campaign.subject}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => deleteMutation.mutate(campaign.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}

                      {campaign.status === "sent" && (
                        /* Delete sent campaign */
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Campaign Record?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will delete the campaign record. The emails have already been sent.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => deleteMutation.mutate(campaign.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
