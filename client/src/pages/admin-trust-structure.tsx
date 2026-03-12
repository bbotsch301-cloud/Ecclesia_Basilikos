import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Dialog imports reserved for future use
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
import { DocumentBuilderButton } from "@/components/trust-document-builder";

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
    subtitle: "Charter & Constitutional Root",
    nodeColor: "bg-red-900",
    nodeBorder: "border-red-800",
    nodeText: "text-white",
    nodeBg: "bg-red-900",
    icon: Crown,
    defaultEntityType: "charter",
  },
  trust: {
    label: "Governance",
    subtitle: "Governance Anchor",
    nodeColor: "bg-slate-700",
    nodeBorder: "border-slate-500",
    nodeText: "text-white",
    nodeBg: "bg-slate-800",
    icon: Shield,
    defaultEntityType: "trust",
  },
  operational: {
    label: "Asset Stewardship",
    subtitle: "Operational Trusts",
    nodeColor: "bg-teal-600",
    nodeBorder: "border-teal-400",
    nodeText: "text-white",
    nodeBg: "bg-teal-700",
    icon: Building2,
    defaultEntityType: "operational",
  },
  pma: {
    label: "People Layer",
    subtitle: "Community Governance",
    nodeColor: "bg-purple-600",
    nodeBorder: "border-purple-400",
    nodeText: "text-white",
    nodeBg: "bg-purple-700",
    icon: Users,
    defaultEntityType: "pma",
  },
  platform: {
    label: "Platform",
    subtitle: "Digital Infrastructure",
    nodeColor: "bg-indigo-600",
    nodeBorder: "border-indigo-400",
    nodeText: "text-white",
    nodeBg: "bg-indigo-700",
    icon: Globe,
    defaultEntityType: "platform",
  },
  chapter: {
    label: "Chapter",
    subtitle: "Regional Communities",
    nodeColor: "bg-purple-100",
    nodeBorder: "border-purple-400 border-dashed",
    nodeText: "text-purple-800",
    nodeBg: "bg-white",
    icon: MapPin,
    defaultEntityType: "chapter",
  },
  commune: {
    label: "Commune",
    subtitle: "Local Residential Groups",
    nodeColor: "bg-purple-100",
    nodeBorder: "border-purple-400 border-dashed",
    nodeText: "text-purple-800",
    nodeBg: "bg-white",
    icon: Sprout,
    defaultEntityType: "commune",
  },
  guild: {
    label: "Guild",
    subtitle: "Cross-Cutting Functional Groups",
    nodeColor: "bg-amber-100",
    nodeBorder: "border-amber-500 border-dashed",
    nodeText: "text-amber-800",
    nodeBg: "bg-white",
    icon: Users,
    defaultEntityType: "guild",
  },
  project: {
    label: "Project",
    subtitle: "Time-Bound Initiatives",
    nodeColor: "bg-gray-100",
    nodeBorder: "border-gray-400 border-dashed",
    nodeText: "text-gray-700",
    nodeBg: "bg-white",
    icon: FolderOpen,
    defaultEntityType: "project",
  },
  beneficiary: {
    label: "Beneficiary",
    subtitle: "All Members",
    nodeColor: "bg-gray-100",
    nodeBorder: "border-gray-400 border-dashed",
    nodeText: "text-gray-700",
    nodeBg: "bg-white",
    icon: Users,
    defaultEntityType: "beneficiary",
  },
};

const RELATIONSHIP_CONFIG: Record<string, {
  label: string;
  color: string;
  strokeColor: string;
  dashed: boolean;
}> = {
  authority:       { label: "Authority",       color: "bg-red-500",     strokeColor: "#dc2626", dashed: false },
  grants:          { label: "Grants",          color: "bg-gray-800",    strokeColor: "#1f2937", dashed: false },
  funds:           { label: "Funds",           color: "bg-blue-500",    strokeColor: "#2563eb", dashed: false },
  land:            { label: "Land",            color: "bg-green-600",   strokeColor: "#16a34a", dashed: false },
  remits:          { label: "Remits",          color: "bg-purple-500",  strokeColor: "#9333ea", dashed: false },
  establishes_pma: { label: "Establishes PMA", color: "bg-purple-400",  strokeColor: "#a855f7", dashed: true },
  oversees:        { label: "Oversees",        color: "bg-orange-500",  strokeColor: "#ea580c", dashed: true },
  coordinates:     { label: "Coordinates",     color: "bg-gray-500",    strokeColor: "#6b7280", dashed: true },
  benefits:        { label: "Benefits",        color: "bg-teal-500",    strokeColor: "#0d9488", dashed: true },
  shepherds:       { label: "Shepherds",       color: "bg-emerald-600", strokeColor: "#059669", dashed: false },
  teaches:         { label: "Teaches",         color: "bg-sky-600",     strokeColor: "#0284c7", dashed: false },
  serves:          { label: "Serves",          color: "bg-rose-500",    strokeColor: "#f43f5e", dashed: true },
  tithes:          { label: "Tithes",          color: "bg-amber-600",   strokeColor: "#d97706", dashed: false },
};

