import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import RequireAuth from "@/components/RequireAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
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
import { User, Shield, Mail, Calendar, Save, Lock, Crown, CreditCard, Bell, Download, Trash2 } from "lucide-react";

function ProfileContent() {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  usePageTitle("Profile");

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [username, setUsername] = useState(user?.username || "");

  const [emailNotifications, setEmailNotifications] = useState(user?.emailNotifications !== false);

  // Sync form state when user data changes (e.g. after refetch)
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setUsername(user.username || "");
      setEmailNotifications(user.emailNotifications !== false);
    }
  }, [user]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const profileMutation = useMutation({
    mutationFn: async (data: { firstName?: string; lastName?: string; username?: string }) => {
      return await apiRequest("PATCH", "/api/auth/profile", data);
    },
    onSuccess: () => {
      toast({ title: "Profile updated", description: "Your profile has been saved." });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update profile", variant: "destructive" });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      return await apiRequest("POST", "/api/auth/change-password", data);
    },
    onSuccess: () => {
      toast({ title: "Password changed", description: "Your password has been updated." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to change password", variant: "destructive" });
    },
  });

  const notificationMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      return await apiRequest("PATCH", "/api/auth/profile", { emailNotifications: enabled });
    },
    onSuccess: () => {
      toast({ title: "Settings updated", description: "Email notification preference saved." });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: (error: any) => {
      // Revert the toggle on error
      setEmailNotifications((prev) => !prev);
      toast({ title: "Error", description: error.message || "Failed to update notification settings", variant: "destructive" });
    },
  });

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const response = await fetch("/api/auth/export-data", { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to export data");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user-data-export.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ title: "Data exported", description: "Your data has been downloaded." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to export data", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  const deleteAccountMutation = useMutation({
    mutationFn: async (password: string) => {
      return await apiRequest("DELETE", "/api/auth/delete-account", { password });
    },
    onSuccess: () => {
      toast({ title: "Account deleted", description: "Your account has been permanently deleted." });
      queryClient.clear();
      setLocation("/");
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete account", variant: "destructive" });
    },
  });

  const handleDeleteAccount = () => {
    if (!deletePassword) {
      toast({ title: "Error", description: "Please enter your password to confirm deletion", variant: "destructive" });
      return;
    }
    deleteAccountMutation.mutate(deletePassword);
    setDeleteDialogOpen(false);
    setDeletePassword("");
  };

  const handleToggleEmailNotifications = (checked: boolean) => {
    setEmailNotifications(checked);
    notificationMutation.mutate(checked);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileMutation.mutate({ firstName, lastName, username });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "New passwords do not match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: "Error", description: "New password must be at least 8 characters", variant: "destructive" });
      return;
    }
    passwordMutation.mutate({ currentPassword, newPassword });
  };

  if (!user) return null;

  const initials = `${(user.firstName || "")[0] || ""}${(user.lastName || "")[0] || ""}`.toUpperCase();
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Unknown";

  const roleBadgeColor: Record<string, string> = {
    admin: "bg-red-100 text-red-800",
    moderator: "bg-purple-100 text-purple-800",
    instructor: "bg-blue-100 text-blue-800",
    student: "bg-green-100 text-green-800",
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="bg-royal-navy text-white py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-royal-gold text-royal-navy text-xl font-cinzel font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-cinzel font-bold">{user.firstName} {user.lastName}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-blue-200 text-sm">{user.email}</span>
                <Badge className={roleBadgeColor[user.role || "student"] || "bg-gray-100 text-gray-800"}>
                  {(user.role || "student").charAt(0).toUpperCase() + (user.role || "student").slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Account Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" /> Account Information
            </CardTitle>
            <CardDescription>View and manage your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" /> Email
              </div>
              <div className="font-medium">{user.email}</div>

              <div className="flex items-center gap-2 text-gray-600">
                <Shield className="h-4 w-4" /> Role
              </div>
              <div className="font-medium capitalize">{user.role || "student"}</div>

              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" /> Member Since
              </div>
              <div className="font-medium">{memberSince}</div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Beneficial Interest
            </CardTitle>
            <CardDescription>Your current plan and billing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isPremium ? (
                  <Badge className="bg-royal-gold text-royal-navy">
                    <Crown className="w-3 h-3 mr-1" /> Royal Beneficiary
                  </Badge>
                ) : (
                  <Badge variant="outline">General Beneficiary</Badge>
                )}
                <span className="text-sm text-gray-500">
                  {isPremium ? "Full access to all content" : "Trust content access"}
                </span>
              </div>
              <Link href="/billing">
                <Button variant="outline" size="sm" className="font-cinzel text-xs">
                  {isPremium ? "Manage" : "Elevate Interest"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" /> Edit Profile
            </CardTitle>
            <CardDescription>Update your name and username</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <Button type="submit" className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel" disabled={profileMutation.isPending}>
                {profileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" /> Change Password
            </CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              </div>
              <Button type="submit" variant="outline" disabled={passwordMutation.isPending}>
                {passwordMutation.isPending ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notification Preferences Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" /> Notification Preferences
            </CardTitle>
            <CardDescription>Control how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications" className="text-sm font-medium">Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive email notifications for forum replies and other activity</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={emailNotifications}
                onCheckedChange={handleToggleEmailNotifications}
                disabled={notificationMutation.isPending}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" /> Data & Privacy
            </CardTitle>
            <CardDescription>Export your data or delete your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Download My Data</p>
                <p className="text-sm text-gray-500">Export all your data as a JSON file</p>
              </div>
              <Button variant="outline" onClick={handleExportData} disabled={isExporting}>
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exporting..." : "Download"}
              </Button>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Delete Account</p>
                  <p className="text-sm text-gray-500">Permanently delete your account and all associated data</p>
                </div>
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove all your data including enrollments, forum posts, and progress.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <Label htmlFor="deletePassword">Enter your password to confirm</Label>
                      <Input
                        id="deletePassword"
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Your current password"
                        className="mt-2"
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setDeletePassword("")}>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={deleteAccountMutation.isPending || !deletePassword}
                      >
                        {deleteAccountMutation.isPending ? "Deleting..." : "Delete My Account"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}
