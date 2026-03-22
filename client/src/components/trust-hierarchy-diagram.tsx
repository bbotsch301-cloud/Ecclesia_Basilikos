import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  X,
  Compass,
  Map,
  Footprints,
  Zap,
  Lightbulb,
  MessageCircleQuestion,
  ArrowDown,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import StaggerContainer, { staggerItemVariants } from "@/components/ui/stagger-container";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  LAYER_CONFIG,
  BIBLICAL_LABELS,
  LAYERS_ORDER,
  LAYER_ROYAL_COLORS,
  LAYER_PLAIN_ENGLISH,
  CONNECTOR_LABELS,
  FALLBACK_ENTITIES,
  PRIMARY_RELATIONSHIPS,
  PERSPECTIVES,
  WALKTHROUGH_STEPS,
  TRUST_SCENARIOS,
  LAYER_DEEP_DIVE,
  CONNECTOR_GRADIENTS,
  STEWARDSHIP_TRUST_STYLES,
  LAYER_PANEL_BACKGROUNDS,
  type FallbackEntity,
  type PerspectiveId,
  type PerspectiveConfig,
  type TrustScenario,
} from "@/lib/trust-constants";

interface TrustEntity {
  id: string;
  name: string;
  subtitle?: string | null;
  layer: string;
  entityType: string;
  description?: string | null;
  status?: string | null;
}

interface TrustRelationship {
  id: string;
  fromEntityId: string;
  toEntityId: string;
  relationshipType: string;
}

interface TrustHierarchyDiagramProps {
  highlightLayer?: string;
  compact?: boolean;
  className?: string;
}

type DiagramMode = "explore" | "walkthrough" | "scenarios";

// Layers to show in the public diagram
const PUBLIC_LAYERS = ['covenant', 'body', 'stewardship', 'assembly', 'member'];
const COMPACT_LAYERS = ['covenant', 'body', 'assembly', 'member'];

// Progressive sizing for desktop pyramid effect (Phase 2: wider spread)
const LAYER_SIZING: Record<string, { maxWidth: string; border: string; shadow: string; rounded: string }> = {
  covenant:    { maxWidth: "max-w-3xl",     border: "border-2", shadow: "shadow-xl", rounded: "rounded-2xl" },
  body:        { maxWidth: "max-w-[42rem]", border: "border-2", shadow: "shadow-lg", rounded: "rounded-xl" },
  stewardship: { maxWidth: "max-w-[34rem]", border: "border",   shadow: "shadow-md", rounded: "rounded-xl" },
  assembly:    { maxWidth: "max-w-md",      border: "border",   shadow: "shadow-md", rounded: "rounded-lg" },
  member:      { maxWidth: "max-w-sm",      border: "border",   shadow: "shadow-sm", rounded: "rounded-lg" },
};

// ═══════════════════════════════════════════════════════════
// SVG CONNECTOR (Phase 1 + Phase 4)
// ═══════════════════════════════════════════════════════════