// Biblical labels for each layer type (Phase 4 / Phase 7 — UI-only, no enum rename)
const BIBLICAL_LABELS: Record<string, string> = {
  charter: "Covenant Foundation",
  trust: "Common Storehouse (Acts 4:32)",
  operational: "Stewardship Arm",
  pma: "Ecclesia (Matthew 16:18)",
  chapter: "Local Assembly (Acts 14:23)",
  commune: "Koinonia Household (Acts 2:46)",
  guild: "Craftsmen Assembly (Exodus 35:10)",
  project: "Kingdom Work",
  beneficiary: "Joint Heir (Romans 8:17)",
};

// Biblical labels for governance roles
const BIBLICAL_ROLE_LABELS: Record<string, string> = {
  grantor: "Grantor",
  trustee: "Trustee",
  protector: "Protector",
  steward: "Steward",
  beneficiary: "Beneficiary",
  officer: "Officer",
  elder: "Elder (1 Timothy 3:1-7)",
  deacon: "Deacon (1 Timothy 3:8-13)",
  apostle: "Apostle (Ephesians 4:11)",
  prophet: "Prophet (Ephesians 4:11)",
  evangelist: "Evangelist (Ephesians 4:11)",
  pastor: "Pastor (Ephesians 4:11)",
  teacher: "Teacher (Ephesians 4:11)",
};

// Biblical labels for relationship types
const BIBLICAL_RELATIONSHIP_LABELS: Record<string, string> = {
  shepherds: "Shepherds (1 Peter 5:2)",
  teaches: "Teaches (Matthew 28:20)",
  serves: "Serves (Mark 10:45)",
  tithes: "Tithes (Malachi 3:10)",
};

const LAYERS_ORDER = ['charter', 'trust', 'operational', 'pma', 'chapter', 'commune', 'guild', 'project', 'beneficiary'];

// ── Quick templates per layer ──
interface EntityTemplate {
  name: string;
  subtitle: string;
  entityType: string;
}

