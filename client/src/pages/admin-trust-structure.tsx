import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
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
  Loader2,
  Link as LinkIcon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  MousePointer2,
  GitBranch,
  X,
  Layers,
  Copy,
  GripVertical,
  Check,
  Circle,
  ArrowRight,
  Zap,
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

// ═══════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════

const LAYER_CONFIG: Record<string, {
  label: string;
  subtitle: string;
  nodeColor: string;
  nodeBorder: string;
  nodeText: string;
  nodeBg: string;
  icon: typeof Crown;
  defaultEntityType: string;
}> = {
  charter: {
    label: "Constitutional",
    subtitle: "Philosophy & Divine Authority",
    nodeColor: "bg-amber-700",
    nodeBorder: "border-amber-500",
    nodeText: "text-amber-50",
    nodeBg: "bg-amber-800/90",
    icon: Crown,
    defaultEntityType: "charter",
  },
  trust: {
    label: "Governance",
    subtitle: "Mission Anchor & Stewardship",
    nodeColor: "bg-slate-700",
    nodeBorder: "border-slate-500",
    nodeText: "text-slate-50",
    nodeBg: "bg-slate-800/90",
    icon: Shield,
    defaultEntityType: "trust",
  },
  operational: {
    label: "Structural",
    subtitle: "Operational Trust Layer",
    nodeColor: "bg-teal-700",
    nodeBorder: "border-teal-500",
    nodeText: "text-teal-50",
    nodeBg: "bg-teal-800/90",
    icon: Building2,
    defaultEntityType: "operational",
  },
  pma: {
    label: "Participating",
    subtitle: "Private Membership Associations",
    nodeColor: "bg-rose-700",
    nodeBorder: "border-rose-500",
    nodeText: "text-rose-50",
    nodeBg: "bg-rose-800/90",
    icon: Users,
    defaultEntityType: "pma",
  },
  platform: {
    label: "Platform",
    subtitle: "Digital Infrastructure",
    nodeColor: "bg-indigo-700",
    nodeBorder: "border-indigo-500",
    nodeText: "text-indigo-50",
    nodeBg: "bg-indigo-800/90",
    icon: Globe,
    defaultEntityType: "platform",
  },
  chapter: {
    label: "Chapter",
    subtitle: "Regional Governance",
    nodeColor: "bg-orange-700",
    nodeBorder: "border-orange-500",
    nodeText: "text-orange-50",
    nodeBg: "bg-orange-800/90",
    icon: MapPin,
    defaultEntityType: "chapter",
  },
  commune: {
    label: "Community",
    subtitle: "Local Stewardship Units",
    nodeColor: "bg-emerald-700",
    nodeBorder: "border-emerald-500",
    nodeText: "text-emerald-50",
    nodeBg: "bg-emerald-800/90",
    icon: Sprout,
    defaultEntityType: "community",
  },
  project: {
    label: "Project",
    subtitle: "Specific Initiatives",
    nodeColor: "bg-gray-600",
    nodeBorder: "border-gray-400",
    nodeText: "text-gray-50",
    nodeBg: "bg-gray-700/90",
    icon: FolderOpen,
    defaultEntityType: "project",
  },
};

const RELATIONSHIP_CONFIG: Record<string, {
  label: string;
  color: string;
  strokeColor: string;
  dashed: boolean;
}> = {
  authority:       { label: "Authority",       color: "bg-red-500",     strokeColor: "#ef4444", dashed: false },
  grants:          { label: "Grants",          color: "bg-gray-700",    strokeColor: "#374151", dashed: false },
  funds:           { label: "Funds",           color: "bg-blue-500",    strokeColor: "#3b82f6", dashed: false },
  land:            { label: "Land",            color: "bg-green-500",   strokeColor: "#22c55e", dashed: false },
  remits:          { label: "Remits",          color: "bg-purple-500",  strokeColor: "#a855f7", dashed: false },
  establishes_pma: { label: "Establishes PMA", color: "bg-purple-400",  strokeColor: "#c084fc", dashed: true },
  oversees:        { label: "Oversees",        color: "bg-orange-400",  strokeColor: "#fb923c", dashed: true },
  coordinates:     { label: "Coordinates",     color: "bg-gray-400",    strokeColor: "#9ca3af", dashed: true },
};

const LAYERS_ORDER = ['charter', 'trust', 'operational', 'pma', 'platform', 'chapter', 'commune', 'project'];

// ── Quick templates per layer ──
interface EntityTemplate {
  name: string;
  subtitle: string;
  entityType: string;
}

