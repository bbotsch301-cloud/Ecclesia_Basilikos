import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import RequireAuth from "@/components/RequireAuth";
import { StatusBadge } from "@/components/proof-vault/StatusBadge";
import { HashDisplay } from "@/components/proof-vault/HashDisplay";
import { RelativeTime } from "@/components/proof-vault/RelativeTime";
import { ProofCardSkeleton } from "@/components/proof-vault/ProofCardSkeleton";
import type { Proof } from "@shared/schema";
import {
  Shield,
  Plus,
  Search,
  FileCheck,
  Hash,
  Clock,
  CheckCircle2,
  Loader2,
  Eye,
  ArrowUpCircle,
} from "lucide-react";

function ProofVaultContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: proofsList = [], isLoading } = useQuery<Proof[]>({
    queryKey: ["/api/proof-vault/proofs"],
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

  const statusAccent = (status: string | null) => {
    switch (status) {
      case "confirmed": return "border-l-4 border-l-green-400";
      case "pending": return "border-l-4 border-l-yellow-400";
      case "failed": return "border-l-4 border-l-red-400";
      default: return "border-l-4 border-l-gray-300";
    }
  };

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
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <Card className="border-l-4 border-l-royal-gold">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-royal-gold/10">
                <Shield className="w-5 h-5 text-royal-gold" />
              </div>
              <div>
                <p className="font-cinzel text-2xl font-bold text-royal-navy dark:text-royal-gold">
                  {proofsList.length}
                </p>
                <p className="text-xs text-gray-500 font-cinzel">Total Proofs</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-400">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-cinzel text-2xl font-bold text-yellow-600">
                  {pendingCount}
                </p>
                <p className="text-xs text-gray-500 font-cinzel">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-400">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-cinzel text-2xl font-bold text-green-600">
                  {confirmedCount}
                </p>
                <p className="text-xs text-gray-500 font-cinzel">Confirmed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mb-6">
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
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProofCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProofs.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              className="text-center max-w-md"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <Shield className="w-12 h-12 text-royal-gold mx-auto mb-4" />
              </motion.div>
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
            </motion.div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProofs.map((proof) => (
              <Link key={proof.id} href={`/proof-vault/proofs/${proof.id}`}>
                <Card className={`royal-card cursor-pointer group ${statusAccent(proof.status)}`}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-royal-gold/10 group-hover:bg-royal-gold/20 transition-colors flex-shrink-0">
                        {proof.mode === "file" ? (
                          <FileCheck className="w-5 h-5 text-royal-gold" />
                        ) : (
                          <Hash className="w-5 h-5 text-royal-gold" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-cinzel font-semibold text-royal-navy dark:text-gray-200 text-sm truncate">
                            {proof.label || proof.originalFilename || "Hash proof"}
                          </h3>
                          <StatusBadge status={proof.status} />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <HashDisplay hash={proof.sha256} className="text-xs" />
                          {proof.createdAt && (
                            <RelativeTime
                              date={proof.createdAt}
                              className="hidden sm:inline text-xs text-gray-500 dark:text-gray-400"
                            />
                          )}
                        </div>
                      </div>
                      <Eye className="w-4 h-4 text-gray-400 group-hover:text-royal-gold transition-colors flex-shrink-0" />
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

export default function ProofVault() {
  return (
    <RequireAuth>
      <ProofVaultContent />
    </RequireAuth>
  );
}