const LAYER_TEMPLATES: Record<string, EntityTemplate[]> = {
  charter: [
    { name: "New Covenant Legacy Trust", subtitle: "Constitutional Root & Covenant Charter", entityType: "charter" },
  ],
  trust: [
    { name: "Governance Trust", subtitle: "Governance Anchor", entityType: "trust" },
  ],
  operational: [
    { name: "Land Trust", subtitle: "Stewardship of Land", entityType: "operational" },
    { name: "Housing Trust", subtitle: "Shelter & Buildings", entityType: "operational" },
    { name: "Treasury Trust", subtitle: "Finances & Resources", entityType: "operational" },
    { name: "Enterprise Trust", subtitle: "Commerce & Innovation", entityType: "operational" },
    { name: "Education Trust", subtitle: "Knowledge & Training", entityType: "operational" },
  ],
  pma: [
    { name: "Private Membership Association", subtitle: "(PMA)", entityType: "pma" },
    { name: "Local PMA", subtitle: "Sub-PMA · Local Chapter", entityType: "pma" },
  ],
  chapter: [
    { name: "Chapter", subtitle: "Regional Community", entityType: "chapter" },
  ],
  commune: [
    { name: "Commune", subtitle: "Local Residential Group", entityType: "commune" },
  ],
  guild: [
    { name: "Guild", subtitle: "Functional Group", entityType: "guild" },
  ],
  project: [
    { name: "Project", subtitle: "Time-Bound Initiative", entityType: "project" },
  ],
  beneficiary: [
    { name: "Beneficiaries & Stewards", subtitle: "All Members", entityType: "beneficiary" },
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
  label?: string;
  notes?: string;
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
        const pathId = `path-${line.id}`;
        const path = `M ${line.fromX} ${line.fromY} C ${line.fromX} ${cp1Y}, ${line.toX} ${cp2Y}, ${line.toX} ${line.toY}`;
        const displayLabel = line.label || line.notes;
        return (
          <g key={line.id}>
            <path
              id={pathId}
              d={path}
              fill="none"
              stroke={cfg.strokeColor}
              strokeWidth={2.5}
              strokeDasharray={cfg.dashed ? "8,4" : "none"}
              markerEnd={`url(#arrow-${line.type})`}
              opacity={0.85}
            />
            {displayLabel && (
              <text fontSize="10" fill={cfg.strokeColor} fontWeight="600" opacity={0.9}>
                <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
                  <tspan dy="-6">{displayLabel}</tspan>
                </textPath>
              </text>
            )}
          </g>
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

type NodeSizeVariant = 'compact' | 'standard' | 'wide' | 'prominent';

function getNodeSizeVariant(layer: string): NodeSizeVariant {
  switch (layer) {
    case 'charter': return 'wide';
    case 'trust': return 'wide';
    case 'pma': return 'prominent';
    case 'beneficiary': return 'wide';
    case 'chapter':
    case 'commune':
    case 'guild':
    case 'project': return 'compact';
    default: return 'standard';
  }
}

const NODE_SIZE_CLASSES: Record<NodeSizeVariant, string> = {
  compact: 'min-w-[120px] sm:min-w-[140px] max-w-[160px] sm:max-w-[175px] px-3 sm:px-4 py-2 sm:py-2.5',
  standard: 'min-w-[140px] sm:min-w-[160px] max-w-[180px] sm:max-w-[200px] px-4 sm:px-5 py-2.5 sm:py-3',
  wide: 'min-w-[180px] sm:min-w-[220px] max-w-[260px] sm:max-w-[300px] px-4 sm:px-6 py-3 sm:py-4',
  prominent: 'min-w-[200px] sm:min-w-[280px] max-w-[300px] sm:max-w-[400px] px-5 sm:px-8 py-3 sm:py-5',
};

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
  sizeOverride,
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
  sizeOverride?: NodeSizeVariant;
}) {
  const config = LAYER_CONFIG[entity.layer] || LAYER_CONFIG.project;
  const sizeVariant = sizeOverride || getNodeSizeVariant(entity.layer);
  const sizeClasses = NODE_SIZE_CLASSES[sizeVariant];
  const isProminent = sizeVariant === 'prominent';

  return (
    <div
      data-entity-id={entity.id}
      data-layer={entity.layer}
      draggable
      onDragStart={(e) => onDragStart(e, entity)}
      onClick={onClick}
      className={`
        relative group cursor-pointer select-none
        rounded-xl border-2 ${sizeClasses}
        transition-all duration-200 ease-out shadow-md
        ${entity.color ? '' : config.nodeBg} ${config.nodeBorder} ${entity.color ? 'text-white' : config.nodeText}
        ${isSelected ? 'ring-3 ring-royal-gold ring-offset-2 ring-offset-white scale-105 shadow-xl' : ''}
        ${isConnecting && connectFrom !== entity.id ? 'hover:ring-2 hover:ring-cyan-500 hover:ring-offset-2 hover:ring-offset-white' : ''}
        ${!isConnecting ? 'hover:scale-105 hover:shadow-xl hover:brightness-110' : ''}
      `}
      style={entity.color ? { backgroundColor: entity.color } : undefined}
    >
      {/* Status indicator */}
      {entity.status === 'planned' && (
        <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-yellow-400 border-2 border-white shadow" title="Planned" />
      )}

      {/* Entity name */}
      <p className={`font-cinzel font-bold leading-tight text-center ${isProminent ? 'text-base' : 'text-sm'}`}>
        {entity.name}
      </p>

      {/* Subtitle */}
      {entity.subtitle && (
        <p className={`opacity-70 text-center mt-0.5 leading-tight ${isProminent ? 'text-xs' : 'text-[11px]'}`}>
          {entity.subtitle}
        </p>
      )}

      {/* Biblical subtitle */}
      {BIBLICAL_LABELS[entity.layer] && (
        <p className={`opacity-50 text-center mt-0.5 leading-tight italic ${isProminent ? 'text-[11px]' : 'text-[10px]'}`}>
          {BIBLICAL_LABELS[entity.layer]}
        </p>
      )}

      {/* Connection handle (bottom center) — only show in connect mode */}
      {isConnecting && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStartConnect(entity.id);
          }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center hover:bg-cyan-400 hover:scale-125 transition-all z-10 shadow-md"
          title="Click to connect"
        >
          <Circle className="w-1.5 h-1.5 fill-current text-white" />
        </button>
      )}
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
    <div className={`rounded-xl border-2 ${config?.nodeBorder || 'border-gray-300'} bg-white shadow-lg p-3 min-w-[210px] max-w-[270px] animate-in fade-in slide-in-from-bottom-2 duration-200`}>
      {showTemplates && templates.length > 0 ? (
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold px-1">Quick Add</p>
          {templates.map((t, i) => (
            <button
              key={i}
              onClick={() => handleTemplate(t)}
              disabled={isPending}
              className="w-full text-left px-2.5 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs transition-colors flex items-center gap-2 border border-gray-200"
            >
              <Zap className="w-3 h-3 text-amber-500 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold truncate">{t.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{t.subtitle}</p>
              </div>
            </button>
          ))}
          <div className="border-t border-gray-200 pt-1.5 mt-1.5">
            <button
              onClick={() => setShowTemplates(false)}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-700 text-xs transition-colors flex items-center gap-2"
            >
              <Edit className="w-3 h-3 shrink-0" />
              Custom entity...
            </button>
          </div>
          <button
            onClick={onCancel}
            className="w-full text-center text-[10px] text-gray-400 hover:text-gray-600 pt-1"
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
            className="h-8 text-xs"
          />
          <Input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") onCancel();
            }}
            placeholder="Subtitle (optional)"
            className="h-8 text-xs"
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
                className="h-7 text-xs text-gray-500 hover:text-gray-700"
              >
                Templates
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onCancel}
              className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
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
        <div
          className={`${entity.color ? 'text-white' : `${config.nodeBg} ${config.nodeText}`} p-5 border-b ${config.nodeBorder}`}
          style={entity.color ? { backgroundColor: entity.color } : undefined}
        >
          <SheetHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <Badge className="text-[10px] mb-2 bg-white/20 text-white border-0 backdrop-blur">
                  {config.label} Layer
                </Badge>
                <SheetTitle className="font-cinzel text-lg text-white leading-tight">
                  {entity.name}
                </SheetTitle>
                {entity.subtitle && (
                  <p className="text-sm opacity-80 mt-0.5">{entity.subtitle}</p>
                )}
                {BIBLICAL_LABELS[entity.layer] && (
                  <p className="text-xs opacity-60 mt-0.5 italic">{BIBLICAL_LABELS[entity.layer]}</p>
                )}
              </div>
            </div>
          </SheetHeader>
          {/* Quick actions */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <DocumentBuilderButton
              entity={entity}
              allEntities={allEntities}
              relationships={relationships}
            />
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
                  <div key={r.id} className="text-xs">
                    <div className="flex items-center gap-1.5">
                      <ArrowRight className="w-3 h-3 text-gray-400 shrink-0" />
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white shrink-0"
                        style={{ backgroundColor: cfg?.strokeColor || '#888' }}
                      >
                        {cfg?.label}
                      </span>
                      <span className="text-gray-700 truncate">{getEntityName(r.toEntityId)}</span>
                    </div>
                    {(r.label || r.notes) && (
                      <p className="text-[10px] text-gray-400 italic ml-5 mt-0.5 truncate">
                        {r.label}{r.label && r.notes ? ' — ' : ''}{r.notes}
                      </p>
                    )}
                  </div>
                );
              })}
              {incoming.map(r => {
                const cfg = RELATIONSHIP_CONFIG[r.relationshipType];
                return (
                  <div key={r.id} className="text-xs">
                    <div className="flex items-center gap-1.5">
                      <ArrowLeft className="w-3 h-3 text-gray-400 shrink-0" />
                      <span className="text-gray-700 truncate">{getEntityName(r.fromEntityId)}</span>
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white shrink-0"
                        style={{ backgroundColor: cfg?.strokeColor || '#888' }}
                      >
                        {cfg?.label}
                      </span>
                    </div>
                    {(r.label || r.notes) && (
                      <p className="text-[10px] text-gray-400 italic ml-5 mt-0.5 truncate">
                        {r.label}{r.label && r.notes ? ' — ' : ''}{r.notes}
                      </p>
                    )}
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
          {/* spacer so sticky footer doesn't cover last field */}
          <div className="h-16" />
        </div>

        {/* Sticky save footer — always visible */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-5 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className={`w-full font-cinzel transition-all ${
              hasChanges
                ? 'bg-royal-gold hover:bg-royal-gold/90 text-royal-navy'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
            {hasChanges ? 'Save Changes' : 'No Changes'}
          </Button>
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
  const [tempLine] = useState<{ fromX: number; fromY: number; toX: number; toY: number } | null>(null);

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

  // Auto-seed defaults on first load when structure is empty
  const autoSeeded = useRef(false);
  useEffect(() => {
    if (!isLoading && data && entities.length === 0 && !autoSeeded.current && !seedMutation.isPending) {
      autoSeeded.current = true;
      seedMutation.mutate();
    }
  }, [isLoading, data, entities.length]);

  // ── Mutations ──
  const seedMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/trust-structure/seed"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-structure"] });
      toast({ title: "Structure seeded", description: "Default entities and relationships created." });
    },
    onError: (err: Error) => toast({ title: "Seed failed", description: err.message, variant: "destructive" }),
  });

  const resetMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/trust-structure/reset"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-structure"] });
      toast({ title: "Structure reset", description: "Trust structure has been reset to defaults." });
    },
    onError: (err: Error) => toast({ title: "Reset failed", description: err.message, variant: "destructive" }),
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

      newLines.push({ id: rel.id, fromX, fromY, toX, toY, type: rel.relationshipType, label: rel.label || undefined, notes: rel.notes || undefined });
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

  // Group entities by section for two-arm layout
  const getEntitiesForLayers = (layers: string[]) =>
    entities.filter(e => layers.includes(e.layer)).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

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
              <p className="text-sm text-gray-500">Click any node to edit, delete, or view details</p>
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
          </div>
        </div>

        {/* ════════════ COMPACT STATS + LEGEND (collapsible) ════════════ */}
        <div className="bg-white rounded-t-xl border border-gray-200 border-b-0 px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-500">
            <span><strong className="text-royal-navy">{entities.length}</strong> entities</span>
            <span><strong className="text-royal-navy">{relationships.length}</strong> rels</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border ${
                activeFilter === null
                  ? 'bg-royal-navy text-white border-royal-navy'
                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {Object.entries(RELATIONSHIP_CONFIG).filter(([type]) => {
              return relationships.some(r => r.relationshipType === type);
            }).map(([type, cfg]) => (
              <button
                key={type}
                onClick={() => setActiveFilter(activeFilter === type ? null : type)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border ${
                  activeFilter === type
                    ? 'bg-royal-navy text-white border-royal-navy'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span className="w-3 h-0.5 rounded-full inline-block" style={{ backgroundColor: cfg.strokeColor }} />
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* ════════════ CONNECT MODE BAR ════════════ */}
        {connectMode && (
          <div className="bg-cyan-50 border-x border-cyan-200 px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-cyan-800 font-medium">
              <MousePointer2 className="w-4 h-4 text-cyan-600 shrink-0" />
              {!connectFrom
                ? "Click the SOURCE entity"
                : <>Source: <strong className="text-cyan-900">{entities.find(e => e.id === connectFrom)?.name}</strong> — now click TARGET</>
              }
            </div>
            <div className="flex items-center gap-2">
              <Select value={connectType} onValueChange={setConnectType}>
                <SelectTrigger className="h-7 w-[130px] sm:w-[150px] text-xs">
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
                className="text-cyan-600 hover:text-cyan-800 h-7"
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
          className="relative bg-slate-50/80 rounded-b-xl border border-gray-200 border-t-0 overflow-auto -mx-4 sm:mx-0 border-x-0 sm:border-x sm:rounded-b-xl"
          style={{ minHeight: '420px' }}
        >
          {/* Zoom controls */}
          <div className="sticky top-3 float-right mr-3 mt-3 z-20 flex items-center gap-1 bg-white/80 backdrop-blur rounded-lg border border-gray-200 p-0.5 shadow-sm">
            <button
              onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[10px] text-gray-500 w-10 text-center font-medium">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SVG connection lines */}
          <ConnectionLines lines={lines} activeFilter={activeFilter} tempLine={tempLine} />

          {/* Two-arm diagram layout */}
          <div
            className="relative py-6 sm:py-8 px-2 sm:px-4"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', zIndex: 2 }}
          >
            {entities.length === 0 ? (
              /* ── Empty state — auto-seeds defaults ── */
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-royal-gold" />
                <p className="text-gray-500 text-sm font-cinzel">Loading default trust structure...</p>
              </div>
            ) : (
              /* ── Two-arm populated diagram ── */
              <div className="flex flex-col items-center gap-2">
                {/* Title */}
                <h2 className="font-cinzel text-lg tracking-[0.15em] text-gray-500 uppercase text-center mb-4">
                  Ecclesia Basilikos Trust Ecosystem
                </h2>

                {/* ── CONSTITUTIONAL ROOT (centered) ── */}
                {(() => {
                  const charterEntities = getEntitiesForLayers(['charter']);
                  return (
                    <div
                      className={`group/section flex flex-col items-center gap-4 py-3 rounded-xl transition-all ${dragOverLayer === 'charter' ? 'bg-cyan-100/70 ring-2 ring-cyan-400/50' : ''}`}
                      onDragOver={(e) => handleDragOver(e, 'charter')}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, 'charter')}
                    >
                      {charterEntities.map((entity) => (
                        <EntityNode
                          key={entity.id} entity={entity}
                          isSelected={selectedEntity === entity.id} isConnecting={connectMode} connectFrom={connectFrom}
                          onClick={() => handleEntityClick(entity.id)}
                          onEdit={() => { setSelectedEntity(entity.id); setSidebarEntity(entity); }}
                          onDelete={() => handleDeleteEntity(entity.id)}
                          onClone={() => handleClone(entity)}
                          onStartConnect={handleStartConnect} onDragStart={handleDragStart}
                        />
                      ))}
                      {inlineAddLayer === 'charter' ? (
                        <InlineAddForm layer="charter" templates={LAYER_TEMPLATES.charter || []}
                          onSubmit={handleInlineAdd} onCancel={() => setInlineAddLayer(null)} isPending={createEntityMutation.isPending} />
                      ) : (
                        <button onClick={() => setInlineAddLayer('charter')}
                          className="border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-xl w-8 h-8 flex items-center justify-center text-gray-300 hover:text-gray-500 transition-all bg-white/40 hover:bg-white/80 opacity-0 group-hover/section:opacity-100"
                          title="Add Constitutional entity">
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })()}

                {/* ── GOVERNANCE ANCHOR (centered) ── */}
                {(() => {
                  const trustEntitiesList = getEntitiesForLayers(['trust']);
                  return (
                    <div
                      className={`group/section flex flex-col items-center gap-4 py-3 rounded-xl transition-all ${dragOverLayer === 'trust' ? 'bg-cyan-100/70 ring-2 ring-cyan-400/50' : ''}`}
                      onDragOver={(e) => handleDragOver(e, 'trust')}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, 'trust')}
                    >
                      {trustEntitiesList.map((entity) => (
                        <EntityNode
                          key={entity.id} entity={entity}
                          isSelected={selectedEntity === entity.id} isConnecting={connectMode} connectFrom={connectFrom}
                          onClick={() => handleEntityClick(entity.id)}
                          onEdit={() => { setSelectedEntity(entity.id); setSidebarEntity(entity); }}
                          onDelete={() => handleDeleteEntity(entity.id)}
                          onClone={() => handleClone(entity)}
                          onStartConnect={handleStartConnect} onDragStart={handleDragStart}
                        />
                      ))}
                      {inlineAddLayer === 'trust' ? (
                        <InlineAddForm layer="trust" templates={LAYER_TEMPLATES.trust || []}
                          onSubmit={handleInlineAdd} onCancel={() => setInlineAddLayer(null)} isPending={createEntityMutation.isPending} />
                      ) : (
                        <button onClick={() => setInlineAddLayer('trust')}
                          className="border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-xl w-8 h-8 flex items-center justify-center text-gray-300 hover:text-gray-500 transition-all bg-white/40 hover:bg-white/80 opacity-0 group-hover/section:opacity-100"
                          title="Add Governance entity">
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })()}

                {/* ══════ TWO-ARM SPLIT ══════ */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-16 items-start justify-center w-full mt-4">

                  {/* ── LEFT ARM: ASSET STEWARDSHIP ── */}
                  <div className="group/section w-full md:flex-1 md:max-w-[480px]">
                    <div className="relative mb-6">
                      <div className="border-t border-gray-300 w-full" />
                      <span className="absolute left-3 -translate-y-1/2 bg-gradient-to-b from-slate-50 to-gray-100 px-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold">
                        Asset Stewardship
                      </span>
                    </div>
                    <div
                      className={`flex flex-wrap justify-center items-start gap-4 min-h-[80px] p-4 rounded-xl border border-dashed border-gray-300 bg-white/30 transition-all ${
                        dragOverLayer === 'operational' ? 'bg-cyan-100/70 ring-2 ring-cyan-400/50 border-cyan-400' : ''
                      }`}
                      onDragOver={(e) => handleDragOver(e, 'operational')}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, 'operational')}
                    >
                      {getEntitiesForLayers(['operational']).map((entity) => (
                        <EntityNode
                          key={entity.id} entity={entity}
                          isSelected={selectedEntity === entity.id} isConnecting={connectMode} connectFrom={connectFrom}
                          onClick={() => handleEntityClick(entity.id)}
                          onEdit={() => { setSelectedEntity(entity.id); setSidebarEntity(entity); }}
                          onDelete={() => handleDeleteEntity(entity.id)}
                          onClone={() => handleClone(entity)}
                          onStartConnect={handleStartConnect} onDragStart={handleDragStart}
                        />
                      ))}
                      {inlineAddLayer === 'operational' ? (
                        <InlineAddForm layer="operational" templates={LAYER_TEMPLATES.operational || []}
                          onSubmit={handleInlineAdd} onCancel={() => setInlineAddLayer(null)} isPending={createEntityMutation.isPending} />
                      ) : (
                        <button onClick={() => setInlineAddLayer('operational')}
                          className="border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-xl w-8 h-8 flex items-center justify-center text-gray-300 hover:text-gray-500 transition-all self-center bg-white/40 hover:bg-white/80 opacity-0 group-hover/section:opacity-100"
                          title="Add Operational Trust">
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ── RIGHT ARM: COMMUNITY GOVERNANCE ── */}
                  <div className="group/section w-full md:flex-1 md:max-w-[480px]">
                    <div className="relative mb-6">
                      <div className="border-t border-gray-300 w-full" />
                      <span className="absolute left-3 -translate-y-1/2 bg-gradient-to-b from-slate-50 to-gray-100 px-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold">
                        Community Governance
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-6">

                      {/* PMA */}
                      <div
                        className={`flex flex-wrap justify-center items-start gap-4 w-full rounded-xl transition-all py-2 ${
                          dragOverLayer === 'pma' ? 'bg-cyan-100/70 ring-2 ring-cyan-400/50' : ''
                        }`}
                        onDragOver={(e) => handleDragOver(e, 'pma')}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'pma')}
                      >
                        {getEntitiesForLayers(['pma']).map((entity) => (
                          <EntityNode
                            key={entity.id} entity={entity}
                            isSelected={selectedEntity === entity.id} isConnecting={connectMode} connectFrom={connectFrom}
                            onClick={() => handleEntityClick(entity.id)}
                            onEdit={() => { setSelectedEntity(entity.id); setSidebarEntity(entity); }}
                            onDelete={() => handleDeleteEntity(entity.id)}
                            onClone={() => handleClone(entity)}
                            onStartConnect={handleStartConnect} onDragStart={handleDragStart}
                          />
                        ))}
                        {inlineAddLayer === 'pma' ? (
                          <InlineAddForm layer="pma" templates={LAYER_TEMPLATES.pma || []}
                            onSubmit={handleInlineAdd} onCancel={() => setInlineAddLayer(null)} isPending={createEntityMutation.isPending} />
                        ) : (
                          <button onClick={() => setInlineAddLayer('pma')}
                            className="border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-xl w-8 h-8 flex items-center justify-center text-gray-300 hover:text-gray-500 transition-all self-center bg-white/40 hover:bg-white/80 opacity-0 group-hover/section:opacity-100"
                            title="Add PMA">
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Chapters → Communes (hierarchical) */}
                      <div className="flex flex-col items-center gap-3 w-full">
                        {['chapter', 'commune'].map((layer) => {
                          const layerConfig = LAYER_CONFIG[layer];
                          const layerEnts = getEntitiesForLayers([layer]);
                          return (
                            <div
                              key={layer}
                              className={`flex flex-wrap justify-center items-start gap-3 w-full py-2 rounded-xl transition-all ${
                                dragOverLayer === layer ? 'bg-cyan-100/70 ring-2 ring-cyan-400/50' : ''
                              }`}
                              onDragOver={(e) => handleDragOver(e, layer)}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, layer)}
                            >
                              {layerEnts.map((entity) => (
                                <EntityNode
                                  key={entity.id} entity={entity}
                                  isSelected={selectedEntity === entity.id} isConnecting={connectMode} connectFrom={connectFrom}
                                  onClick={() => handleEntityClick(entity.id)}
                                  onEdit={() => { setSelectedEntity(entity.id); setSidebarEntity(entity); }}
                                  onDelete={() => handleDeleteEntity(entity.id)}
                                  onClone={() => handleClone(entity)}
                                  onStartConnect={handleStartConnect} onDragStart={handleDragStart}
                                />
                              ))}
                              {inlineAddLayer === layer ? (
                                <InlineAddForm layer={layer} templates={LAYER_TEMPLATES[layer] || []}
                                  onSubmit={handleInlineAdd} onCancel={() => setInlineAddLayer(null)} isPending={createEntityMutation.isPending} />
                              ) : (
                                <button onClick={() => setInlineAddLayer(layer)}
                                  className="border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-xl w-7 h-7 flex items-center justify-center text-gray-300 hover:text-gray-500 transition-all self-center bg-white/40 hover:bg-white/80 opacity-0 group-hover/section:opacity-100"
                                  title={`Add ${layerConfig.label}`}>
                                  <Plus className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Guilds & Projects (cross-cutting) */}
                      <div className="flex flex-wrap justify-center items-start gap-3 w-full">
                        {['guild', 'project'].map((layer) => {
                          const layerConfig = LAYER_CONFIG[layer];
                          const layerEnts = getEntitiesForLayers([layer]);
                          return layerEnts.map((entity) => (
                            <div
                              key={entity.id}
                              className={`rounded-xl transition-all ${dragOverLayer === layer ? 'bg-cyan-100/70 ring-2 ring-cyan-400/50' : ''}`}
                              onDragOver={(e) => handleDragOver(e, layer)}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, layer)}
                            >
                              <EntityNode
                                entity={entity}
                                isSelected={selectedEntity === entity.id} isConnecting={connectMode} connectFrom={connectFrom}
                                onClick={() => handleEntityClick(entity.id)}
                                onEdit={() => { setSelectedEntity(entity.id); setSidebarEntity(entity); }}
                                onDelete={() => handleDeleteEntity(entity.id)}
                                onClone={() => handleClone(entity)}
                                onStartConnect={handleStartConnect} onDragStart={handleDragStart}
                              />
                            </div>
                          )).concat([
                            inlineAddLayer === layer ? (
                              <InlineAddForm key={`add-${layer}`} layer={layer} templates={LAYER_TEMPLATES[layer] || []}
                                onSubmit={handleInlineAdd} onCancel={() => setInlineAddLayer(null)} isPending={createEntityMutation.isPending} />
                            ) : (
                              <button key={`btn-${layer}`} onClick={() => setInlineAddLayer(layer)}
                                className="border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-xl w-7 h-7 flex items-center justify-center text-gray-300 hover:text-gray-500 transition-all self-center bg-white/40 hover:bg-white/80 opacity-0 group-hover/section:opacity-100"
                                title={`Add ${layerConfig.label}`}>
                                <Plus className="w-3 h-3" />
                              </button>
                            ),
                          ]);
                        }).flat()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── BENEFICIARIES & STEWARDS (centered, below both arms) ── */}
                <div className="mt-8 w-full">
                  <div
                    className={`group/section flex flex-col items-center gap-4 py-3 rounded-xl transition-all ${dragOverLayer === 'beneficiary' ? 'bg-cyan-100/70 ring-2 ring-cyan-400/50' : ''}`}
                    onDragOver={(e) => handleDragOver(e, 'beneficiary')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'beneficiary')}
                  >
                    {getEntitiesForLayers(['beneficiary']).map((entity) => (
                      <EntityNode
                        key={entity.id} entity={entity}
                        isSelected={selectedEntity === entity.id} isConnecting={connectMode} connectFrom={connectFrom}
                        onClick={() => handleEntityClick(entity.id)}
                        onEdit={() => { setSelectedEntity(entity.id); setSidebarEntity(entity); }}
                        onDelete={() => handleDeleteEntity(entity.id)}
                        onClone={() => handleClone(entity)}
                        onStartConnect={handleStartConnect} onDragStart={handleDragStart}
                      />
                    ))}
                    {inlineAddLayer === 'beneficiary' ? (
                      <InlineAddForm layer="beneficiary" templates={LAYER_TEMPLATES.beneficiary || []}
                        onSubmit={handleInlineAdd} onCancel={() => setInlineAddLayer(null)} isPending={createEntityMutation.isPending} />
                    ) : (
                      <button onClick={() => setInlineAddLayer('beneficiary')}
                        className="border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-xl w-8 h-8 flex items-center justify-center text-gray-300 hover:text-gray-500 transition-all bg-white/40 hover:bg-white/80 opacity-0 group-hover/section:opacity-100"
                        title="Add Beneficiary entity">
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ════════════ ARCHITECTURAL PRINCIPLES ════════════ */}
        {entities.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: Crown, title: "Two Arms, One Body", desc: "The EBT authorizes two parallel arms: operational trusts hold assets, and the PMA organizes people. Neither controls the other." },
              { icon: Shield, title: "Stewardship, Not Ownership", desc: "Trustees administer corpus for beneficiaries. Legal title is separated from beneficial interest. Members have use rights, not ownership." },
              { icon: Users, title: "Beneficiaries & Stewards", desc: "Every member is both a beneficiary (receiving from the asset arm) and a steward (contributing through the people arm). The relationship is reciprocal." },
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
                      <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
                        <span className="font-semibold text-gray-800 truncate">{from?.name || "?"}</span>
                        <span
                          className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                          style={{ backgroundColor: cfg?.strokeColor || '#888' }}
                        >
                          {cfg?.label || rel.relationshipType}
                        </span>
                        <span className="font-semibold text-gray-800 truncate">{to?.name || "?"}</span>
                        {rel.label && <span className="text-gray-400 text-[10px] truncate">"{rel.label}"</span>}
                        {rel.notes && <span className="text-gray-400 text-[10px] italic truncate">{rel.notes}</span>}
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
