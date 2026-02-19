import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import type { Proof } from "@shared/schema";
import {
  Shield,
  Plus,
  Search,
  RefreshCw,
  FileCheck,
  Hash,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  ArrowUpCircle,
  Lock,
  LogIn,
} from "lucide-react";

function StatusBadge({ status }: { status: string | null }) {
  switch (status) {
    case "confirmed":
      return (
        <Badge className="bg-green-100 text-green-700 border-green-300">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Confirmed
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "failed":
      return (
        <Badge className="bg-red-100 text-red-700 border-red-300">
          <XCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      );
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}

export default function ProofVault() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: proofsList = [], isLoading } = useQuery<Proof[]>({
    queryKey: ["/api/proof-vault/proofs"],
    enabled: isAuthenticated,
  });

  const upgradeAllMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/proof-vault/proofs/upgrade-all");
    },
    onSuccess: async (res) => {
      const data = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/proof-vault/proofs"] });
      toast({
        title: "Upgrade Complete",
        description: data.message,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upgrade proofs",
        variant: "destructive",
      });
    },
  });

  if (authLoading) {
    return (
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-royal-gold" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="pt-16">
        <div className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy py-16 md:py-24">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-4 bg-royal-gold/20 text-royal-gold border-2 border-royal-gold font-semibold px-6 py-2 text-base backdrop-blur-sm">
              Time-Sealed Records
            </Badge>
            <h1 className="font-cinzel-decorative text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Proof Vault
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Create verifiable timestamps for your important documents, anchored to the Bitcoin blockchain.
            </p>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <Lock className="w-16 h-16 text-royal-gold mx-auto mb-6" />
          <h2 className="font-cinzel text-2xl font-bold text-royal-navy dark:text-royal-gold mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please log in to access Proof Vault and manage your timestamped proofs.
          </p>
          <Link href="/">
            <Button className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold">
              <LogIn className="w-4 h-4 mr-2" />
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredProofs = proofsList.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return (
        p.sha256.toLowerCase().includes(s) ||
        p.originalFilename?.toLowerCase().includes(s) ||
        p.label?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const pendingCount = proofsList.filter((p) => p.status === "pending").length;
  const confirmedCount = proofsList.filter((p) => p.status === "confirmed").length;

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy py-16 md:py-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-royal-gold/20 text-royal-gold border-2 border-royal-gold font-semibold px-6 py-2 text-base backdrop-blur-sm">
            Time-Sealed Records
          </Badge>
          <h1 className="font-cinzel-decorative text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Proof Vault
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Create verifiable timestamps for your important documents, anchored to the Bitcoin blockchain via OpenTimestamps.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats + Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-royal-navy dark:text-royal-gold">{proofsList.length}</span> total
              {pendingCount > 0 && (
                <span className="ml-3">
                  <span className="font-semibold text-yellow-600">{pendingCount}</span> pending
                </span>
              )}
              {confirmedCount > 0 && (
                <span className="ml-3">
                  <span className="font-semibold text-green-600">{confirmedCount}</span> confirmed
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => upgradeAllMutation.mutate()}
                disabled={upgradeAllMutation.isPending}
                className="font-cinzel"
              >
                {upgradeAllMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ArrowUpCircle className="w-4 h-4 mr-2" />
                )}
                Upgrade Pending
              </Button>
            )}
            <Link href="/proof-vault/verify">
              <Button variant="outline" size="sm" className="font-cinzel">
                <FileCheck className="w-4 h-4 mr-2" />
                Verify
              </Button>
            </Link>
            <Link href="/proof-vault/new">
              <Button size="sm" className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold">
                <Plus className="w-4 h-4 mr-2" />
                New Proof
              </Button>
            </Link>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by hash, filename, or label..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["all", "pending", "confirmed", "failed"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-full text-xs font-cinzel font-medium transition-all ${
                  statusFilter === s
                    ? "bg-royal-gold text-royal-navy shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-royal-navy/50 dark:text-gray-300"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Proofs list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-royal-gold" />
          </div>
        ) : filteredProofs.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <Shield className="w-12 h-12 text-royal-gold mx-auto mb-4" />
              <h3 className="font-cinzel text-xl font-bold text-royal-navy dark:text-royal-gold mb-2">
                {proofsList.length === 0 ? "No Proofs Yet" : "No Matching Proofs"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {proofsList.length === 0
                  ? "Create your first timestamped proof to get started."
                  : "Try adjusting your search or filters."}
              </p>
              {proofsList.length === 0 && (
                <Link href="/proof-vault/new">
                  <Button className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Proof
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProofs.map((proof) => (
              <Link key={proof.id} href={`/proof-vault/proofs/${proof.id}`}>
                <Card className="hover:border-royal-gold/50 hover:shadow-md transition-all cursor-pointer group">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-royal-gold/10 group-hover:bg-royal-gold/20 transition-colors">
                        {proof.mode === "file" ? (
                          <FileCheck className="w-5 h-5 text-royal-gold" />
                        ) : (
                          <Hash className="w-5 h-5 text-royal-gold" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-cinzel font-semibold text-royal-navy dark:text-gray-200 text-sm truncate">
                            {proof.label || proof.originalFilename || `Hash proof`}
                          </h3>
                          <StatusBadge status={proof.status} />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <code className="font-mono truncate max-w-[200px] sm:max-w-[300px]">
                            {proof.sha256}
                          </code>
                          <span className="hidden sm:inline">
                            {proof.createdAt
                              ? new Date(proof.createdAt).toLocaleDateString()
                              : ""}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {proof.mode}
                          </Badge>
                        </div>
                      </div>
                      <Eye className="w-4 h-4 text-gray-400 group-hover:text-royal-gold transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
