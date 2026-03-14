import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Download,
  Printer,
  ChevronUp,
  ChevronDown,
  Variable,
  Loader2,
  Sparkles,
  ArrowLeft,
  Eye,
  Save,
  X,
} from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import { resolveEntity, resolveVariables, TEMPLATE_VARIABLES, buildVariableMap } from "@/lib/trust-variable-resolver";
import type {
  TrustDocumentTemplate,
  TrustTemplateSectionType,
  TrustDocument,
  TrustDocumentSection,
  TrustEntity,
  TrustRelationship,
} from "@shared/schema";

const LAYER_OPTIONS = [
  "covenant", "body", "stewardship", "assembly", "region", "household", "craft", "ministry", "member",
];

// ═══════════════════════════════════════════════════════════
// API HELPERS
// ═══════════════════════════════════════════════════════════

async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiPost<T>(url: string, body?: any): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiPut<T>(url: string, body: any): Promise<T> {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiDelete(url: string): Promise<void> {
  const res = await fetch(url, { method: "DELETE", credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
}

// ═══════════════════════════════════════════════════════════
// VARIABLE PALETTE — insert {{variable}} at cursor
// ═══════════════════════════════════════════════════════════

function VariablePalette({ onInsert }: { onInsert: (variable: string) => void }) {
  const grouped: Record<string, typeof TEMPLATE_VARIABLES> = {};
  for (const v of TEMPLATE_VARIABLES) {
    if (!grouped[v.category]) grouped[v.category] = [];
    grouped[v.category].push(v);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" type="button">
          <Variable className="w-3 h-3 mr-1" /> Variables
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 max-h-80 overflow-auto">
        {Object.entries(grouped).map(([cat, vars]) => (
          <div key={cat}>
            <DropdownMenuLabel className="text-xs">{cat}</DropdownMenuLabel>
            {vars.map(v => (
              <DropdownMenuItem key={v.key} onClick={() => onInsert(`{{${v.key}}}`)}>
                <code className="text-xs mr-2">{`{{${v.key}}}`}</code>
                <span className="text-xs text-muted-foreground">{v.label}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ═══════════════════════════════════════════════════════════
// TEMPLATES TAB
// ═══════════════════════════════════════════════════════════

type TemplateWithSections = TrustDocumentTemplate & { sections: TrustTemplateSectionType[] };

function TemplatesTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editing, setEditing] = useState<TemplateWithSections | null>(null);
  const [creating, setCreating] = useState(false);

  const { data: templates = [], isLoading } = useQuery<TemplateWithSections[]>({
    queryKey: ["/api/admin/trust-document-templates"],
    queryFn: () => apiGet("/api/admin/trust-document-templates"),
  });

  const seedMutation = useMutation({
    mutationFn: () => apiPost("/api/admin/trust-document-templates/seed"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-document-templates"] });
      toast({ title: "Templates seeded successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/api/admin/trust-document-templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-document-templates"] });
      toast({ title: "Template deleted" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  if (editing || creating) {
    return (
      <TemplateEditor
        template={editing}
        onClose={() => { setEditing(null); setCreating(false); }}
        onSaved={() => {
          queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-document-templates"] });
          setEditing(null);
          setCreating(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Document Templates</h3>
        <div className="flex gap-2">
          <Button onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending} variant="outline">
            {seedMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Sparkles className="w-4 h-4 mr-1" />}
            {templates.length === 0 ? "Seed Built-in Templates" : "Reseed Built-in Templates"}
          </Button>
          <Button onClick={() => setCreating(true)}>
            <Plus className="w-4 h-4 mr-1" /> New Template
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No templates yet. Click "Seed Built-in Templates" to create the default set.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {templates.map(t => (
            <Card key={t.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setEditing(t)}>
              <CardContent className="flex items-center justify-between py-3 px-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t.name}</span>
                    {t.isBuiltIn && <Badge variant="secondary" className="text-xs">Built-in</Badge>}
                    <Badge variant="outline" className="text-xs">{t.sections.length} sections</Badge>
                  </div>
                  <div className="flex gap-1 mt-1">
                    {(t.applicableLayers || []).map(l => (
                      <Badge key={l} variant="outline" className="text-xs capitalize">{l}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                  <Button size="icon" variant="ghost" onClick={() => setEditing(t)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  {!t.isBuiltIn && (
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(t.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE EDITOR
// ═══════════════════════════════════════════════════════════

function TemplateEditor({
  template,
  onClose,
  onSaved,
}: {
  template: TemplateWithSections | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const [name, setName] = useState(template?.name || "");
  const [description, setDescription] = useState(template?.description || "");
  const [layers, setLayers] = useState<string[]>(template?.applicableLayers || []);
  const [sections, setSections] = useState<{ title: string; contentTemplate: string }[]>(
    template?.sections.map(s => ({ title: s.title, contentTemplate: s.contentTemplate })) || [{ title: "", contentTemplate: "" }]
  );
  const [saving, setSaving] = useState(false);

  const toggleLayer = (layer: string) => {
    setLayers(prev => prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]);
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= sections.length) return;
    const arr = [...sections];
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    setSections(arr);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      let templateId = template?.id;
      if (template) {
        await apiPut(`/api/admin/trust-document-templates/${template.id}`, { name, description, applicableLayers: layers });
      } else {
        const created = await apiPost<TrustDocumentTemplate>("/api/admin/trust-document-templates", { name, description, applicableLayers: layers });
        templateId = created.id;
      }
      await apiPost(`/api/admin/trust-document-templates/${templateId}/sections`, {
        sections: sections.map((s, i) => ({ title: s.title, contentTemplate: s.contentTemplate, sortOrder: i })),
      });
      toast({ title: template ? "Template updated" : "Template created" });
      onSaved();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h3 className="text-lg font-semibold">{template ? "Edit Template" : "New Template"}</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Template Name</Label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Declaration of Trust" />
        </div>
        <div>
          <Label>Description</Label>
          <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description..." />
        </div>
      </div>

      <div>
        <Label>Applicable Layers</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {LAYER_OPTIONS.map(layer => (
            <Badge
              key={layer}
              variant={layers.includes(layer) ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => toggleLayer(layer)}
            >
              {layer}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Sections</h4>
          <Button size="sm" variant="outline" onClick={() => setSections([...sections, { title: "", contentTemplate: "" }])}>
            <Plus className="w-3 h-3 mr-1" /> Add Section
          </Button>
        </div>

        {sections.map((sec, idx) => (
          <Card key={idx}>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  value={sec.title}
                  onChange={e => {
                    const arr = [...sections];
                    arr[idx] = { ...arr[idx], title: e.target.value };
                    setSections(arr);
                  }}
                  placeholder="Section title..."
                  className="flex-1"
                />
                <VariablePalette onInsert={(v) => {
                  const arr = [...sections];
                  arr[idx] = { ...arr[idx], contentTemplate: arr[idx].contentTemplate + v };
                  setSections(arr);
                }} />
                <Button size="icon" variant="ghost" onClick={() => moveSection(idx, -1)} disabled={idx === 0}>
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => moveSection(idx, 1)} disabled={idx === sections.length - 1}>
                  <ChevronDown className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setSections(sections.filter((_, i) => i !== idx))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Textarea
                value={sec.contentTemplate}
                onChange={e => {
                  const arr = [...sections];
                  arr[idx] = { ...arr[idx], contentTemplate: e.target.value };
                  setSections(arr);
                }}
                placeholder="Section content with {{variables}}..."
                rows={4}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
          Save Template
        </Button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DOCUMENTS TAB
// ═══════════════════════════════════════════════════════════

type DocWithSections = TrustDocument & { sections: TrustDocumentSection[] };

function DocumentsTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingDoc, setEditingDoc] = useState<DocWithSections | null>(null);
  const [generateOpen, setGenerateOpen] = useState(false);

  const { data: documents = [], isLoading } = useQuery<DocWithSections[]>({
    queryKey: ["/api/admin/trust-documents"],
    queryFn: () => apiGet("/api/admin/trust-documents"),
  });

  const { data: trustStructure } = useQuery<{ entities: TrustEntity[]; relationships: TrustRelationship[] }>({
    queryKey: ["/api/admin/trust-structure"],
    queryFn: () => apiGet("/api/admin/trust-structure"),
  });
  const entities = trustStructure?.entities || [];
  const relationships = trustStructure?.relationships || [];

  const { data: templates = [] } = useQuery<TemplateWithSections[]>({
    queryKey: ["/api/admin/trust-document-templates"],
    queryFn: () => apiGet("/api/admin/trust-document-templates"),
  });

  const generateAllMutation = useMutation({
    mutationFn: () => apiPost<{ generated: number }>("/api/admin/trust-documents/generate-all"),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-document-templates"] });
      toast({ title: `Generated ${data.generated} documents for all entities` });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/api/admin/trust-documents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-documents"] });
      toast({ title: "Document deleted" });
    },
  });

  if (editingDoc) {
    return (
      <DocumentEditor
        document={editingDoc}
        entities={entities}
        relationships={relationships}
        templates={templates}
        onClose={() => setEditingDoc(null)}
        onUpdated={() => {
          queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-documents"] });
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Generated Documents</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => generateAllMutation.mutate()} disabled={generateAllMutation.isPending}>
            {generateAllMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Sparkles className="w-4 h-4 mr-1" />}
            Generate All
          </Button>
          <Button onClick={() => setGenerateOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Generate Document
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No documents yet. Generate one from a template and entity.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {documents.map(doc => {
            const entity = entities.find(e => e.id === doc.entityId);
            const template = templates.find(t => t.id === doc.templateId);
            return (
              <Card key={doc.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setEditingDoc(doc)}>
                <CardContent className="flex items-center justify-between py-3 px-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{doc.title}</span>
                      <Badge variant={doc.status === 'final' ? 'default' : 'secondary'} className="text-xs capitalize">{doc.status}</Badge>
                      <Badge variant="outline" className="text-xs">v{doc.version}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {entity?.name || 'Unknown entity'} {template ? `| ${template.name}` : ''}
                    </div>
                  </div>
                  <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    <Button size="icon" variant="ghost" onClick={() => setEditingDoc(doc)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(doc.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {generateOpen && (
        <GenerateDocumentDialog
          open={generateOpen}
          onClose={() => setGenerateOpen(false)}
          entities={entities}
          relationships={relationships}
          templates={templates}
          onGenerated={(doc) => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-documents"] });
            setGenerateOpen(false);
            setEditingDoc(doc);
          }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// GENERATE DOCUMENT DIALOG
// ═══════════════════════════════════════════════════════════

function GenerateDocumentDialog({
  open,
  onClose,
  entities,
  relationships,
  templates,
  onGenerated,
}: {
  open: boolean;
  onClose: () => void;
  entities: TrustEntity[];
  relationships: TrustRelationship[];
  templates: TemplateWithSections[];
  onGenerated: (doc: DocWithSections) => void;
}) {
  const { toast } = useToast();
  const [entityId, setEntityId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [generating, setGenerating] = useState(false);

  const selectedEntity = entities.find(e => e.id === entityId);
  const filteredTemplates = templates.filter(t =>
    !selectedEntity || (t.applicableLayers || []).includes(selectedEntity.layer)
  );

  const handleGenerate = async () => {
    if (!entityId || !templateId) return;
    const entity = entities.find(e => e.id === entityId);
    const template = templates.find(t => t.id === templateId);
    if (!entity || !template) return;

    setGenerating(true);
    try {
      const resolved = resolveEntity(entity, entities, relationships);
      const resolvedSections = template.sections.map(s => ({
        title: s.title,
        content: resolveVariables(s.contentTemplate, resolved),
        sortOrder: s.sortOrder || 0,
      }));

      const doc = await apiPost<DocWithSections>("/api/admin/trust-documents/generate", {
        entityId,
        templateId,
        title: template.name,
        subtitle: entity.name,
        sections: resolvedSections,
      });
      toast({ title: "Document generated" });
      onGenerated(doc);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>Entity</Label>
            <Select value={entityId} onValueChange={v => { setEntityId(v); setTemplateId(""); }}>
              <SelectTrigger><SelectValue placeholder="Select entity..." /></SelectTrigger>
              <SelectContent>
                {entities.map(e => (
                  <SelectItem key={e.id} value={e.id}>{e.name} ({e.layer})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Template</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger><SelectValue placeholder="Select template..." /></SelectTrigger>
              <SelectContent>
                {filteredTemplates.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleGenerate} disabled={!entityId || !templateId || generating}>
            {generating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Sparkles className="w-4 h-4 mr-1" />}
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════════
// DOCUMENT EDITOR
// ═══════════════════════════════════════════════════════════

function DocumentEditor({
  document: doc,
  entities,
  relationships,
  templates,
  onClose,
  onUpdated,
}: {
  document: DocWithSections;
  entities: TrustEntity[];
  relationships: TrustRelationship[];
  templates: TemplateWithSections[];
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { toast } = useToast();
  const [status, setStatus] = useState(doc.status || "draft");
  const [resetConfirm, setResetConfirm] = useState(false);
  const [localSections, setLocalSections] = useState(doc.sections);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const entity = entities.find(e => e.id === doc.entityId);
  const template = templates.find(t => t.id === doc.templateId);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    try {
      await apiPut(`/api/admin/trust-documents/${doc.id}`, { status: newStatus });
      onUpdated();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleSectionUpdate = useCallback((sectionId: string, content: string) => {
    setLocalSections(prev => prev.map(s => s.id === sectionId ? { ...s, content } : s));
    if (saveTimers.current[sectionId]) clearTimeout(saveTimers.current[sectionId]);
    saveTimers.current[sectionId] = setTimeout(async () => {
      try {
        await apiPut(`/api/admin/trust-documents/${doc.id}/sections/${sectionId}`, { content });
      } catch (err: any) {
        toast({ title: "Auto-save failed", description: err.message, variant: "destructive" });
      }
    }, 1000);
  }, [doc.id, toast]);

  const handleReset = async () => {
    if (!template || !entity) return;
    try {
      const resolved = resolveEntity(entity, entities, relationships);
      const resolvedSections = template.sections.map(s => ({
        title: s.title,
        content: resolveVariables(s.contentTemplate, resolved),
        sortOrder: s.sortOrder || 0,
      }));
      const updated = await apiPost<DocWithSections>(`/api/admin/trust-documents/${doc.id}/reset`, { sections: resolvedSections });
      setLocalSections(updated.sections);
      toast({ title: `Document reset to v${updated.version}` });
      setResetConfirm(false);
      onUpdated();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold">{doc.title}</h3>
          <p className="text-sm text-muted-foreground">{entity?.name} | v{doc.version}</p>
        </div>
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="final">Final</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        {template && (
          <Button variant="outline" size="sm" onClick={() => setResetConfirm(true)}>
            <RefreshCw className="w-4 h-4 mr-1" /> Reset to Template
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {localSections.map(section => (
          <Card key={section.id}>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm font-medium">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <RichTextEditor
                content={section.content}
                onChange={(html) => handleSectionUpdate(section.id, html)}
                minHeight="100px"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {resetConfirm && (
        <Dialog open={resetConfirm} onOpenChange={setResetConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Document?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              This will re-resolve all sections from the template with current entity data. The version will be incremented and all edits will be lost.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setResetConfirm(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleReset}>Reset</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EXPORT TAB
// ═══════════════════════════════════════════════════════════

function ExportTab() {
  const [selectedDocId, setSelectedDocId] = useState("");

  const { data: documents = [] } = useQuery<DocWithSections[]>({
    queryKey: ["/api/admin/trust-documents"],
    queryFn: () => apiGet("/api/admin/trust-documents"),
  });

  const selectedDoc = documents.find(d => d.id === selectedDocId);

  const getDocumentHtml = (doc: DocWithSections) => {
    return `<!DOCTYPE html>
<html>
<head>
  <title>${doc.title} — ${doc.subtitle || ''}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap');
    body {
      font-family: 'Crimson Pro', 'Georgia', serif;
      max-width: 8.5in;
      margin: 0.75in auto;
      padding: 0 0.5in;
      color: #1a1a1a;
      font-size: 12pt;
      line-height: 1.6;
    }
    h1 {
      font-family: 'Cinzel', serif;
      text-align: center;
      font-size: 18pt;
      letter-spacing: 0.15em;
      margin-bottom: 4pt;
      text-transform: uppercase;
    }
    .doc-subtitle {
      font-family: 'Cinzel', serif;
      text-align: center;
      font-size: 14pt;
      color: #444;
      margin-bottom: 24pt;
    }
    .section-title {
      font-family: 'Cinzel', serif;
      font-size: 11pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border-bottom: 1px solid #ccc;
      padding-bottom: 4pt;
      margin-top: 20pt;
      margin-bottom: 10pt;
    }
    .section-content {
      white-space: pre-wrap;
      margin-bottom: 12pt;
    }
    .separator {
      border: none;
      border-top: 2px solid #1E3A5F;
      margin: 16pt 30%;
    }
    @media print {
      body { margin: 0; padding: 0.5in; }
    }
  </style>
</head>
<body>
  <h1>${doc.title}</h1>
  <div class="doc-subtitle">${doc.subtitle || ''}</div>
  <hr class="separator" />
  ${doc.sections.map(s => `<div class="section-title">${s.title}</div>\n  <div class="section-content">${s.content}</div>`).join('\n  ')}
</body>
</html>`;
  };

  const handlePrint = () => {
    if (!selectedDoc) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(getDocumentHtml(selectedDoc));
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  const handleDownload = () => {
    if (!selectedDoc) return;
    const html = getDocumentHtml(selectedDoc);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = (selectedDoc.subtitle || selectedDoc.title).replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
    a.href = url;
    a.download = `${safeName}.html`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label>Select Document</Label>
          <Select value={selectedDocId} onValueChange={setSelectedDocId}>
            <SelectTrigger><SelectValue placeholder="Choose a document..." /></SelectTrigger>
            <SelectContent>
              {documents.map(d => (
                <SelectItem key={d.id} value={d.id}>{d.title} — {d.subtitle || ''} (v{d.version})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedDoc && (
          <div className="flex gap-2 pt-5">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1" /> Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-1" /> Download HTML
            </Button>
          </div>
        )}
      </div>

      {selectedDoc && (
        <Card>
          <CardContent className="py-6">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-center text-xl font-bold tracking-widest uppercase mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                {selectedDoc.title}
              </h1>
              <div className="text-center text-lg text-muted-foreground mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
                {selectedDoc.subtitle}
              </div>
              <Separator className="my-4 w-2/5 mx-auto" />
              {selectedDoc.sections.map((s, i) => (
                <div key={i} className="mb-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider border-b pb-1 mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                    {s.title}
                  </h3>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: s.content }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════

export default function AdminTrustDocuments() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Trust Documents</h1>
          <p className="text-muted-foreground">Create, edit, and export legal instruments for trust entities.</p>
        </div>

        <Tabs defaultValue="templates">
          <TabsList className="mb-4">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="templates">
            <TemplatesTab />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsTab />
          </TabsContent>

          <TabsContent value="export">
            <ExportTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
