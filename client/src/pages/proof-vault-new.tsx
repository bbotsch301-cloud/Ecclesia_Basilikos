import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import RequireAuth from "@/components/RequireAuth";
import { FileDropzone } from "@/components/proof-vault/FileDropzone";
import {
  Hash,
  Shield,
  ArrowLeft,
  FileUp,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const PROGRESS_MESSAGES = [
  "Computing file hash...",
  "Submitting to OpenTimestamps...",
  "Finalizing proof...",
];

function ProofVaultNewContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  // File mode state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileLabel, setFileLabel] = useState("");

  // Hash mode state
  const [hashInput, setHashInput] = useState("");
  const [hashLabel, setHashLabel] = useState("");

  // Progress message rotation
  const [progressIndex, setProgressIndex] = useState(0);

  const isValidHash = /^[a-fA-F0-9]{64}$/.test(hashInput);

  const createFileProofMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error("No file selected");

      const formData = new FormData();
      formData.append("file", selectedFile);
      if (fileLabel) formData.append("label", fileLabel);

      const res = await fetch("/api/proof-vault/proofs", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create proof");
      }

      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/proof-vault/proofs"] });
      toast({
        title: "Proof Created",
        description: "Your file has been timestamped. The proof is pending Bitcoin confirmation.",
      });
      navigate(`/proof-vault/proofs/${data.id}`);
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const createHashProofMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/proof-vault/proofs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sha256: hashInput.toLowerCase(),
          label: hashLabel || undefined,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create proof");
      }

      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/proof-vault/proofs"] });
      toast({
        title: "Proof Created",
        description: "Your hash has been timestamped. The proof is pending Bitcoin confirmation.",
      });
      navigate(`/proof-vault/proofs/${data.id}`);
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const isPending = createFileProofMutation.isPending || createHashProofMutation.isPending;

  // Rotate progress messages while pending
  useEffect(() => {
    if (!isPending) {
      setProgressIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setProgressIndex((prev) => Math.min(prev + 1, PROGRESS_MESSAGES.length - 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [isPending]);

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy py-12 md:py-16">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-royal-gold/20 text-royal-gold border-2 border-royal-gold font-semibold px-6 py-2 text-base backdrop-blur-sm">
            New Proof
          </Badge>
          <h1 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            Create Time-Sealed Proof
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Upload a file or submit a hash to create a verifiable timestamp proof anchored to Bitcoin.
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

        <Card className="shadow-lg border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="font-cinzel flex items-center gap-2">
              <Shield className="w-5 h-5 text-royal-gold" />
              Choose Proof Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="file">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="file" className="flex-1 font-cinzel">
                  <FileUp className="w-4 h-4 mr-2" />
                  File Upload
                </TabsTrigger>
                <TabsTrigger value="hash" className="flex-1 font-cinzel">
                  <Hash className="w-4 h-4 mr-2" />
                  Hash Only
                </TabsTrigger>
              </TabsList>

              {/* File Upload Tab */}
              <TabsContent value="file" className="space-y-6">
                <div>
                  <Label className="font-cinzel text-sm font-medium mb-2 block">
                    Select File
                  </Label>
                  <FileDropzone
                    file={selectedFile}
                    onFileSelect={setSelectedFile}
                    onFileClear={() => setSelectedFile(null)}
                  />
                </div>

                <div>
                  <Label htmlFor="file-label" className="font-cinzel text-sm font-medium mb-2 block">
                    Label (optional)
                  </Label>
                  <Input
                    id="file-label"
                    placeholder="e.g., 'Q1 Financial Report' or 'Contract v3'"
                    value={fileLabel}
                    onChange={(e) => setFileLabel(e.target.value)}
                    maxLength={200}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <p className="font-medium mb-1">How it works</p>
                      <p>
                        Your file's SHA-256 hash will be computed and submitted to OpenTimestamps
                        calendar servers. The file itself is not stored on our servers. Keep your
                        original file safe for future verification.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => createFileProofMutation.mutate()}
                  disabled={!selectedFile || isPending}
                  className="w-full bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold py-6"
                >
                  {createFileProofMutation.isPending ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Shield className="w-5 h-5 mr-2" />
                  )}
                  {createFileProofMutation.isPending
                    ? PROGRESS_MESSAGES[progressIndex]
                    : "Create Timestamp Proof"}
                </Button>
              </TabsContent>

              {/* Hash Only Tab */}
              <TabsContent value="hash" className="space-y-6">
                <div>
                  <Label htmlFor="hash-input" className="font-cinzel text-sm font-medium mb-2 block">
                    SHA-256 Hash
                  </Label>
                  <Input
                    id="hash-input"
                    placeholder="e.g., e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
                    value={hashInput}
                    onChange={(e) => setHashInput(e.target.value.trim())}
                    className="font-mono text-sm"
                    maxLength={64}
                  />
                  {hashInput && !isValidHash && (
                    <p className="text-sm text-red-500 mt-1">
                      Enter a valid 64-character hexadecimal SHA-256 hash
                    </p>
                  )}
                  {hashInput && isValidHash && (
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Valid SHA-256 hash
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="hash-label" className="font-cinzel text-sm font-medium mb-2 block">
                    Label (optional)
                  </Label>
                  <Input
                    id="hash-label"
                    placeholder="Description for this proof"
                    value={hashLabel}
                    onChange={(e) => setHashLabel(e.target.value)}
                    maxLength={200}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <p className="font-medium mb-1">Hash-only mode</p>
                      <p>
                        Submit a pre-computed SHA-256 hash directly. Useful when you want to
                        timestamp data without uploading the file. You can generate a hash locally:
                      </p>
                      <code className="block mt-2 bg-blue-100 dark:bg-blue-900/40 p-2 rounded text-xs">
                        sha256sum yourfile.pdf
                      </code>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => createHashProofMutation.mutate()}
                  disabled={!isValidHash || isPending}
                  className="w-full bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold py-6"
                >
                  {createHashProofMutation.isPending ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Shield className="w-5 h-5 mr-2" />
                  )}
                  {createHashProofMutation.isPending
                    ? PROGRESS_MESSAGES[progressIndex]
                    : "Create Timestamp Proof"}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ProofVaultNew() {
  return (
    <RequireAuth>
      <ProofVaultNewContent />
    </RequireAuth>
  );
}
