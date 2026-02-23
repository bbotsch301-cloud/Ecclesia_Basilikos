import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import RequireAuth from "@/components/RequireAuth";
import { FileDropzone } from "@/components/proof-vault/FileDropzone";
import { VerificationResultDisplay, type VerificationResult } from "@/components/proof-vault/VerificationResultDisplay";
import {
  Shield,
  ArrowLeft,
  Loader2,
  Search,
} from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

function ProofVaultVerifyContent() {
  usePageTitle("Verify Proof");
  const { toast } = useToast();

  const [verifyFile, setVerifyFile] = useState<File | null>(null);
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<VerificationResult | null>(null);

  const isValidHash = /^[a-fA-F0-9]{64}$/.test(verifyHash);

  const verifyMutation = useMutation({
    mutationFn: async () => {
      if (verifyFile) {
        const formData = new FormData();
        formData.append("file", verifyFile);

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
          body: JSON.stringify({ sha256: verifyHash.toLowerCase() }),
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

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy py-12 md:py-16">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-royal-gold/20 text-royal-gold border-2 border-royal-gold font-semibold px-6 py-2 text-base backdrop-blur-sm">
            Verify
          </Badge>
          <h1 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            Verify a Proof
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Upload a file or paste a hash to check if it matches an existing timestamped proof.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/proof-vault">
          <Button variant="ghost" size="sm" className="mb-6 font-cinzel">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Proof Vault
          </Button>
        </Link>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-cinzel flex items-center gap-2">
              <Search className="w-5 h-5 text-royal-gold" />
              Verification Check
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div>
              <Label className="font-cinzel text-sm font-medium mb-2 block">
                Upload File to Verify
              </Label>
              <FileDropzone
                file={verifyFile}
                onFileSelect={(file) => {
                  setVerifyFile(file);
                  setVerifyHash("");
                  setVerifyResult(null);
                }}
                onFileClear={() => {
                  setVerifyFile(null);
                  setVerifyResult(null);
                }}
              />
            </div>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-gray-400 font-cinzel">OR</span>
              <Separator className="flex-1" />
            </div>

            {/* Hash Input */}
            <div>
              <Label className="font-cinzel text-sm font-medium mb-2 block">
                Paste SHA-256 Hash
              </Label>
              <Input
                placeholder="e.g., e3b0c44298fc1c149afbf4c8996fb924..."
                value={verifyHash}
                onChange={(e) => {
                  setVerifyHash(e.target.value.trim());
                  setVerifyFile(null);
                  setVerifyResult(null);
                }}
                className="font-mono text-sm"
                maxLength={64}
              />
              {verifyHash && !isValidHash && (
                <p className="text-sm text-red-500 mt-1">
                  Enter a valid 64-character hexadecimal SHA-256 hash
                </p>
              )}
            </div>

            <Button
              onClick={() => verifyMutation.mutate()}
              disabled={
                (!verifyFile && !isValidHash) || verifyMutation.isPending
              }
              className="w-full bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold py-6"
            >
              {verifyMutation.isPending ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Shield className="w-5 h-5 mr-2" />
              )}
              Verify
            </Button>

            {/* Result */}
            {verifyResult && (
              <VerificationResultDisplay
                result={verifyResult}
                showProofLink={true}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ProofVaultVerify() {
  return (
    <RequireAuth>
      <ProofVaultVerifyContent />
    </RequireAuth>
  );
}
