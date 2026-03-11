import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  Crown,
  Shield,
  Building2,
  Users,
  Globe,
  MapPin,
  Sprout,
  FolderOpen,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  ArrowDown,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import AdminLayout from "@/components/layout/admin-layout";
import { usePageTitle } from "@/hooks/usePageTitle";
import type { TrustEntity, TrustRelationship } from "@shared/schema";

interface TrustStructureData {
  entities: TrustEntity[];
  relationships: TrustRelationship[];
}

const LAYER_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: typeof Crown }> = {
  charter:     { label: "Charter",     color: "text-amber-800",   bg: "bg-amber-50",    border: "border-amber-300", icon: Crown },
  trust:       { label: "Trust",       color: "text-blue-800",    bg: "bg-blue-50",     border: "border-blue-300",  icon: Shield },
  operational: { label: "Operational", color: "text-emerald-800", bg: "bg-emerald-50",  border: "border-emerald-300", icon: Building2 },
  pma:         { label: "PMA",         color: "text-purple-800",  bg: "bg-purple-50",   border: "border-purple-300", icon: Users },
  platform:    { label: "Platform",    color: "text-indigo-800",  bg: "bg-indigo-50",   border: "border-indigo-300", icon: Globe },
  chapter:     { label: "Chapter",     color: "text-orange-800",  bg: "bg-orange-50",   border: "border-orange-300", icon: MapPin },
  commune:     { label: "Commune",     color: "text-green-800",   bg: "bg-green-50",    border: "border-green-300", icon: Sprout },
  project:     { label: "Project",     color: "text-gray-800",    bg: "bg-gray-50",     border: "border-gray-300",  icon: FolderOpen },
};

const RELATIONSHIP_COLORS: Record<string, string> = {
  authority: "text-red-600 bg-red-50 border-red-200",
  grants: "text-gray-900 bg-gray-50 border-gray-200",
  funds: "text-blue-600 bg-blue-50 border-blue-200",
  land: "text-green-600 bg-green-50 border-green-200",
  remits: "text-purple-600 bg-purple-50 border-purple-200",
  establishes_pma: "text-purple-500 bg-purple-50 border-purple-200",
  oversees: "text-orange-600 bg-orange-50 border-orange-200",
  coordinates: "text-gray-500 bg-gray-50 border-gray-200",
};

const LAYERS_ORDER = ['charter', 'trust', 'operational', 'pma', 'platform', 'chapter', 'commune', 'project'];