const LAYER_TEMPLATES: Record<string, EntityTemplate[]> = {
  charter: [
    { name: "New Covenant Legacy Trust", subtitle: "Constitutional Root", entityType: "charter" },
    { name: "Covenant Charter", subtitle: "Divine Authority Foundation", entityType: "charter" },
  ],
  trust: [
    { name: "Governance Trust", subtitle: "Governance Anchor", entityType: "trust" },
    { name: "Stewardship Trust", subtitle: "Mission Administration", entityType: "trust" },
  ],
  operational: [
    { name: "Land Trust", subtitle: "Stewardship of Land", entityType: "operational" },
    { name: "Housing Trust", subtitle: "Shelter & Dwellings", entityType: "operational" },
    { name: "Treasury Trust", subtitle: "Finance & Allocation", entityType: "operational" },
    { name: "Enterprise Trust", subtitle: "Commerce & Revenue", entityType: "operational" },
    { name: "Education Trust", subtitle: "Knowledge & Training", entityType: "operational" },
  ],
  pma: [
    { name: "Local PMA", subtitle: "Membership · Local", entityType: "pma" },
    { name: "Regional PMA", subtitle: "Membership · Regional", entityType: "pma" },
  ],
  platform: [
    { name: "Platform Trust", subtitle: "Digital Infrastructure", entityType: "platform" },
  ],
  chapter: [
    { name: "Regional Chapter", subtitle: "Regional Governance", entityType: "chapter" },
  ],
  commune: [
    { name: "Heaven's Gate", subtitle: "Community Unit", entityType: "community" },
    { name: "Commune", subtitle: "Local Stewardship", entityType: "community" },
  ],
  project: [
    { name: "Project", subtitle: "Initiative", entityType: "project" },
  ],
};

// ═══════════════════════════════════════════════════════════
// CONNECTION LINES (SVG)
// ═══════════════════════════════════════════════════════════

interface LineData {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  type: string;
}