function SVGConnector({
  fromLayer,
  toLayer,
  compact,
  label: labelOverride,
  perspective,
  showFlow,
  flowDirection,
  isActive,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: {
  fromLayer: string;
  toLayer: string;
  compact: boolean;
  label?: string;
  perspective?: PerspectiveId;
  showFlow?: boolean;
  flowDirection?: "down" | "up";
  isActive?: boolean;
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const connectorKey = `${fromLayer}→${toLayer}`;
  const label = labelOverride ?? CONNECTOR_LABELS[connectorKey];
  const gradientId = `grad-${fromLayer}-${toLayer}`;
  const glowId = `glow-${fromLayer}-${toLayer}`;
  const pathId = `path-${fromLayer}-${toLayer}`;
  const gradient = CONNECTOR_GRADIENTS[connectorKey] || { from: "#b59548", to: "#b59548" };

  if (compact) {
    return (
      <div className="flex flex-col items-center py-1">
        <svg width="2" height="16" className="text-royal-gold/40">
          <line x1="1" y1="0" x2="1" y2="16" stroke="currentColor" strokeWidth="2" />
        </svg>
        <ChevronDown className="w-4 h-4 text-royal-gold/60 -mt-1" />
      </div>
    );
  }

  const svgHeight = 64;
  const svgWidth = 200;
  const strokeWidth = isHovered ? 5 : 3;
  // Gentle cubic bezier curve
  const pathD = `M ${svgWidth / 2} 0 C ${svgWidth / 2} ${svgHeight * 0.35}, ${svgWidth / 2} ${svgHeight * 0.65}, ${svgWidth / 2} ${svgHeight}`;

  return (
    <div
      className={`relative flex flex-col items-center transition-opacity duration-300 ${isActive === false ? "opacity-20" : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="overflow-visible md:h-16 h-12"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={gradient.from} />
            <stop offset="100%" stopColor={gradient.to} />
          </linearGradient>
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main path */}
        <path
          id={pathId}
          d={pathD}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter={isHovered ? `url(#${glowId})` : undefined}
          className="transition-all duration-300"
        />

        {/* Flow particles */}
        {showFlow && (
          <>
            <circle r="4" fill={gradient.from} opacity="0.9">
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                keyPoints={flowDirection === "up" ? "1;0" : "0;1"}
                keyTimes="0;1"
              >
                <mpath href={`#${pathId}`} />
              </animateMotion>
            </circle>
            <circle r="4" fill={gradient.to} opacity="0.9">
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                begin="1s"
                keyPoints={flowDirection === "up" ? "1;0" : "0;1"}
                keyTimes="0;1"
              >
                <mpath href={`#${pathId}`} />
              </animateMotion>
            </circle>
            {/* Glow circles */}
            <circle r="6" fill={gradient.from} opacity="0.3" filter={`url(#${glowId})`}>
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                keyPoints={flowDirection === "up" ? "1;0" : "0;1"}
                keyTimes="0;1"
              >
                <mpath href={`#${pathId}`} />
              </animateMotion>
            </circle>
          </>
        )}

        {/* Connector label via foreignObject (Phase 4) */}
        {label && (
          <foreignObject
            x={0}
            y={svgHeight / 2 - 16}
            width={svgWidth}
            height={32}
            className="overflow-visible"
          >
            <div className="flex justify-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${perspective || "default"}-${label}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`
                    inline-flex items-center gap-1.5
                    text-sm font-cinzel font-semibold text-royal-navy
                    bg-parchment border border-royal-gold/40 shadow-sm
                    px-4 py-1.5 rounded-lg whitespace-nowrap
                    ${isHovered ? "text-base font-bold border-royal-gold/60 shadow-md" : ""}
                  `}
                >
                  <ArrowDown className={`w-3 h-3 text-royal-gold/70 ${flowDirection === "up" ? "rotate-180" : ""}`} />
                  {label}
                </motion.span>
              </AnimatePresence>
            </div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEEP DIVE PANEL → Side Drawer (Phase 7)
// ═══════════════════════════════════════════════════════════

function DeepDiveDrawer({ layer, onClose }: { layer: string; onClose: () => void }) {
  const content = LAYER_DEEP_DIVE[layer];
  const config = LAYER_CONFIG[layer];
  const colors = LAYER_ROYAL_COLORS[layer];

  // Close on Escape. hook must run before any conditional return (Rules of Hooks)
  useEffect(() => {
    if (!content || !config || !colors) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, content, config, colors]);

  if (!content || !config || !colors) return null;

  const Icon = config.icon;

  return (
    <>
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Desktop: Right drawer / Mobile: Bottom sheet */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-0 right-0 bottom-0 w-[400px] max-w-[90vw] bg-white shadow-2xl z-50 overflow-y-auto hidden md:block"
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 bg-gradient-to-r ${colors.gradient} sticky top-0 z-10`}>
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${colors.accent}`} />
            <span className={`font-cinzel font-bold ${colors.text}`}>Deep Dive: {config.label}</span>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <DrawerContent content={content} />
      </motion.div>

      {/* Mobile: Bottom sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed left-0 right-0 bottom-0 max-h-[70vh] bg-white shadow-2xl z-50 overflow-y-auto rounded-t-2xl md:hidden"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-white z-10">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-3 bg-gradient-to-r ${colors.gradient}`}>
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${colors.accent}`} />
            <span className={`font-cinzel font-bold ${colors.text}`}>Deep Dive: {config.label}</span>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <DrawerContent content={content} />
      </motion.div>
    </>
  );
}

function DrawerContent({ content }: { content: typeof LAYER_DEEP_DIVE[string] }) {
  return (
    <div className="p-5 space-y-5">
      {/* Simple Version */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-bold text-amber-800">In Plain English</span>
        </div>
        <p className="text-sm text-amber-900 leading-relaxed">{content.simpleVersion}</p>
      </div>

      {/* Real-World Examples */}
      <div>
        <h4 className="text-sm font-bold text-royal-navy mb-2">Real-World Examples</h4>
        <ul className="space-y-1.5">
          {content.realExamples.map((example, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-royal-gold mt-0.5">&#x2022;</span>
              {example}
            </li>
          ))}
        </ul>
      </div>

      {/* FAQ */}
      <div>
        <h4 className="text-sm font-bold text-royal-navy mb-2">Common Questions</h4>
        <div className="space-y-3">
          {content.faq.map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-semibold text-royal-navy flex items-start gap-2">
                <MessageCircleQuestion className="w-4 h-4 text-royal-gold flex-shrink-0 mt-0.5" />
                {item.q}
              </p>
              <p className="text-sm text-gray-600 mt-1 ml-6">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Takeaway */}
      <div className="bg-royal-navy/5 border border-royal-navy/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-royal-gold" />
          <span className="text-sm font-bold text-royal-navy">Key Takeaway</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{content.keyTakeaway}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// STEWARDSHIP GRID (Phase 3)
// ═══════════════════════════════════════════════════════════

function StewardshipGrid({ entities }: { entities: Array<{ name: string; subtitle?: string | null }> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
      {entities.map((entity, i) => {
        const style = STEWARDSHIP_TRUST_STYLES[entity.name];
        const TrustIcon = style?.icon;

        return (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className={`
              flex items-start gap-3 border-l-4 rounded-lg px-3 py-2.5 bg-white border border-gray-100 shadow-sm
              hover:shadow-md transition-shadow cursor-default
              ${style?.border || "border-l-gray-300"}
            `}
          >
            {TrustIcon && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${style?.bg || "bg-gray-50"}`}>
                <TrustIcon className={`w-4 h-4 ${style?.accent || "text-gray-500"}`} />
              </div>
            )}
            <div className="min-w-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm font-medium text-royal-navy block truncate cursor-help">
                    {entity.name}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-sm">
                  {entity.subtitle || entity.name}
                </TooltipContent>
              </Tooltip>
              {entity.subtitle && (
                <span className="text-xs text-gray-400 block truncate">{entity.subtitle}</span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LAYER ROW (Phase 2 + Phase 3 + Phase 5)
// ═══════════════════════════════════════════════════════════

function LayerRow({
  layer,
  entities,
  isHighlighted,
  compact,
  perspectiveText,
  perspective,
  isDimmed,
  isSpotlit,
  spotlightLabel,
  onDeepDiveToggle,
  showDeepDive,
  scenarioAction,
  hoveredLayer,
  onMouseEnter,
  onMouseLeave,
}: {
  layer: string;
  entities: Array<{ name: string; subtitle?: string | null }>;
  isHighlighted: boolean;
  compact: boolean;
  perspectiveText?: { oneLineSummary: string; tooltipExplanation: string };
  perspective?: PerspectiveId;
  isDimmed?: boolean;
  isSpotlit?: boolean;
  spotlightLabel?: string;
  onDeepDiveToggle?: () => void;
  showDeepDive?: boolean;
  scenarioAction?: string;
  hoveredLayer?: string | null;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const config = LAYER_CONFIG[layer];
  const colors = LAYER_ROYAL_COLORS[layer];
  const biblicalLabel = BIBLICAL_LABELS[layer];
  const plainEnglish = perspectiveText || LAYER_PLAIN_ENGLISH[layer];
  const sizing = LAYER_SIZING[layer] || { maxWidth: "max-w-3xl", border: "border", shadow: "shadow-sm", rounded: "rounded-xl" };
  const panelBg = LAYER_PANEL_BACKGROUNDS[layer] || "bg-white";

  const Icon = config?.icon;
  const layerIndex = LAYERS_ORDER.indexOf(layer);
  const hasDeepDive = !!LAYER_DEEP_DIVE[layer];

  // Phase 5: Determine if this layer is adjacent to hovered layer
  const isHoveredLayer = hoveredLayer === layer;
  const isAdjacentToHovered = useMemo(() => {
    if (!hoveredLayer) return false;
    const hoveredIdx = PUBLIC_LAYERS.indexOf(hoveredLayer);
    const thisIdx = PUBLIC_LAYERS.indexOf(layer);
    return Math.abs(hoveredIdx - thisIdx) === 1;
  }, [hoveredLayer, layer]);
  const shouldDim = hoveredLayer && !isHoveredLayer && !isAdjacentToHovered;

  // Scroll into view ref
  const rowRef = useRef<HTMLDivElement>(null);

  if (!config || !colors) return null;

  return (
    <div className="flex flex-col items-center w-full" ref={rowRef}>
      <motion.div
        animate={{
          opacity: isDimmed ? 0.25 : shouldDim ? 0.5 : 1,
          scale: isSpotlit ? 1.02 : isHoveredLayer ? 1.01 : 1,
        }}
        transition={{ duration: 0.3 }}
        className={`
          relative w-full ${sizing.maxWidth} ${sizing.rounded} ${sizing.border} overflow-visible transition-all
          ${colors.border} ${sizing.shadow}
          ${isHighlighted ? "ring-2 ring-royal-gold ring-offset-2 shadow-lg shadow-royal-gold/20" : ""}
          ${isSpotlit ? "ring-2 ring-royal-gold ring-offset-2 shadow-xl shadow-royal-gold/30" : ""}
          ${isHoveredLayer ? "ring-2 ring-royal-gold shadow-xl scale-[1.01]" : ""}
          ${shouldDim ? "saturate-50" : ""}
          ${compact ? "p-3" : "p-0"}
          ${!compact && hasDeepDive ? "cursor-pointer" : ""}
        `}
        onClick={!compact && hasDeepDive && onDeepDiveToggle ? onDeepDiveToggle : undefined}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        role={!compact && hasDeepDive ? "button" : undefined}
        tabIndex={!compact && hasDeepDive ? 0 : undefined}
        aria-label={!compact && hasDeepDive ? `Deep dive into ${config.label}` : undefined}
        onKeyDown={!compact && hasDeepDive && onDeepDiveToggle ? (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onDeepDiveToggle(); }
        } : undefined}
      >
        {isHighlighted && !isSpotlit && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-royal-navy bg-royal-gold px-3 py-1 rounded-full shadow-md animate-pulse">
              You Enter Here
            </span>
          </div>
        )}

        {isSpotlit && spotlightLabel && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <motion.span
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-royal-navy bg-royal-gold px-3 py-1 rounded-full shadow-md"
            >
              <Sparkles className="w-3 h-3" />
              {spotlightLabel}
            </motion.span>
          </div>
        )}

        {/* Scenario action overlay */}
        {scenarioAction && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-sm"
          >
            <div className="bg-white border border-royal-gold/30 shadow-lg rounded-lg px-3 py-2 text-xs text-gray-700 text-center">
              {scenarioAction}
            </div>
          </motion.div>
        )}

        {compact ? (
          <div className={`flex items-center gap-3 ${colors.bg} rounded-lg ${compact ? "p-3" : "p-4"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${layer === 'member' || layer === 'region' || layer === 'household' || layer === 'craft' || layer === 'ministry' ? 'bg-royal-navy/10' : 'bg-white/15'}`}>
              <Icon className={`w-4 h-4 ${colors.accent}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-cinzel text-sm font-bold ${colors.text}`}>
                  {entities.length === 1 ? entities[0].name : config.label}
                </span>
                {entities.length > 1 && (
                  <span className={`text-xs ${colors.accent}`}>
                    ({entities.length})
                  </span>
                )}
              </div>
              {plainEnglish && (
                <p className={`text-xs mt-0.5 line-clamp-1 ${layer === 'member' || layer === 'region' || layer === 'household' || layer === 'craft' || layer === 'ministry' ? 'text-gray-400' : 'text-white/60'}`}>
                  {plainEnglish.oneLineSummary}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className={`grid md:grid-cols-[180px,1fr] items-stretch overflow-hidden ${sizing.rounded}`}>
            {/* Layer label sidebar (Phase 2: wider, larger icons, circular badge) */}
            <div className={`${colors.bg} p-4 md:p-5 flex flex-col justify-center items-center md:items-start gap-1`}>
              <span className={`inline-flex items-center justify-center w-7 h-7 text-xs font-bold ${colors.accent} bg-white/15 rounded-full`}>
                {layerIndex + 1}
              </span>
              <Icon className={`w-10 h-10 ${colors.accent} mt-1`} />
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={`font-cinzel text-sm font-bold ${colors.text} mt-1 border-b border-dashed border-current cursor-help`}>
                    {config.label}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs text-sm">
                  {plainEnglish?.tooltipExplanation || config.subtitle}
                </TooltipContent>
              </Tooltip>
              {biblicalLabel && (
                <span className={`text-xs ${colors.accent} font-georgia italic`}>
                  {biblicalLabel}
                </span>
              )}
            </div>

            {/* Entity cards (Phase 2: per-layer background) */}
            <div className={`p-4 md:p-5 ${panelBg}`}>
              {entities.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No entities</p>
              ) : entities.length === 1 ? (
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-cinzel text-base font-bold text-royal-navy">
                        {entities[0].name}
                      </h4>
                      {entities[0].subtitle && (
                        <p className="text-sm text-gray-500 mt-0.5">{entities[0].subtitle}</p>
                      )}
                    </div>
                    {hasDeepDive && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-gray-300 hover:text-royal-gold transition-colors mt-1">
                            <HelpCircle className="w-4 h-4" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>Click to deep dive</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  {plainEnglish && (
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={perspective || "default"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="text-sm text-gray-500 mt-2 italic font-georgia"
                      >
                        {plainEnglish.oneLineSummary}
                      </motion.p>
                    </AnimatePresence>
                  )}
                </div>
              ) : (
                <div>
                  {layer === 'stewardship' ? (
                    /* Phase 3: Always-visible stewardship grid */
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">
                          <span className="font-medium text-royal-navy">{entities.length} specialized trusts</span>
                          {" "}managing different asset types
                        </span>
                        {hasDeepDive && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-gray-300 hover:text-royal-gold transition-colors">
                                <HelpCircle className="w-4 h-4" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>Click to deep dive</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <StewardshipGrid entities={entities} />
                      {plainEnglish && (
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={perspective || "default"}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="text-sm text-gray-500 mt-3 italic font-georgia"
                          >
                            {plainEnglish.oneLineSummary}
                          </motion.p>
                        </AnimatePresence>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between">
                        <div className="flex flex-wrap gap-2">
                          {entities.map((entity, i) => (
                            <div
                              key={i}
                              className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                            >
                              <Icon className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-sm font-medium text-royal-navy">{entity.name}</span>
                            </div>
                          ))}
                        </div>
                        {hasDeepDive && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-gray-300 hover:text-royal-gold transition-colors mt-1">
                                <HelpCircle className="w-4 h-4" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>Click to deep dive</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      {plainEnglish && (
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={perspective || "default"}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="text-sm text-gray-500 mt-2 italic font-georgia"
                          >
                            {plainEnglish.oneLineSummary}
                          </motion.p>
                        </AnimatePresence>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// WALKTHROUGH MODE
// ═══════════════════════════════════════════════════════════

function WalkthroughOverlay({
  entities,
  visibleLayers,
  entitiesByLayer,
}: {
  entities: Array<{ id: string; name: string; subtitle?: string | null; layer: string }>;
  visibleLayers: string[];
  entitiesByLayer: Record<string, Array<{ name: string; subtitle?: string | null }>>;
}) {
  const [step, setStep] = useState(0);
  const currentStep = WALKTHROUGH_STEPS[step];
  const totalSteps = WALKTHROUGH_STEPS.length;

  const next = useCallback(() => setStep(s => Math.min(s + 1, totalSteps - 1)), [totalSteps]);
  const prev = useCallback(() => setStep(s => Math.max(s - 1, 0)), []);
  const restart = useCallback(() => setStep(0), []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  return (
    <div className="flex flex-col items-center gap-0 py-4">
      {/* Progress bar */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 font-georgia italic">
            Step {step + 1} of {totalSteps}
          </span>
          <span className="text-xs text-gray-400">Use arrow keys or buttons to navigate</span>
        </div>
        <div
          className="h-1.5 bg-gray-100 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Walkthrough progress: step ${step + 1} of ${totalSteps}`}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-royal-gold to-amber-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Layers with spotlight */}
      {visibleLayers.map((layer, idx) => {
        const layerEntities = entitiesByLayer[layer] || [];
        const isSpotlit = currentStep.layer === layer;
        const spotlitIndex = visibleLayers.indexOf(currentStep.layer);
        const isDimmed = !isSpotlit;

        return (
          <motion.div key={layer} className="w-full flex flex-col items-center" aria-hidden={isDimmed ? true : undefined}>
            <LayerRow
              layer={layer}
              entities={layerEntities}
              isHighlighted={false}
              compact={false}
              isDimmed={isDimmed}
              isSpotlit={isSpotlit}
              spotlightLabel={isSpotlit ? currentStep.title : undefined}
            />
            {idx < visibleLayers.length - 1 && (
              <SVGConnector
                fromLayer={layer}
                toLayer={visibleLayers[idx + 1]}
                compact={false}
                showFlow={idx === spotlitIndex || idx + 1 === spotlitIndex}
                flowDirection="up"
                isActive={idx === spotlitIndex || idx + 1 === spotlitIndex}
              />
            )}
          </motion.div>
        );
      })}

      {/* Walkthrough explanation card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl mt-6"
        >
          <div className="bg-white border-2 border-royal-gold/30 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-royal-navy to-royal-burgundy px-6 py-3">
              <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-royal-gold" />
                {currentStep.title}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {/* Simple Version */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900 leading-relaxed font-medium">{currentStep.simpleVersion}</p>
              </div>

              {/* Detailed explanation */}
              <p className="text-sm text-gray-600 leading-relaxed">{currentStep.detail}</p>

              {/* Analogy */}
              <div className="flex items-start gap-3 bg-royal-navy/5 rounded-lg p-4">
                <Lightbulb className="w-5 h-5 text-royal-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-royal-navy uppercase tracking-wider">Think of it this way</span>
                  <p className="text-sm text-gray-600 mt-1">{currentStep.analogy}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center gap-3 mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={prev}
          disabled={step === 0}
          className="gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {step < totalSteps - 1 ? (
          <Button
            size="sm"
            onClick={next}
            className="gap-1 bg-royal-gold hover:bg-royal-gold/90 text-royal-navy"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={restart}
            className="gap-1 bg-royal-gold hover:bg-royal-gold/90 text-royal-navy"
          >
            <RotateCcw className="w-4 h-4" />
            Start Over
          </Button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCENARIO EXPLORER
// ═══════════════════════════════════════════════════════════

function ScenarioExplorer({
  visibleLayers,
  entitiesByLayer,
}: {
  visibleLayers: string[];
  entitiesByLayer: Record<string, Array<{ name: string; subtitle?: string | null }>>;
}) {
  const [selectedScenario, setSelectedScenario] = useState<TrustScenario | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearTimer();
    if (!isPlaying || !selectedScenario) return;
    if (activeStepIndex >= selectedScenario.steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    timerRef.current = setTimeout(() => {
      setActiveStepIndex(prev => prev + 1);
    }, 2000);
    return clearTimer;
  }, [isPlaying, activeStepIndex, selectedScenario, clearTimer]);

  const playScenario = (scenario: TrustScenario) => {
    clearTimer();
    setSelectedScenario(scenario);
    setActiveStepIndex(-1);
    setIsPlaying(false);
    timerRef.current = setTimeout(() => {
      setActiveStepIndex(0);
      setIsPlaying(true);
    }, 300);
  };

  const resetScenario = () => {
    setSelectedScenario(null);
    setActiveStepIndex(-1);
    setIsPlaying(false);
  };

  const actionByLayer: Record<string, string> = {};
  if (selectedScenario && activeStepIndex >= 0) {
    for (let i = 0; i <= activeStepIndex && i < selectedScenario.steps.length; i++) {
      const s = selectedScenario.steps[i];
      actionByLayer[s.layer] = s.action;
    }
  }

  return (
    <div className="flex flex-col items-center gap-0 py-4">
      {!selectedScenario ? (
        <div className="w-full max-w-3xl mb-6">
          <div className="text-center mb-6">
            <h3 className="font-cinzel text-lg font-bold text-royal-navy mb-1">What Happens When...</h3>
            <p className="text-sm text-gray-500 font-georgia italic">Pick a scenario to see the trust structure in action</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TRUST_SCENARIOS.map((scenario) => {
              const SIcon = scenario.icon;
              return (
                <motion.button
                  key={scenario.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => playScenario(scenario)}
                  aria-label={`Play scenario: ${scenario.question}`}
                  className="group text-left bg-white border border-gray-200 hover:border-royal-gold/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-gold focus-visible:ring-offset-2"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-royal-gold/10 flex items-center justify-center group-hover:bg-royal-gold/20 transition-colors">
                      <SIcon className="w-5 h-5 text-royal-gold" />
                    </div>
                    <Play className="w-4 h-4 text-gray-300 group-hover:text-royal-gold transition-colors ml-auto" />
                  </div>
                  <p className="text-sm font-medium text-royal-navy">{scenario.question}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <div className="w-full max-w-2xl mb-4">
            <div className="flex items-center justify-between bg-white border border-royal-gold/30 rounded-xl px-5 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-royal-gold/15 flex items-center justify-center">
                  {(() => { const SIcon = selectedScenario.icon; return <SIcon className="w-5 h-5 text-royal-gold" />; })()}
                </div>
                <div>
                  <p className="text-sm font-bold text-royal-navy">{selectedScenario.question}</p>
                  <p className="text-xs text-gray-400">
                    {activeStepIndex >= 0
                      ? `Step ${Math.min(activeStepIndex + 1, selectedScenario.steps.length)} of ${selectedScenario.steps.length}`
                      : "Starting..."}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={resetScenario} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {visibleLayers.map((layer, idx) => {
            const layerEntities = entitiesByLayer[layer] || [];
            const isActive = selectedScenario.highlightLayers.includes(layer);
            const hasAction = !!actionByLayer[layer];
            const currentStepLayer = activeStepIndex >= 0 && activeStepIndex < selectedScenario.steps.length
              ? selectedScenario.steps[activeStepIndex].layer
              : null;

            const isDimmed = !isActive && !hasAction;
            return (
              <motion.div key={layer} className="w-full flex flex-col items-center" aria-hidden={isDimmed ? true : undefined}>
                <LayerRow
                  layer={layer}
                  entities={layerEntities}
                  isHighlighted={false}
                  compact={false}
                  isDimmed={isDimmed}
                  isSpotlit={layer === currentStepLayer}
                  scenarioAction={hasAction ? actionByLayer[layer] : undefined}
                />
                {idx < visibleLayers.length - 1 && (
                  <SVGConnector
                    fromLayer={layer}
                    toLayer={visibleLayers[idx + 1]}
                    compact={false}
                    showFlow={
                      isActive && selectedScenario.highlightLayers.includes(visibleLayers[idx + 1])
                    }
                    flowDirection={selectedScenario.flowDirection}
                    isActive={isActive || !!actionByLayer[visibleLayers[idx + 1]]}
                  />
                )}
              </motion.div>
            );
          })}

          {/* Outcome card */}
          <AnimatePresence>
            {activeStepIndex >= selectedScenario.steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl mt-8"
              >
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-emerald-600" />
                    <span className="font-cinzel font-bold text-emerald-900">Result</span>
                  </div>
                  <p className="text-sm text-emerald-800 leading-relaxed">{selectedScenario.outcome}</p>
                  <div className="flex items-center gap-3 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setActiveStepIndex(-1);
                        setTimeout(() => { setActiveStepIndex(0); setIsPlaying(true); }, 300);
                      }}
                      className="text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      Replay
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetScenario}
                      className="text-gray-500"
                    >
                      Try Another Scenario
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EXPLORE MODE (Phase 5: hover interactions + Phase 8: staggered entry)
// ═══════════════════════════════════════════════════════════

function ExploreContent({
  entities,
  relationships,
  highlightLayer,
  compact,
}: {
  entities: Array<{ id: string; name: string; subtitle?: string | null; layer: string }>;
  relationships: Array<{ fromEntityId: string; toEntityId: string; relationshipType: string }>;
  highlightLayer?: string;
  compact: boolean;
}) {
  const [perspective, setPerspective] = useState<PerspectiveId>("howItWorks");
  const [deepDiveLayer, setDeepDiveLayer] = useState<string | null>(null);
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
  const activePerspective = PERSPECTIVES.find(p => p.id === perspective) || PERSPECTIVES[0];

  const layersToShow = compact ? COMPACT_LAYERS : PUBLIC_LAYERS;

  const entitiesByLayer: Record<string, Array<{ name: string; subtitle?: string | null }>> = {};
  for (const layer of layersToShow) {
    entitiesByLayer[layer] = entities
      .filter(e => e.layer === layer)
      .map(e => ({ name: e.name, subtitle: e.subtitle }));
  }

  const visibleLayers = layersToShow.filter(
    layer => (entitiesByLayer[layer] || []).length > 0 || layer === 'member'
  );

  // Adjacent layer check for connector hover
  const isConnectorAdjacentToHovered = (fromLayer: string, toLayer: string) => {
    if (!hoveredLayer) return undefined;
    return fromLayer === hoveredLayer || toLayer === hoveredLayer;
  };

  return (
    <div className={`flex flex-col items-center gap-0 ${compact ? "" : "py-4"}`}>
      {/* Perspective toggle */}
      {!compact && (
        <div className="flex justify-center mb-4">
          <ToggleGroup
            type="single"
            value={perspective}
            onValueChange={(val) => { if (val) setPerspective(val as PerspectiveId); }}
            className="bg-royal-navy/5 border border-royal-gold/20 rounded-full p-1 inline-flex"
          >
            {PERSPECTIVES.map((p) => {
              const PIcon = p.icon;
              return (
                <ToggleGroupItem
                  key={p.id}
                  value={p.id}
                  className={`flex items-center gap-1.5 font-cinzel text-xs rounded-full px-3 py-1.5 transition-colors data-[state=on]:bg-royal-gold/20 data-[state=on]:text-royal-navy data-[state=on]:font-bold text-gray-500 hover:text-royal-navy`}
                >
                  <PIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{p.label}</span>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>
      )}

      {/* Intro hint */}
      {!compact && (
        <AnimatePresence mode="wait">
          <motion.div
            key={perspective}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2 mb-4 text-sm text-gray-400 italic font-georgia"
          >
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>{activePerspective.introHint}</span>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Click-to-explore hint */}
      {!compact && (
        <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-300">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Click any layer to deep dive &middot; Hover to highlight connections</span>
        </div>
      )}

      {visibleLayers.map((layer, idx) => {
        const layerEntities = entitiesByLayer[layer] || [];
        const connectorKey = idx < visibleLayers.length - 1
          ? `${layer}→${visibleLayers[idx + 1]}`
          : undefined;

        return (
          <motion.div
            key={layer}
            variants={staggerItemVariants}
            className="w-full flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.4 }}
          >
            <LayerRow
              layer={layer}
              entities={layerEntities}
              isHighlighted={highlightLayer === layer}
              compact={compact}
              perspectiveText={!compact ? activePerspective.layers[layer] : undefined}
              perspective={!compact ? perspective : undefined}
              onDeepDiveToggle={!compact ? () => setDeepDiveLayer(deepDiveLayer === layer ? null : layer) : undefined}
              showDeepDive={false}
              hoveredLayer={hoveredLayer}
              onMouseEnter={!compact ? () => setHoveredLayer(layer) : undefined}
              onMouseLeave={!compact ? () => setHoveredLayer(null) : undefined}
            />
            {idx < visibleLayers.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (idx + 0.5) * 0.15, duration: 0.3 }}
              >
                <SVGConnector
                  fromLayer={layer}
                  toLayer={visibleLayers[idx + 1]}
                  compact={compact}
                  label={!compact ? activePerspective.connectors[connectorKey!] : undefined}
                  perspective={!compact ? perspective : undefined}
                  showFlow={!compact}
                  flowDirection="down"
                  isHovered={isConnectorAdjacentToHovered(layer, visibleLayers[idx + 1])}
                  onMouseEnter={!compact ? () => {
                    // Hovering connector highlights both adjacent layers
                    setHoveredLayer(layer);
                  } : undefined}
                  onMouseLeave={!compact ? () => setHoveredLayer(null) : undefined}
                />
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Deep Dive Drawer (Phase 7) */}
      <AnimatePresence>
        {deepDiveLayer && (
          <DeepDiveDrawer
            layer={deepDiveLayer}
            onClose={() => setDeepDiveLayer(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export default function TrustHierarchyDiagram({
  highlightLayer,
  compact = false,
  className = "",
}: TrustHierarchyDiagramProps) {
  const [mode, setMode] = useState<DiagramMode>("explore");

  const { data, isLoading } = useQuery<{
    entities: TrustEntity[];
    relationships: TrustRelationship[];
  }>({
    queryKey: ["/api/trust-structure/public"],
    staleTime: 5 * 60 * 1000,
  });

  const hasData = data && data.entities && data.entities.length > 0;
  const entities = hasData
    ? data.entities
    : FALLBACK_ENTITIES.map(e => ({ ...e, description: null, status: "active" }));
  const relationships = hasData
    ? data.relationships.filter(r => PRIMARY_RELATIONSHIPS.includes(r.relationshipType))
    : [];

  const layersToShow = compact ? COMPACT_LAYERS : PUBLIC_LAYERS;
  const entitiesByLayer: Record<string, Array<{ name: string; subtitle?: string | null }>> = {};
  for (const layer of layersToShow) {
    entitiesByLayer[layer] = entities
      .filter(e => e.layer === layer)
      .map(e => ({ name: e.name, subtitle: e.subtitle }));
  }
  const visibleLayers = layersToShow.filter(
    layer => (entitiesByLayer[layer] || []).length > 0 || layer === 'member'
  );

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-royal-gold" />
      </div>
    );
  }

  if (compact) {
    return (
      <TooltipProvider delayDuration={300}>
        <div className={className}>
          <ExploreContent
            entities={entities}
            relationships={relationships}
            highlightLayer={highlightLayer}
            compact
          />
        </div>
      </TooltipProvider>
    );
  }

  const MODE_OPTIONS: Array<{ id: DiagramMode; label: string; icon: typeof Compass; description: string }> = [
    { id: "explore", label: "Explore", icon: Compass, description: "Interactive diagram with perspectives" },
    { id: "walkthrough", label: "Guided Tour", icon: Footprints, description: "Step-by-step beginner walkthrough" },
    { id: "scenarios", label: "Scenarios", icon: Map, description: "See the trust in real-life situations" },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <div className={className}>
        {/* Mode Selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-1 sm:p-1.5 inline-flex gap-0.5 sm:gap-1 max-w-full">
            {MODE_OPTIONS.map((opt) => {
              const MIcon = opt.icon;
              const isActive = mode === opt.id;
              return (
                <Tooltip key={opt.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setMode(opt.id)}
                      aria-label={opt.description}
                      className={`
                        flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all
                        ${isActive
                          ? "bg-royal-navy text-white shadow-md"
                          : "text-gray-500 hover:text-royal-navy hover:bg-gray-50"
                        }
                      `}
                    >
                      <MIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden sm:inline">{opt.label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{opt.description}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Mode Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {mode === "explore" && (
              <StaggerContainer
                className="flex flex-col items-center"
                staggerDelay={0.12}
                viewportAmount={0.1}
              >
                <ExploreContent
                  key="explore"
                  entities={entities}
                  relationships={relationships}
                  highlightLayer={highlightLayer}
                  compact={false}
                />
              </StaggerContainer>
            )}

            {mode === "walkthrough" && (
              <WalkthroughOverlay
                entities={entities}
                visibleLayers={visibleLayers}
                entitiesByLayer={entitiesByLayer}
              />
            )}

            {mode === "scenarios" && (
              <ScenarioExplorer
                visibleLayers={visibleLayers}
                entitiesByLayer={entitiesByLayer}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