function EntityCard({ entity, relationships, allEntities, onEdit, onDelete }: {
  entity: TrustEntity;
  relationships: TrustRelationship[];
  allEntities: TrustEntity[];
  onEdit: (entity: TrustEntity) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const config = LAYER_CONFIG[entity.layer] || LAYER_CONFIG.project;
  const Icon = config.icon;

  const outgoing = relationships.filter(r => r.fromEntityId === entity.id);
  const incoming = relationships.filter(r => r.toEntityId === entity.id);
  const getEntityName = (id: string) => allEntities.find(e => e.id === id)?.name || "Unknown";

  return (
    <div className={`rounded-lg border-2 ${config.border} ${config.bg} p-4 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`p-2 rounded-lg ${config.bg} ${config.color} border ${config.border} shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className={`font-cinzel font-bold text-sm ${config.color} truncate`}>{entity.name}</h4>
            {entity.subtitle && <p className="text-xs text-gray-500 mt-0.5">{entity.subtitle}</p>}
            <Badge variant="outline" className={`mt-1 text-[10px] ${config.color} ${config.border}`}>
              {config.label}
            </Badge>
            {entity.status === 'planned' && (
              <Badge variant="outline" className="ml-1 mt-1 text-[10px] text-yellow-700 border-yellow-300">
                Planned
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(entity)}>
            <Edit className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-700" onClick={() => onDelete(entity.id)}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {entity.description && (
        <p className="text-xs text-gray-600 mt-2 line-clamp-2">{entity.description}</p>
      )}

      {/* Metadata row */}
      <div className="flex flex-wrap gap-2 mt-2 text-[10px] text-gray-500">
        {entity.trusteeLabel && <span>Trustee: {entity.trusteeLabel}</span>}
        {entity.location && <span>Location: {entity.location}</span>}
        {entity.acreage && <span>Acreage: {entity.acreage}</span>}
        {entity.memberCount !== null && entity.memberCount! > 0 && <span>Members: {entity.memberCount}</span>}
      </div>

      {/* Relationships toggle */}
      {(outgoing.length > 0 || incoming.length > 0) && (
        <div className="mt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-700"
          >
            {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            {outgoing.length + incoming.length} relationship{outgoing.length + incoming.length !== 1 ? 's' : ''}
          </button>
          {expanded && (
            <div className="mt-1 space-y-1 text-[10px]">
              {outgoing.map(r => (
                <div key={r.id} className={`flex items-center gap-1 px-2 py-0.5 rounded border ${RELATIONSHIP_COLORS[r.relationshipType] || ''}`}>
                  <ArrowDown className="w-2.5 h-2.5" />
                  <span className="font-medium">{r.relationshipType.replace('_', ' ')}</span>
                  <span>→</span>
                  <span className="truncate">{getEntityName(r.toEntityId)}</span>
                </div>
              ))}
              {incoming.map(r => (
                <div key={r.id} className={`flex items-center gap-1 px-2 py-0.5 rounded border opacity-60 ${RELATIONSHIP_COLORS[r.relationshipType] || ''}`}>
                  <ArrowDown className="w-2.5 h-2.5 rotate-180" />
                  <span className="truncate">{getEntityName(r.fromEntityId)}</span>
                  <span>→</span>
                  <span className="font-medium">{r.relationshipType.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminTrustStructure() {
  usePageTitle("Trust Structure | Admin");
  const { toast } = useToast();
  const [editEntity, setEditEntity] = useState<TrustEntity | null>(null);
  const [showAddEntity, setShowAddEntity] = useState(false);
  const [showAddRelationship, setShowAddRelationship] = useState(false);

  // Form state for new entity
  const [newEntity, setNewEntity] = useState({
    name: "", subtitle: "", layer: "chapter" as string, entityType: "community",
    description: "", trusteeLabel: "", protectorLabel: "", location: "", acreage: "",
    status: "active", charter: "", legalBasis: "", notes: "",
  });

  // Form state for new relationship
  const [newRel, setNewRel] = useState({
    fromEntityId: "", toEntityId: "", relationshipType: "authority" as string, label: "", notes: "",
  });

  const { data, isLoading, error } = useQuery<TrustStructureData>({
    queryKey: ["/api/admin/trust-structure"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const seedMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/trust-structure/seed"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-structure"] });
      toast({ title: "Trust structure seeded", description: "Default entities and relationships created." });
    },
    onError: (err: Error) => toast({ title: "Seed failed", description: err.message, variant: "destructive" }),
  });

  const createEntityMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => apiRequest("POST", "/api/admin/trust-entities", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-structure"] });
      setShowAddEntity(false);
      setNewEntity({ name: "", subtitle: "", layer: "chapter", entityType: "community", description: "", trusteeLabel: "", protectorLabel: "", location: "", acreage: "", status: "active", charter: "", legalBasis: "", notes: "" });
      toast({ title: "Entity created" });
    },
    onError: (err: Error) => toast({ title: "Create failed", description: err.message, variant: "destructive" }),
  });

  const updateEntityMutation = useMutation({
    mutationFn: ({ id, ...data }: Record<string, unknown>) => apiRequest("PUT", `/api/admin/trust-entities/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-structure"] });
      setEditEntity(null);
      toast({ title: "Entity updated" });
    },
    onError: (err: Error) => toast({ title: "Update failed", description: err.message, variant: "destructive" }),
  });

  const deleteEntityMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/trust-entities/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-structure"] });
      toast({ title: "Entity deleted" });
    },
    onError: (err: Error) => toast({ title: "Delete failed", description: err.message, variant: "destructive" }),
  });

  const createRelMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => apiRequest("POST", "/api/admin/trust-relationships", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-structure"] });
      setShowAddRelationship(false);
      setNewRel({ fromEntityId: "", toEntityId: "", relationshipType: "authority", label: "", notes: "" });
      toast({ title: "Relationship created" });
    },
    onError: (err: Error) => toast({ title: "Create failed", description: err.message, variant: "destructive" }),
  });

  const deleteRelMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/trust-relationships/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-structure"] });
      toast({ title: "Relationship deleted" });
    },
    onError: (err: Error) => toast({ title: "Delete failed", description: err.message, variant: "destructive" }),
  });

  const entities = data?.entities || [];
  const relationships = data?.relationships || [];

  const handleDelete = (id: string) => {
    if (confirm("Delete this trust entity and all its relationships?")) {
      deleteEntityMutation.mutate(id);
    }
  };

  const entitiesByLayer = LAYERS_ORDER.map(layer => ({
    layer,
    config: LAYER_CONFIG[layer],
    entities: entities.filter(e => e.layer === layer).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
  })).filter(g => g.entities.length > 0);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-royal-gold" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
            </Link>
            <div>
              <h1 className="font-cinzel text-2xl font-bold text-royal-navy">Trust Structure</h1>
              <p className="text-sm text-gray-500">Hierarchical trust entity model — 8-layer architecture</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {entities.length === 0 && (
              <Button onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending} className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel">
                <RefreshCw className={`w-4 h-4 mr-2 ${seedMutation.isPending ? 'animate-spin' : ''}`} />
                Seed Default Structure
              </Button>
            )}
            <Button onClick={() => setShowAddEntity(true)} variant="outline" className="font-cinzel">
              <Plus className="w-4 h-4 mr-2" /> Add Entity
            </Button>
            <Button onClick={() => setShowAddRelationship(true)} variant="outline" className="font-cinzel">
              <LinkIcon className="w-4 h-4 mr-2" /> Add Relationship
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-royal-navy">{entities.length}</p>
              <p className="text-xs text-gray-500">Total Entities</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-royal-navy">{relationships.length}</p>
              <p className="text-xs text-gray-500">Relationships</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-royal-navy">{entitiesByLayer.length}</p>
              <p className="text-xs text-gray-500">Active Layers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-royal-navy">{entities.filter(e => e.status === 'active').length}</p>
              <p className="text-xs text-gray-500">Active Entities</p>
            </CardContent>
          </Card>
        </div>

        {/* Layer legend */}
        <div className="flex flex-wrap gap-2 mb-6">
          {LAYERS_ORDER.map(layer => {
            const cfg = LAYER_CONFIG[layer];
            const count = entities.filter(e => e.layer === layer).length;
            return (
              <Badge key={layer} variant="outline" className={`${cfg.color} ${cfg.border} ${cfg.bg} text-xs`}>
                {cfg.label} ({count})
              </Badge>
            );
          })}
        </div>

        {/* Empty state */}
        {entities.length === 0 && (
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center">
              <Crown className="w-12 h-12 mx-auto text-royal-gold mb-4" />
              <h3 className="font-cinzel text-lg font-bold text-royal-navy mb-2">No Trust Entities Yet</h3>
              <p className="text-gray-500 mb-4">Seed the default trust structure to get started with the 8-layer hierarchy.</p>
              <Button onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending} className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel">
                <RefreshCw className={`w-4 h-4 mr-2 ${seedMutation.isPending ? 'animate-spin' : ''}`} />
                Seed Default Structure
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Hierarchical visualization */}
        <div className="space-y-6">
          {entitiesByLayer.map(({ layer, config, entities: layerEntities }, layerIdx) => (
            <div key={layer}>
              {/* Layer header */}
              <div className={`flex items-center gap-2 mb-3 pb-2 border-b-2 ${config.border}`}>
                <div className={`w-3 h-3 rounded-full ${config.bg} border-2 ${config.border}`} />
                <h2 className={`font-cinzel font-bold text-lg ${config.color}`}>
                  Layer {layerIdx + 1}: {config.label}
                </h2>
                <span className="text-xs text-gray-400 ml-2">({layerEntities.length} entit{layerEntities.length === 1 ? 'y' : 'ies'})</span>
              </div>

              {/* Entity cards grid */}
              <div className={`grid gap-3 ${
                layerEntities.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' :
                layerEntities.length <= 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
                'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
                {layerEntities.map(entity => (
                  <EntityCard
                    key={entity.id}
                    entity={entity}
                    relationships={relationships}
                    allEntities={entities}
                    onEdit={setEditEntity}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Connection arrow between layers */}
              {layerIdx < entitiesByLayer.length - 1 && (
                <div className="flex justify-center py-3">
                  <div className="flex flex-col items-center text-gray-300">
                    <div className="w-px h-4 bg-gray-300" />
                    <ArrowDown className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Relationship summary table */}
        {relationships.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="font-cinzel text-lg">All Relationships</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {relationships.map(rel => {
                  const from = entities.find(e => e.id === rel.fromEntityId);
                  const to = entities.find(e => e.id === rel.toEntityId);
                  const colors = RELATIONSHIP_COLORS[rel.relationshipType] || "";
                  return (
                    <div key={rel.id} className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded text-xs border ${colors}`}>
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="font-medium truncate">{from?.name || "?"}</span>
                        <span className="text-gray-400">→</span>
                        <Badge variant="outline" className="text-[10px] shrink-0">{rel.relationshipType.replace('_', ' ')}</Badge>
                        <span className="text-gray-400">→</span>
                        <span className="font-medium truncate">{to?.name || "?"}</span>
                        {rel.label && <span className="text-gray-400 truncate">({rel.label})</span>}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-400 hover:text-red-600 shrink-0"
                        onClick={() => { if (confirm("Delete this relationship?")) deleteRelMutation.mutate(rel.id); }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Entity Dialog */}
        <Dialog open={showAddEntity} onOpenChange={setShowAddEntity}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-cinzel">Add Trust Entity</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Name *</Label>
                <Input value={newEntity.name} onChange={e => setNewEntity(s => ({ ...s, name: e.target.value }))} placeholder="Entity name" />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input value={newEntity.subtitle} onChange={e => setNewEntity(s => ({ ...s, subtitle: e.target.value }))} placeholder="Short subtitle" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Layer *</Label>
                  <Select value={newEntity.layer} onValueChange={v => setNewEntity(s => ({ ...s, layer: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {LAYERS_ORDER.map(l => (
                        <SelectItem key={l} value={l}>{LAYER_CONFIG[l].label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Entity Type *</Label>
                  <Input value={newEntity.entityType} onChange={e => setNewEntity(s => ({ ...s, entityType: e.target.value }))} placeholder="trust, pma, community..." />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={newEntity.description} onChange={e => setNewEntity(s => ({ ...s, description: e.target.value }))} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Trustee</Label>
                  <Input value={newEntity.trusteeLabel} onChange={e => setNewEntity(s => ({ ...s, trusteeLabel: e.target.value }))} />
                </div>
                <div>
                  <Label>Protector</Label>
                  <Input value={newEntity.protectorLabel} onChange={e => setNewEntity(s => ({ ...s, protectorLabel: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Location</Label>
                  <Input value={newEntity.location} onChange={e => setNewEntity(s => ({ ...s, location: e.target.value }))} />
                </div>
                <div>
                  <Label>Acreage</Label>
                  <Input value={newEntity.acreage} onChange={e => setNewEntity(s => ({ ...s, acreage: e.target.value }))} />
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={newEntity.status} onValueChange={v => setNewEntity(s => ({ ...s, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="dissolved">Dissolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Charter / Purpose</Label>
                <Textarea value={newEntity.charter} onChange={e => setNewEntity(s => ({ ...s, charter: e.target.value }))} rows={2} />
              </div>
              <div>
                <Label>Legal Basis</Label>
                <Input value={newEntity.legalBasis} onChange={e => setNewEntity(s => ({ ...s, legalBasis: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddEntity(false)}>Cancel</Button>
              <Button
                onClick={() => createEntityMutation.mutate(newEntity)}
                disabled={!newEntity.name || !newEntity.layer || createEntityMutation.isPending}
                className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel"
              >
                Create Entity
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Entity Dialog */}
        <Dialog open={!!editEntity} onOpenChange={(open) => !open && setEditEntity(null)}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-cinzel">Edit Trust Entity</DialogTitle>
            </DialogHeader>
            {editEntity && (
              <div className="space-y-3">
                <div>
                  <Label>Name</Label>
                  <Input value={editEntity.name} onChange={e => setEditEntity(s => s ? { ...s, name: e.target.value } : null)} />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input value={editEntity.subtitle || ""} onChange={e => setEditEntity(s => s ? { ...s, subtitle: e.target.value } : null)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Layer</Label>
                    <Select value={editEntity.layer} onValueChange={v => setEditEntity(s => s ? { ...s, layer: v as TrustEntity['layer'] } : null)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {LAYERS_ORDER.map(l => (
                          <SelectItem key={l} value={l}>{LAYER_CONFIG[l].label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Entity Type</Label>
                    <Input value={editEntity.entityType} onChange={e => setEditEntity(s => s ? { ...s, entityType: e.target.value } : null)} />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={editEntity.description || ""} onChange={e => setEditEntity(s => s ? { ...s, description: e.target.value } : null)} rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Trustee</Label>
                    <Input value={editEntity.trusteeLabel || ""} onChange={e => setEditEntity(s => s ? { ...s, trusteeLabel: e.target.value } : null)} />
                  </div>
                  <div>
                    <Label>Protector</Label>
                    <Input value={editEntity.protectorLabel || ""} onChange={e => setEditEntity(s => s ? { ...s, protectorLabel: e.target.value } : null)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Location</Label>
                    <Input value={editEntity.location || ""} onChange={e => setEditEntity(s => s ? { ...s, location: e.target.value } : null)} />
                  </div>
                  <div>
                    <Label>Acreage</Label>
                    <Input value={editEntity.acreage || ""} onChange={e => setEditEntity(s => s ? { ...s, acreage: e.target.value } : null)} />
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={editEntity.status || "active"} onValueChange={v => setEditEntity(s => s ? { ...s, status: v } : null)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="dissolved">Dissolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Charter / Purpose</Label>
                  <Textarea value={editEntity.charter || ""} onChange={e => setEditEntity(s => s ? { ...s, charter: e.target.value } : null)} rows={2} />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditEntity(null)}>Cancel</Button>
              <Button
                onClick={() => editEntity && updateEntityMutation.mutate({ id: editEntity.id, name: editEntity.name, subtitle: editEntity.subtitle, layer: editEntity.layer, entityType: editEntity.entityType, description: editEntity.description, trusteeLabel: editEntity.trusteeLabel, protectorLabel: editEntity.protectorLabel, location: editEntity.location, acreage: editEntity.acreage, status: editEntity.status, charter: editEntity.charter, legalBasis: editEntity.legalBasis, notes: editEntity.notes })}
                disabled={updateEntityMutation.isPending}
                className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Relationship Dialog */}
        <Dialog open={showAddRelationship} onOpenChange={setShowAddRelationship}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-cinzel">Add Relationship</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>From Entity *</Label>
                <Select value={newRel.fromEntityId} onValueChange={v => setNewRel(s => ({ ...s, fromEntityId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select source entity" /></SelectTrigger>
                  <SelectContent>
                    {entities.map(e => (
                      <SelectItem key={e.id} value={e.id}>{e.name} ({LAYER_CONFIG[e.layer]?.label})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Relationship Type *</Label>
                <Select value={newRel.relationshipType} onValueChange={v => setNewRel(s => ({ ...s, relationshipType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="authority">Authority</SelectItem>
                    <SelectItem value="grants">Grants</SelectItem>
                    <SelectItem value="funds">Funds</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="remits">Remits</SelectItem>
                    <SelectItem value="establishes_pma">Establishes PMA</SelectItem>
                    <SelectItem value="oversees">Oversees</SelectItem>
                    <SelectItem value="coordinates">Coordinates</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>To Entity *</Label>
                <Select value={newRel.toEntityId} onValueChange={v => setNewRel(s => ({ ...s, toEntityId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select target entity" /></SelectTrigger>
                  <SelectContent>
                    {entities.map(e => (
                      <SelectItem key={e.id} value={e.id}>{e.name} ({LAYER_CONFIG[e.layer]?.label})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Label</Label>
                <Input value={newRel.label} onChange={e => setNewRel(s => ({ ...s, label: e.target.value }))} placeholder="Optional label" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddRelationship(false)}>Cancel</Button>
              <Button
                onClick={() => createRelMutation.mutate(newRel)}
                disabled={!newRel.fromEntityId || !newRel.toEntityId || createRelMutation.isPending}
                className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel"
              >
                Create Relationship
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