function ConnectionLines({
  lines,
  activeFilter,
  tempLine,
}: {
  lines: LineData[];
  activeFilter: string | null;
  tempLine: { fromX: number; fromY: number; toX: number; toY: number } | null;
}) {
  const filtered = activeFilter
    ? lines.filter(l => l.type === activeFilter)
    : lines;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <defs>
        {Object.entries(RELATIONSHIP_CONFIG).map(([type, cfg]) => (
          <marker
            key={type}
            id={`arrow-${type}`}
            viewBox="0 0 10 7"
            refX="10"
            refY="3.5"
            markerWidth="8"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={cfg.strokeColor} />
          </marker>
        ))}
        <marker
          id="arrow-temp"
          viewBox="0 0 10 7"
          refX="10"
          refY="3.5"
          markerWidth="8"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#22d3ee" />
        </marker>
      </defs>

      {filtered.map((line) => {
        const cfg = RELATIONSHIP_CONFIG[line.type];
        if (!cfg) return null;
        const cp1Y = line.fromY + Math.min(Math.abs(line.toX - line.fromX) * 0.3, 40) + 10;
        const cp2Y = line.toY - Math.min(Math.abs(line.toX - line.fromX) * 0.3, 40) - 10;
        const path = `M ${line.fromX} ${line.fromY} C ${line.fromX} ${cp1Y}, ${line.toX} ${cp2Y}, ${line.toX} ${line.toY}`;
        return (
          <path
            key={line.id}
            d={path}
            fill="none"
            stroke={cfg.strokeColor}
            strokeWidth={2.5}
            strokeDasharray={cfg.dashed ? "8,4" : "none"}
            markerEnd={`url(#arrow-${line.type})`}
            opacity={0.85}
          />
        );
      })}

      {/* Temporary line while dragging a connection */}
      {tempLine && (
        <line
          x1={tempLine.fromX}
          y1={tempLine.fromY}
          x2={tempLine.toX}
          y2={tempLine.toY}
          stroke="#22d3ee"
          strokeWidth={2}
          strokeDasharray="6,3"
          markerEnd="url(#arrow-temp)"
          opacity={0.9}
        />
      )}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// ENTITY NODE (with connection handle, clone, drag)
// ═══════════════════════════════════════════════════════════

function EntityNode({
  entity,
  isSelected,
  isConnecting,
  connectFrom,
  onClick,
  onEdit,
  onDelete,
  onClone,
  onStartConnect,
  onDragStart,
}: {
  entity: TrustEntity;
  isSelected: boolean;
  isConnecting: boolean;
  connectFrom: string | null;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onClone: () => void;
  onStartConnect: (entityId: string) => void;
  onDragStart: (e: React.DragEvent, entity: TrustEntity) => void;
}) {
  const config = LAYER_CONFIG[entity.layer] || LAYER_CONFIG.project;

  return (
    <div
      data-entity-id={entity.id}
      data-layer={entity.layer}
      draggable
      onDragStart={(e) => onDragStart(e, entity)}
      onClick={onClick}
      className={`
        relative group cursor-pointer select-none
        rounded-xl border-2 px-5 py-3 min-w-[160px] max-w-[220px]
        transition-all duration-200 ease-out
        ${config.nodeBg} ${config.nodeBorder} ${config.nodeText}
        ${isSelected ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900 scale-105 shadow-lg shadow-yellow-400/20' : ''}
        ${isConnecting && connectFrom !== entity.id ? 'hover:ring-2 hover:ring-cyan-400 hover:ring-offset-2 hover:ring-offset-gray-900' : ''}
        ${!isConnecting ? 'hover:scale-105 hover:shadow-lg' : ''}
      `}
    >
      {/* Drag grip */}
      <div className="absolute -left-1 top-1/2 -translate-y-1/2 hidden group-hover:flex opacity-40 hover:opacity-80 cursor-grab">
        <GripVertical className="w-3.5 h-3.5" />
      </div>

      {/* Status indicator */}
      {entity.status === 'planned' && (
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-yellow-400 border-2 border-gray-900" title="Planned" />
      )}

      {/* Entity name */}
      <p className="font-cinzel font-bold text-sm leading-tight text-center">
        {entity.name}
      </p>

      {/* Subtitle */}
      {entity.subtitle && (
        <p className="text-[11px] opacity-70 text-center mt-0.5 leading-tight">
          {entity.subtitle}
        </p>
      )}

      {/* Location/acreage */}
      {(entity.location || entity.acreage) && (
        <p className="text-[10px] opacity-50 text-center mt-0.5">
          {[entity.location, entity.acreage].filter(Boolean).join(' · ')}
        </p>
      )}

      {/* Connection handle (bottom center) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onStartConnect(entity.id);
        }}
        className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-cyan-500 border-2 border-gray-900 hidden group-hover:flex items-center justify-center hover:bg-cyan-400 hover:scale-125 transition-all z-10 shadow-lg"
        title="Drag to connect"
      >
        <Circle className="w-2 h-2 fill-current text-white" />
      </button>

      {/* Hover action buttons (top right) */}
      <div className="absolute -top-3 -right-3 hidden group-hover:flex items-center gap-0.5 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); onClone(); }}
          className="w-6 h-6 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg transition-colors"
          title="Clone"
        >
          <Copy className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center shadow-lg transition-colors"
          title="Edit"
        >
          <Edit className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-400 text-white flex items-center justify-center shadow-lg transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// INLINE QUICK-ADD FORM
// ═══════════════════════════════════════════════════════════

function InlineAddForm({
  layer,
  templates,
  onSubmit,
  onCancel,
  isPending,
}: {
  layer: string;
  templates: EntityTemplate[];
  onSubmit: (data: { name: string; subtitle: string; layer: string; entityType: string }) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [showTemplates, setShowTemplates] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const config = LAYER_CONFIG[layer];

  useEffect(() => {
    if (!showTemplates && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showTemplates]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      subtitle: subtitle.trim(),
      layer,
      entityType: config?.defaultEntityType || layer,
    });
  };

  const handleTemplate = (template: EntityTemplate) => {
    onSubmit({
      name: template.name,
      subtitle: template.subtitle,
      layer,
      entityType: template.entityType,
    });
  };

  return (
    <div className={`rounded-xl border-2 border-dashed ${config?.nodeBorder || 'border-gray-500'} bg-gray-800/50 p-3 min-w-[200px] max-w-[260px] animate-in fade-in slide-in-from-bottom-2 duration-200`}>
      {showTemplates && templates.length > 0 ? (
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-1">Quick Add</p>
          {templates.map((t, i) => (
            <button
              key={i}
              onClick={() => handleTemplate(t)}
              disabled={isPending}
              className="w-full text-left px-2.5 py-1.5 rounded-lg bg-gray-700/60 hover:bg-gray-600/80 text-gray-200 text-xs transition-colors flex items-center gap-2"
            >
              <Zap className="w-3 h-3 text-yellow-400 shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate">{t.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{t.subtitle}</p>
              </div>
            </button>
          ))}
          <div className="border-t border-gray-700 pt-1.5 mt-1.5">
            <button
              onClick={() => setShowTemplates(false)}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-gray-700/40 text-gray-400 hover:text-gray-200 text-xs transition-colors flex items-center gap-2"
            >
              <Edit className="w-3 h-3 shrink-0" />
              Custom entity...
            </button>
          </div>
          <button
            onClick={onCancel}
            className="w-full text-center text-[10px] text-gray-500 hover:text-gray-300 pt-1"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <Input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") onCancel();
            }}
            placeholder="Entity name..."
            className="h-8 text-xs bg-gray-700/60 border-gray-600 text-white placeholder:text-gray-500"
          />
          <Input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") onCancel();
            }}
            placeholder="Subtitle (optional)"
            className="h-8 text-xs bg-gray-700/60 border-gray-600 text-white placeholder:text-gray-500"
          />
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!name.trim() || isPending}
              className="h-7 text-xs bg-royal-gold hover:bg-royal-gold/90 text-royal-navy flex-1"
            >
              {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3 mr-1" />}
              Add
            </Button>
            {templates.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setShowTemplates(true); setName(""); setSubtitle(""); }}
                className="h-7 text-xs text-gray-400 hover:text-white"
              >
                Templates
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onCancel}
              className="h-7 w-7 p-0 text-gray-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DETAIL SIDEBAR
// ═══════════════════════════════════════════════════════════

function DetailSidebar({
  entity,
  relationships,
  allEntities,
  open,
  onClose,
  onSave,
  onDelete,
  onClone,
  isSaving,
}: {
  entity: TrustEntity | null;
  relationships: TrustRelationship[];
  allEntities: TrustEntity[];
  open: boolean;
  onClose: () => void;
  onSave: (updated: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
  onClone: (entity: TrustEntity) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (entity) {
      setForm({
        name: entity.name || "",
        subtitle: entity.subtitle || "",
        layer: entity.layer || "",
        entityType: entity.entityType || "",
        description: entity.description || "",
        trusteeLabel: entity.trusteeLabel || "",
        protectorLabel: entity.protectorLabel || "",
        location: entity.location || "",
        acreage: entity.acreage || "",
        status: entity.status || "active",
        charter: entity.charter || "",
        legalBasis: entity.legalBasis || "",
        notes: entity.notes || "",
      });
    }
  }, [entity]);

  if (!entity) return null;

  const outgoing = relationships.filter(r => r.fromEntityId === entity.id);
  const incoming = relationships.filter(r => r.toEntityId === entity.id);
  const getEntityName = (id: string) => allEntities.find(e => e.id === id)?.name || "Unknown";
  const config = LAYER_CONFIG[entity.layer] || LAYER_CONFIG.project;

  const handleSave = () => {
    onSave({ id: entity.id, ...form });
  };

  const hasChanges = entity && (
    form.name !== (entity.name || "") ||
    form.subtitle !== (entity.subtitle || "") ||
    form.layer !== (entity.layer || "") ||
    form.entityType !== (entity.entityType || "") ||
    form.description !== (entity.description || "") ||
    form.trusteeLabel !== (entity.trusteeLabel || "") ||
    form.protectorLabel !== (entity.protectorLabel || "") ||
    form.location !== (entity.location || "") ||
    form.acreage !== (entity.acreage || "") ||
    form.status !== (entity.status || "active") ||
    form.charter !== (entity.charter || "") ||
    form.legalBasis !== (entity.legalBasis || "") ||
    form.notes !== (entity.notes || "")
  );

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-[380px] sm:w-[420px] overflow-y-auto p-0">
        {/* Header with entity color */}
        <div className={`${config.nodeBg} ${config.nodeText} p-5 border-b ${config.nodeBorder}`}>
          <SheetHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <Badge className={`text-[10px] mb-2 ${config.nodeColor} text-white border-0`}>
                  {config.label} Layer
                </Badge>
                <SheetTitle className={`font-cinzel text-lg ${config.nodeText} leading-tight`}>
                  {entity.name}
                </SheetTitle>
                {entity.subtitle && (
                  <p className="text-sm opacity-70 mt-0.5">{entity.subtitle}</p>
                )}
              </div>
            </div>
          </SheetHeader>
          {/* Quick actions */}
          <div className="flex items-center gap-2 mt-3">
            <Button
              size="sm"
              variant="secondary"
              className="h-7 text-xs bg-white/15 hover:bg-white/25 text-white border-0"
              onClick={() => onClone(entity)}
            >
              <Copy className="w-3 h-3 mr-1" /> Clone
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-7 text-xs bg-red-500/20 hover:bg-red-500/40 text-red-200 border-0"
              onClick={() => { if (confirm("Delete this entity?")) onDelete(entity.id); }}
            >
              <Trash2 className="w-3 h-3 mr-1" /> Delete
            </Button>
          </div>
        </div>

        {/* Relationships section */}
        {(outgoing.length > 0 || incoming.length > 0) && (
          <div className="px-5 py-4 border-b bg-gray-50">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Relationships</p>
            <div className="space-y-1.5">
              {outgoing.map(r => {
                const cfg = RELATIONSHIP_CONFIG[r.relationshipType];
                return (
                  <div key={r.id} className="flex items-center gap-1.5 text-xs">
                    <ArrowRight className="w-3 h-3 text-gray-400 shrink-0" />
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white shrink-0"
                      style={{ backgroundColor: cfg?.strokeColor || '#888' }}
                    >
                      {cfg?.label}
                    </span>
                    <span className="text-gray-700 truncate">{getEntityName(r.toEntityId)}</span>
                  </div>
                );
              })}
              {incoming.map(r => {
                const cfg = RELATIONSHIP_CONFIG[r.relationshipType];
                return (
                  <div key={r.id} className="flex items-center gap-1.5 text-xs">
                    <ArrowLeft className="w-3 h-3 text-gray-400 shrink-0" />
                    <span className="text-gray-700 truncate">{getEntityName(r.fromEntityId)}</span>
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white shrink-0"
                      style={{ backgroundColor: cfg?.strokeColor || '#888' }}
                    >
                      {cfg?.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Editable fields */}
        <div className="p-5 space-y-4">
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Name</Label>
            <Input value={form.name || ""} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="mt-1 h-9" />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Subtitle</Label>
            <Input value={form.subtitle || ""} onChange={(e) => setForm(f => ({ ...f, subtitle: e.target.value }))} className="mt-1 h-9" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Layer</Label>
              <Select value={form.layer || ""} onValueChange={(v) => setForm(f => ({ ...f, layer: v }))}>
                <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LAYERS_ORDER.map(l => (
                    <SelectItem key={l} value={l}>{LAYER_CONFIG[l].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Type</Label>
              <Input value={form.entityType || ""} onChange={(e) => setForm(f => ({ ...f, entityType: e.target.value }))} className="mt-1 h-9" />
            </div>
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Description</Label>
            <Textarea value={form.description || ""} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="mt-1" />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Trustee</Label>
              <Input value={form.trusteeLabel || ""} onChange={(e) => setForm(f => ({ ...f, trusteeLabel: e.target.value }))} className="mt-1 h-9" />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Protector</Label>
              <Input value={form.protectorLabel || ""} onChange={(e) => setForm(f => ({ ...f, protectorLabel: e.target.value }))} className="mt-1 h-9" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Location</Label>
              <Input value={form.location || ""} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} className="mt-1 h-9" />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Acreage</Label>
              <Input value={form.acreage || ""} onChange={(e) => setForm(f => ({ ...f, acreage: e.target.value }))} className="mt-1 h-9" />
            </div>
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Status</Label>
            <Select value={form.status || "active"} onValueChange={(v) => setForm(f => ({ ...f, status: v }))}>
              <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="dissolved">Dissolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div>
            <Label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Charter / Purpose</Label>
            <Textarea value={form.charter || ""} onChange={(e) => setForm(f => ({ ...f, charter: e.target.value }))} rows={2} className="mt-1" />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Legal Basis</Label>
            <Input value={form.legalBasis || ""} onChange={(e) => setForm(f => ({ ...f, legalBasis: e.target.value }))} className="mt-1 h-9" />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Notes</Label>
            <Textarea value={form.notes || ""} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="mt-1" />
          </div>

          {/* Save button */}
          {hasChanges && (
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export default function AdminTrustStructure() {
  usePageTitle("Trust Structure | Admin");
  const { toast } = useToast();

  // UI state
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [sidebarEntity, setSidebarEntity] = useState<TrustEntity | null>(null);
  const [connectMode, setConnectMode] = useState(false);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [connectType, setConnectType] = useState<string>("authority");
  const [zoom, setZoom] = useState(1);
  const [showRelTable, setShowRelTable] = useState(false);

  // Inline add state: which layer is showing the inline form
  const [inlineAddLayer, setInlineAddLayer] = useState<string | null>(null);

  // Drag state
  const [dragOverLayer, setDragOverLayer] = useState<string | null>(null);
  const dragEntityRef = useRef<TrustEntity | null>(null);

  // Temp connection line for visual feedback
  const [tempLine, setTempLine] = useState<{ fromX: number; fromY: number; toX: number; toY: number } | null>(null);

  // Diagram refs for SVG line calculation
  const diagramRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<LineData[]>([]);

  // ── Data fetching ──
  const { data, isLoading } = useQuery<TrustStructureData>({
    queryKey: ["/api/admin/trust-structure"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const entities = data?.entities || [];
  const relationships = data?.relationships || [];

  // ── Mutations ──
  const seedMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/trust-structure/seed"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-structure"] });
      toast({ title: "Structure seeded", description: "Default entities and relationships created." });
    },
    onError: (err: Error) => toast({ title: "Seed failed", description: err.message, variant: "destructive" }),
  });

  const createEntityMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => apiRequest("POST", "/api/admin/trust-entities", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-structure"] });
      setInlineAddLayer(null);
      toast({ title: "Entity created" });
    },
    onError: (err: Error) => toast({ title: "Create failed", description: err.message, variant: "destructive" }),
  });

  const updateEntityMutation = useMutation({
    mutationFn: ({ id, ...payload }: Record<string, unknown>) => apiRequest("PUT", `/api/admin/trust-entities/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-structure"] });
      toast({ title: "Entity updated" });
    },
    onError: (err: Error) => toast({ title: "Update failed", description: err.message, variant: "destructive" }),
  });

  const deleteEntityMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/trust-entities/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-structure"] });
      setSidebarEntity(null);
      setSelectedEntity(null);
      toast({ title: "Entity deleted" });
    },
    onError: (err: Error) => toast({ title: "Delete failed", description: err.message, variant: "destructive" }),
  });

  const createRelMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => apiRequest("POST", "/api/admin/trust-relationships", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-structure"] });
      setConnectMode(false);
      setConnectFrom(null);
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

  // ── Clone handler ──
  const handleClone = (entity: TrustEntity) => {
    const cloneNum = entities.filter(e => e.layer === entity.layer).length + 1;
    createEntityMutation.mutate({
      name: `${entity.name} (Copy)`,
      subtitle: entity.subtitle || "",
      layer: entity.layer,
      entityType: entity.entityType,
      description: entity.description || "",
      trusteeLabel: entity.trusteeLabel || "",
      protectorLabel: entity.protectorLabel || "",
      location: entity.location || "",
      acreage: entity.acreage || "",
      status: entity.status || "active",
      charter: entity.charter || "",
      legalBasis: entity.legalBasis || "",
      notes: entity.notes || "",
    });
  };

  // ── Inline quick-add handler ──
  const handleInlineAdd = (data: { name: string; subtitle: string; layer: string; entityType: string }) => {
    createEntityMutation.mutate({
      ...data,
      description: "",
      trusteeLabel: "",
      protectorLabel: "",
      location: "",
      acreage: "",
      status: "active",
      charter: "",
      legalBasis: "",
      notes: "",
    });
  };

  // ── Calculate SVG line positions ──
  const calculateLines = useCallback(() => {
    if (!diagramRef.current || relationships.length === 0) {
      setLines([]);
      return;
    }

    const container = diagramRef.current;
    const containerRect = container.getBoundingClientRect();
    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;
    const newLines: LineData[] = [];

    for (const rel of relationships) {
      const fromEl = container.querySelector(`[data-entity-id="${rel.fromEntityId}"]`) as HTMLElement;
      const toEl = container.querySelector(`[data-entity-id="${rel.toEntityId}"]`) as HTMLElement;
      if (!fromEl || !toEl) continue;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      const fromX = (fromRect.left + fromRect.width / 2 - containerRect.left + scrollLeft) / zoom;
      const fromY = (fromRect.bottom - containerRect.top + scrollTop) / zoom;
      const toX = (toRect.left + toRect.width / 2 - containerRect.left + scrollLeft) / zoom;
      const toY = (toRect.top - containerRect.top + scrollTop) / zoom;

      newLines.push({ id: rel.id, fromX, fromY, toX, toY, type: rel.relationshipType });
    }

    setLines(newLines);
  }, [relationships, zoom]);

  useEffect(() => {
    const timer = setTimeout(calculateLines, 100);
    return () => clearTimeout(timer);
  }, [calculateLines, entities]);

  useEffect(() => {
    window.addEventListener("resize", calculateLines);
    return () => window.removeEventListener("resize", calculateLines);
  }, [calculateLines]);

  // ── Entity click handler ──
  const handleEntityClick = (entityId: string) => {
    if (connectMode) {
      if (!connectFrom) {
        setConnectFrom(entityId);
        toast({ title: "Source selected", description: "Now click the target entity." });
      } else if (connectFrom !== entityId) {
        createRelMutation.mutate({
          fromEntityId: connectFrom,
          toEntityId: entityId,
          relationshipType: connectType,
          label: "",
          notes: "",
        });
      }
    } else {
      const entity = entities.find(e => e.id === entityId);
      if (entity) {
        setSelectedEntity(entityId);
        setSidebarEntity(entity);
      }
    }
  };

  // ── Connection handle click ──
  const handleStartConnect = (entityId: string) => {
    setConnectMode(true);
    setConnectFrom(entityId);
    toast({ title: "Connect mode", description: "Click target entity to create relationship." });
  };

  const handleDeleteEntity = (id: string) => {
    if (confirm("Delete this entity and all its relationships?")) {
      deleteEntityMutation.mutate(id);
    }
  };

  // ── Drag & drop between layers ──
  const handleDragStart = (e: React.DragEvent, entity: TrustEntity) => {
    dragEntityRef.current = entity;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", entity.id);
  };

  const handleDragOver = (e: React.DragEvent, layer: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverLayer(layer);
  };

  const handleDragLeave = () => {
    setDragOverLayer(null);
  };

  const handleDrop = (e: React.DragEvent, targetLayer: string) => {
    e.preventDefault();
    setDragOverLayer(null);
    const entity = dragEntityRef.current;
    if (!entity || entity.layer === targetLayer) return;

    updateEntityMutation.mutate({
      id: entity.id,
      name: entity.name,
      subtitle: entity.subtitle,
      layer: targetLayer,
      entityType: entity.entityType,
      description: entity.description,
      trusteeLabel: entity.trusteeLabel,
      protectorLabel: entity.protectorLabel,
      location: entity.location,
      acreage: entity.acreage,
      status: entity.status,
      charter: entity.charter,
      legalBasis: entity.legalBasis,
      notes: entity.notes,
    });
    toast({ title: "Entity moved", description: `Moved to ${LAYER_CONFIG[targetLayer]?.label} layer.` });
    dragEntityRef.current = null;
  };

  // Group entities by layer
  const entitiesByLayer = LAYERS_ORDER.map(layer => ({
    layer,
    config: LAYER_CONFIG[layer],
    entities: entities.filter(e => e.layer === layer).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
  }));

  const activeLayers = entitiesByLayer.filter(g => g.entities.length > 0);
  const totalValue = entities.reduce((sum, e) => sum + (e.totalValue || 0), 0);
  const totalRevenue = entities.reduce((sum, e) => sum + (e.annualRevenue || 0), 0);

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
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">

        {/* ════════════ HEADER ════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
            </Link>
            <div>
              <h1 className="font-cinzel text-2xl font-bold text-royal-navy flex items-center gap-2">
                <Layers className="w-6 h-6 text-royal-gold" />
                Trust Structure
              </h1>
              <p className="text-sm text-gray-500">Click nodes to edit &middot; Drag to move layers &middot; Use handles to connect</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                setConnectMode(!connectMode);
                setConnectFrom(null);
                if (connectMode) toast({ title: "Connect mode off" });
                else toast({ title: "Connect mode on", description: "Click source, then target." });
              }}
              variant={connectMode ? "default" : "outline"}
              className={`font-cinzel ${connectMode ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : ''}`}
            >
              <GitBranch className="w-4 h-4 mr-2" />
              {connectMode ? "Connecting..." : "Connect"}
            </Button>
            <Button
              onClick={() => setShowRelTable(!showRelTable)}
              variant="outline"
              className="font-cinzel"
            >
              <LinkIcon className="w-4 h-4 mr-2" /> Relationships
            </Button>
            {entities.length === 0 && (
              <Button
                onClick={() => seedMutation.mutate()}
                disabled={seedMutation.isPending}
                variant="outline"
                className="font-cinzel border-dashed"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${seedMutation.isPending ? 'animate-spin' : ''}`} />
                Load Template
              </Button>
            )}
          </div>
        </div>

        {/* ════════════ STATS ROW ════════════ */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
          {[
            { label: "Entities", value: entities.length },
            { label: "Relationships", value: relationships.length },
            { label: "Active Layers", value: activeLayers.length },
            { label: "Active", value: entities.filter(e => e.status === 'active').length },
            { label: "Total Value", value: totalValue > 0 ? `$${(totalValue / 100).toLocaleString()}` : "\u2014" },
            { label: "Annual Rev", value: totalRevenue > 0 ? `$${(totalRevenue / 100).toLocaleString()}` : "\u2014" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-lg border px-3 py-2 text-center">
              <p className="text-lg font-bold text-royal-navy">{stat.value}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ════════════ RELATIONSHIP LEGEND / FILTER ════════════ */}
        <div className="bg-gray-900 rounded-t-xl border border-gray-700 border-b-0 px-4 py-3 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeFilter === null ? 'bg-white text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All Relationships
          </button>
          {Object.entries(RELATIONSHIP_CONFIG).map(([type, cfg]) => {
            const count = relationships.filter(r => r.relationshipType === type).length;
            return (
              <button
                key={type}
                onClick={() => setActiveFilter(activeFilter === type ? null : type)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  activeFilter === type ? 'bg-white text-gray-900' : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <span
                  className="w-3 h-0.5 rounded inline-block"
                  style={{ backgroundColor: cfg.strokeColor }}
                />
                {cfg.label}
                {count > 0 && <span className="text-[10px] opacity-60">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* ════════════ CONNECT MODE BAR ════════════ */}
        {connectMode && (
          <div className="bg-cyan-900/80 border-x border-cyan-700 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-cyan-100">
              <MousePointer2 className="w-4 h-4" />
              {!connectFrom
                ? "Click the SOURCE entity (or use a connection handle)"
                : <>Source: <strong>{entities.find(e => e.id === connectFrom)?.name}</strong> — now click the TARGET</>
              }
            </div>
            <div className="flex items-center gap-2">
              <Select value={connectType} onValueChange={setConnectType}>
                <SelectTrigger className="h-7 w-[150px] text-xs bg-cyan-800 border-cyan-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RELATIONSHIP_CONFIG).map(([type, cfg]) => (
                    <SelectItem key={type} value={type}>{cfg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="ghost"
                className="text-cyan-200 hover:text-white h-7"
                onClick={() => { setConnectMode(false); setConnectFrom(null); }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ════════════ DIAGRAM AREA ════════════ */}
        <div
          ref={diagramRef}
          className="relative bg-gray-900 rounded-b-xl border border-gray-700 border-t-0 overflow-x-auto min-h-[500px]"
        >
          {/* Zoom controls */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-gray-800/90 rounded-lg border border-gray-600 p-1">
            <button
              onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white rounded transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[10px] text-gray-400 w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white rounded transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white rounded transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SVG connection lines */}
          <ConnectionLines lines={lines} activeFilter={activeFilter} tempLine={tempLine} />

          {/* Layer rows */}
          <div
            className="relative py-8 px-4"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', zIndex: 2 }}
          >
            {entities.length === 0 ? (
              /* ── Empty state ── */
              <div className="space-y-8">
                {LAYERS_ORDER.slice(0, 5).map((layer) => {
                  const config = LAYER_CONFIG[layer];
                  const Icon = config.icon;
                  return (
                    <div key={layer} className="flex items-center gap-6">
                      <div className="w-32 shrink-0 text-right">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">{config.label}</p>
                      </div>
                      <div className="flex-1 flex justify-center">
                        {inlineAddLayer === layer ? (
                          <InlineAddForm
                            layer={layer}
                            templates={LAYER_TEMPLATES[layer] || []}
                            onSubmit={handleInlineAdd}
                            onCancel={() => setInlineAddLayer(null)}
                            isPending={createEntityMutation.isPending}
                          />
                        ) : (
                          <button
                            onClick={() => setInlineAddLayer(layer)}
                            className="border-2 border-dashed border-gray-700 hover:border-gray-500 rounded-xl px-8 py-6 flex flex-col items-center gap-2 text-gray-600 hover:text-gray-400 transition-all group"
                          >
                            <Icon className="w-6 h-6 opacity-40 group-hover:opacity-70 transition-opacity" />
                            <span className="text-xs">Add {config.label} Entity</span>
                            <Plus className="w-4 h-4 opacity-30 group-hover:opacity-60" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className="text-center pt-4">
                  <p className="text-gray-500 text-sm mb-4">
                    Start building your trust structure, or load the default template.
                  </p>
                  <Button
                    onClick={() => seedMutation.mutate()}
                    disabled={seedMutation.isPending}
                    variant="outline"
                    className="font-cinzel text-gray-300 border-gray-600 hover:bg-gray-800"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${seedMutation.isPending ? 'animate-spin' : ''}`} />
                    Load Template
                  </Button>
                </div>
              </div>
            ) : (
              /* ── Populated diagram ── */
              <div className="space-y-12">
                {entitiesByLayer.map(({ layer, config, entities: layerEntities }) => {
                  const isCoreLayer = LAYERS_ORDER.indexOf(layer) < 5;
                  if (layerEntities.length === 0 && !isCoreLayer) return null;

                  const Icon = config.icon;
                  const isDragOver = dragOverLayer === layer;

                  return (
                    <div
                      key={layer}
                      className={`flex items-start gap-6 rounded-lg transition-colors duration-200 py-2 -mx-2 px-2 ${
                        isDragOver ? 'bg-cyan-900/30 ring-1 ring-cyan-500/40' : ''
                      }`}
                      onDragOver={(e) => handleDragOver(e, layer)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, layer)}
                    >
                      {/* Layer label */}
                      <div className="w-32 shrink-0 text-right pt-2">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium leading-tight">
                          {config.label}
                        </p>
                        <p className="text-[9px] text-gray-600 mt-0.5 hidden sm:block">
                          {config.subtitle}
                        </p>
                      </div>

                      {/* Entity nodes */}
                      <div className="flex-1 flex flex-wrap justify-center items-start gap-4 min-h-[60px]">
                        {layerEntities.map((entity) => (
                          <EntityNode
                            key={entity.id}
                            entity={entity}
                            isSelected={selectedEntity === entity.id}
                            isConnecting={connectMode}
                            connectFrom={connectFrom}
                            onClick={() => handleEntityClick(entity.id)}
                            onEdit={() => { setSelectedEntity(entity.id); setSidebarEntity(entity); }}
                            onDelete={() => handleDeleteEntity(entity.id)}
                            onClone={() => handleClone(entity)}
                            onStartConnect={handleStartConnect}
                            onDragStart={handleDragStart}
                          />
                        ))}

                        {/* Inline add form or add button */}
                        {inlineAddLayer === layer ? (
                          <InlineAddForm
                            layer={layer}
                            templates={LAYER_TEMPLATES[layer] || []}
                            onSubmit={handleInlineAdd}
                            onCancel={() => setInlineAddLayer(null)}
                            isPending={createEntityMutation.isPending}
                          />
                        ) : (
                          <button
                            onClick={() => setInlineAddLayer(layer)}
                            className="border-2 border-dashed border-gray-700 hover:border-gray-500 rounded-xl w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-400 transition-all self-center"
                            title={`Add ${config.label} entity`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ════════════ ARCHITECTURAL PRINCIPLES ════════════ */}
        {entities.length > 0 && (
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {[
              { icon: Crown, title: "Authority Flows Downward", desc: "Constitutional authority originates from the charter and flows through governance to operational entities." },
              { icon: Shield, title: "Stewardship, Not Ownership", desc: "Trustees administer corpus for beneficiaries. Legal title is separated from beneficial interest." },
              { icon: Users, title: "Each Commune Has Its PMA", desc: "Every community unit establishes its own Private Membership Association for local governance." },
            ].map((p, i) => (
              <div key={i} className="bg-gray-50 rounded-lg border p-4 flex items-start gap-3">
                <p.icon className="w-5 h-5 text-royal-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-cinzel text-sm font-bold text-royal-navy">{p.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ════════════ RELATIONSHIP TABLE (toggleable) ════════════ */}
        {showRelTable && relationships.length > 0 && (
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-cinzel text-lg">All Relationships ({relationships.length})</CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowRelTable(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-80 overflow-y-auto">
                {relationships.map(rel => {
                  const from = entities.find(e => e.id === rel.fromEntityId);
                  const to = entities.find(e => e.id === rel.toEntityId);
                  const cfg = RELATIONSHIP_CONFIG[rel.relationshipType];
                  return (
                    <div key={rel.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-xs">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="font-semibold text-gray-800 truncate">{from?.name || "?"}</span>
                        <span
                          className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                          style={{ backgroundColor: cfg?.strokeColor || '#888' }}
                        >
                          {cfg?.label || rel.relationshipType}
                        </span>
                        <span className="font-semibold text-gray-800 truncate">{to?.name || "?"}</span>
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

        {/* ════════════ DETAIL SIDEBAR ════════════ */}
        <DetailSidebar
          entity={sidebarEntity}
          relationships={relationships}
          allEntities={entities}
          open={!!sidebarEntity}
          onClose={() => { setSidebarEntity(null); setSelectedEntity(null); }}
          onSave={(updated) => updateEntityMutation.mutate(updated)}
          onDelete={handleDeleteEntity}
          onClone={handleClone}
          isSaving={updateEntityMutation.isPending}
        />

      </div>
    </AdminLayout>
  );
}
