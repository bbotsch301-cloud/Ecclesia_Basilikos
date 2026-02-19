import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import RequireAuth from "@/components/RequireAuth";
import { StatusBadge } from "@/components/proof-vault/StatusBadge";
import { FileDropzone } from "@/components/proof-vault/FileDropzone";
import { VerificationResultDisplay, type VerificationResult } from "@/components/proof-vault/VerificationResultDisplay";
import { RelativeTime } from "@/components/proof-vault/RelativeTime";
import { ProofDetailSkeleton } from "@/components/proof-vault/ProofDetailSkeleton";
import type { Proof } from "@shared/schema";
import {
  Shield,
  ArrowLeft,
  Download,
  ArrowUpCircle,
  FileCheck,
  Hash,
  Clock,
  Copy,
  Loader2,
  Calendar,
  XCircle,
  Bitcoin,
} from "lucide-react";

interface ProofWithOtsInfo extends Proof {
  otsInfo?: {
    status: string;
    calendarUrls: string[];
    bitcoinAttestations: Array<{ blockHeight: number }>;
  };
}

function ProofVaultDetailContent() {
  const [, params] = useRoute("/proof-vault/proofs/:id");
  const proofId = params?.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Verification state
  const [verifyFile, setVerifyFile] = useState<File | null>(null);
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<VerificationResult | null>(null);
  const [showVerify, setShowVerify] = useState(true);

  const { data: proof, isLoading } = useQuery<ProofWithOtsInfo>({
    queryKey: [`/api/proof-vault/proofs/${proofId}`],
    enabled: !!proofId,
  });

  const upgradeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/proof-vault/proofs/${proofId}/upgrade`);
    },
    onSuccess: async (res) => {
      const data = await res.json();
      queryClient.invalidateQueries({
        queryKey: [`/api/proof-vault/proofs/${proofId}`],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/proof-vault/proofs"] });
      if (data.status === "confirmed") {
        toast({
          title: "Proof Confirmed!",
          description: data.message || "Your proof has been anchored to the Bitcoin blockchain.",
        });
      } else if (data.status === "pending") {
        toast({
          title: "Still Pending",
          description: data.message || "Not yet confirmed. Timestamps typically take a few hours.",
        });
      } else {
        toast({
          title: "Upgrade Issue",
          description: data.message || "Something went wrong during the upgrade check.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upgrade proof",
        variant: "destructive",
      });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async () => {
      if (verifyFile) {
        const formData = new FormData();
        formData.append("file", verifyFile);
        formData.append("proofId", proofId || "");

        const res = await fetch("/api/proof-vault/verify", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Verification failed");
        }

        return res.json();
      } else if (verifyHash) {
        const res = await fetch("/api/proof-vault/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sha256: verifyHash.toLowerCase(),
            proofId: proofId,
          }),
          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Verification failed");
        }

        return res.json();
      }
      throw new Error("Provide a file or hash to verify");
    },
    onSuccess: (data) => {
      setVerifyResult(data);
    },
    onError: (err: Error) => {
      toast({
        title: "Verification Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: `${label} copied to clipboard` });
  };

  if (isLoading) {
    return <ProofDetailSkeleton />;
  }

  if (!proof) {
    return (
      <div className="pt-16">
        <div className="max-w-lg mx-auto px-4 py-32 text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h2 className="font-cinzel text-2xl font-bold text-royal-navy dark:text-royal-gold mb-4">
            Proof Not Found
          </h2>
          <Link href="/proof-vault">
            <Button variant="outline" className="font-cinzel">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Proof Vault
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy py-10 md:py-14">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <StatusBadge status={proof.status} variant="detailed" />
          <h1 className="font-cinzel-decorative text-2xl md:text-3xl font-bold text-white mt-4 mb-2 leading-tight">
            {proof.label || proof.originalFilename || "Proof Receipt"}
          </h1>
          <p className="text-sm text-gray-300">
            Created{" "}
            {proof.createdAt ? (
              <RelativeTime date={proof.createdAt} className="text-gray-300" />
            ) : (
              "Unknown"
            )}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/proof-vault">
            <Button variant="ghost" size="sm" className="font-cinzel">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            {proof.status === "pending" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => upgradeMutation.mutate()}
                disabled={upgradeMutation.isPending}
                className="font-cinzel"
              >
                {upgradeMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ArrowUpCircle className="w-4 h-4 mr-2" />
                )}
                Upgrade Proof
              </Button>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={`/api/proof-vault/proofs/${proof.id}/bundle`}
                  download
                >
                  <Button size="sm" className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold">
                    <Download className="w-4 h-4 mr-2" />
                    Download Bundle
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                Downloads a ZIP containing your proof receipt, OTS proof file, and verification instructions.
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Zone 1: Primary Info - Hash & Status */}
          <Card className="royal-card">
            <CardHeader>
              <CardTitle className="font-cinzel flex items-center gap-2">
                <Shield className="w-5 h-5 text-royal-gold" />
                SHA-256 Hash
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <code className="font-mono text-sm bg-royal-navy/5 dark:bg-gray-800 p-3 rounded-lg flex-1 break-all border">
                  {proof.sha256}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(proof.sha256, "Hash")}
                  className="flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              {/* Status + Timestamp row */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <StatusBadge status={proof.status} variant="detailed" />
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {proof.createdAt ? (
                    <RelativeTime date={proof.createdAt} className="text-sm text-gray-500" />
                  ) : (
                    "Unknown"
                  )}
                </div>
              </div>

              {/* Proof ID */}
              <div className="flex items-center gap-2 pt-2 border-t">
                <Label className="text-xs text-gray-400 font-cinzel">Proof ID</Label>
                <code className="font-mono text-xs text-gray-500">{proof.id}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(proof.id, "Proof ID")}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Zone 2: File Metadata */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-cinzel text-base flex items-center gap-2">
                {proof.mode === "file" ? (
                  <FileCheck className="w-4 h-4 text-royal-gold" />
                ) : (
                  <Hash className="w-4 h-4 text-royal-gold" />
                )}
                File Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-gray-400 font-cinzel">Mode</Label>
                  <p className="font-medium capitalize mt-0.5">{proof.mode}</p>
                </div>

                <div>
                  <Label className="text-xs text-gray-400 font-cinzel">Provider</Label>
                  <p className="font-medium mt-0.5">OpenTimestamps</p>
                </div>

                {proof.originalFilename && (
                  <div>
                    <Label className="text-xs text-gray-400 font-cinzel">Original File</Label>
                    <p className="font-medium mt-0.5 truncate">{proof.originalFilename}</p>
                  </div>
                )}

                {proof.mimeType && (
                  <div>
                    <Label className="text-xs text-gray-400 font-cinzel">MIME Type</Label>
                    <p className="font-medium mt-0.5">{proof.mimeType}</p>
                  </div>
                )}

                {proof.sizeBytes && (
                  <div>
                    <Label className="text-xs text-gray-400 font-cinzel">File Size</Label>
                    <p className="font-medium mt-0.5">
                      {(proof.sizeBytes / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}

                {proof.lastUpgradeAttemptAt && (
                  <div>
                    <Label className="text-xs text-gray-400 font-cinzel">Last Upgrade</Label>
                    <div className="mt-0.5">
                      <RelativeTime date={proof.lastUpgradeAttemptAt} className="text-sm" />
                    </div>
                  </div>
                )}
              </div>

              {proof.label && (
                <div className="mt-4 pt-3 border-t">
                  <Label className="text-xs text-gray-400 font-cinzel">Label</Label>
                  <p className="text-sm mt-0.5">{proof.label}</p>
                </div>
              )}

              {proof.errorMessage && proof.status !== "confirmed" && (
                <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-700 dark:text-red-300">
                      <p className="font-medium">Error</p>
                      <p>{proof.errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Zone 3: Blockchain Details */}
          {proof.otsInfo && (proof.otsInfo.calendarUrls.length > 0 || proof.otsInfo.bitcoinAttestations.length > 0) && (
            <Card className="border-royal-gold/30">
              <CardHeader className="pb-3">
                <CardTitle className="font-cinzel text-base flex items-center gap-2">
                  <Bitcoin className="w-4 h-4 text-royal-gold" />
                  Blockchain Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {proof.otsInfo.bitcoinAttestations.length > 0 && (
                  <div>
                    <Label className="text-xs text-gray-400 font-cinzel">Bitcoin Block</Label>
                    <p className="font-mono font-medium text-green-600 mt-0.5">
                      #{proof.otsInfo.bitcoinAttestations[0].blockHeight}
                    </p>
                  </div>
                )}
                {proof.otsInfo.calendarUrls.length > 0 && (
                  <div>
                    <Label className="text-xs text-gray-400 font-cinzel">Calendar Servers</Label>
                    <div className="mt-1 space-y-1">
                      {proof.otsInfo.calendarUrls.map((url, i) => (
                        <p key={i} className="text-xs font-mono text-blue-600 break-all">{url}</p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pending Proof Info */}
          {proof.status === "pending" && (
            <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-cinzel font-bold text-yellow-700 dark:text-yellow-400 mb-1">
                      Awaiting Bitcoin Confirmation
                    </h3>
                    <p className="text-sm text-yellow-600 dark:text-yellow-300 mb-3">
                      Your proof has been submitted to OpenTimestamps calendar servers but is not yet
                      anchored to the Bitcoin blockchain. This typically takes a few hours. Click
                      "Check for Confirmation" to check.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => upgradeMutation.mutate()}
                      disabled={upgradeMutation.isPending}
                      className="border-yellow-400 text-yellow-700 hover:bg-yellow-100 font-cinzel"
                    >
                      {upgradeMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ArrowUpCircle className="w-4 h-4 mr-2" />
                      )}
                      Check for Confirmation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Verification Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-cinzel flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-royal-gold" />
                  Verify Against This Proof
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowVerify(!showVerify);
                    setVerifyResult(null);
                    setVerifyFile(null);
                    setVerifyHash("");
                  }}
                  className="font-cinzel"
                >
                  {showVerify ? "Hide" : "Show"}
                </Button>
              </div>
            </CardHeader>
            {showVerify && (
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload a file or paste a SHA-256 hash to verify it matches this proof.
                </p>

                <div>
                  <Label className="text-sm font-cinzel mb-2 block">Upload File</Label>
                  <FileDropzone
                    file={verifyFile}
                    onFileSelect={(file) => {
                      setVerifyFile(file);
                      setVerifyHash("");
                    }}
                    onFileClear={() => setVerifyFile(null)}
                    compact
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs text-gray-400 font-cinzel">OR</span>
                  <Separator className="flex-1" />
                </div>

                <div>
                  <Label className="text-sm font-cinzel mb-2 block">Paste SHA-256 Hash</Label>
                  <Input
                    placeholder="64-character hex hash"
                    value={verifyHash}
                    onChange={(e) => {
                      setVerifyHash(e.target.value.trim());
                      setVerifyFile(null);
                    }}
                    className="font-mono text-sm"
                    maxLength={64}
                  />
                </div>

                <Button
                  onClick={() => verifyMutation.mutate()}
                  disabled={
                    (!verifyFile && !/^[a-fA-F0-9]{64}$/.test(verifyHash)) ||
                    verifyMutation.isPending
                  }
                  className="w-full font-cinzel"
                  variant="outline"
                >
                  {verifyMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FileCheck className="w-4 h-4 mr-2" />
                  )}
                  Verify
                </Button>

                {verifyResult && (
                  <VerificationResultDisplay
                    result={verifyResult}
                    showProofLink={false}
                  />
                )}
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ProofVaultDetail() {
  return (
    <RequireAuth>
      <ProofVaultDetailContent />
    </RequireAuth>
  );
}
