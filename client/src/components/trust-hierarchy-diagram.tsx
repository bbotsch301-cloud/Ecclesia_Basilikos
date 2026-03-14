import { useState, useEffect, useCallback, useRef } from "react";
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
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import StaggerContainer, { staggerItemVariants } from "@/components/ui/stagger-container";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

// Progressive sizing for desktop pyramid effect
const LAYER_SIZING: Record<string, { maxWidth: string; border: string; shadow: string }> = {
  covenant:    { maxWidth: "max-w-2xl",     border: "border-2", shadow: "shadow-lg" },
  body:        { maxWidth: "max-w-[38rem]", border: "border-2", shadow: "shadow-md" },
  stewardship: { maxWidth: "max-w-xl",      border: "border",   shadow: "shadow-sm" },
  assembly:    { maxWidth: "max-w-lg",      border: "border",   shadow: "shadow-sm" },
  member:      { maxWidth: "max-w-md",      border: "border",   shadow: "shadow-sm" },
};

// ═══════════════════════════════════════════════════════════
// ANIMATED FLOW PARTICLES
// ═══════════════════════════════════════════════════════════

function FlowParticle({ direction, delay, color }: { direction: "down" | "up"; delay: number; color: string }) {
  return (
    <motion.div
      className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${color}`}
      initial={{
        opacity: 0,
        y: direction === "down" ? -8 : 32,
        scale: 0.5,
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: direction === "down" ? [- 8, 32] : [32, -8],
        scale: [0.5, 1, 1, 0.5],
      }}
      transition={{
        duration: 1.8,
        delay,
        repeat: Infinity,
        repeatDelay: 1.5,
        ease: "easeInOut",
      }}
    />
  );
}

function AnimatedConnector({
  fromLayer,
  toLayer,
  compact,
  label: labelOverride,
  perspective,
  showFlow,
  flowDirection,
  isActive,
}: {
  fromLayer: string;
  toLayer: string;
  compact: boolean;
  label?: string;
  perspective?: PerspectiveId;
  showFlow?: boolean;
  flowDirection?: "down" | "up";
  isActive?: boolean;
}) {
  const connectorKey = `${fromLayer}→${toLayer}`;
  const label = labelOverride ?? CONNECTOR_LABELS[connectorKey];

  if (compact) {
    return (
      <div className="flex flex-col items-center py-1">
        <div className="w-px h-4 bg-royal-gold/40" />
        <ChevronDown className="w-4 h-4 text-royal-gold/60 -mt-1" />
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center py-2 transition-opacity duration-300 ${isActive === false ? "opacity-20" : ""}`}>
      <div className="relative w-px h-3 border-l border-dashed border-royal-gold/40">
        {showFlow && (
          <>
            <FlowParticle direction={flowDirection || "down"} delay={0} color={flowDirection === "up" ? "bg-royal-gold" : "bg-royal-gold/80"} />
            <FlowParticle direction={flowDirection || "down"} delay={0.6} color={flowDirection === "up" ? "bg-royal-gold" : "bg-royal-gold/80"} />
          </>
        )}
      </div>
      {label && (
        <AnimatePresence mode="wait">
          <motion.span
            key={`${perspective || "default"}-${label}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center text-xs font-georgia italic text-royal-gold/80 bg-royal-gold/10 border border-royal-gold/20 rounded-full px-3 py-0.5 my-1"
          >
            {label}
          </motion.span>
        </AnimatePresence>
      )}
      <ChevronDown className={`w-4 h-4 text-royal-gold/60 ${flowDirection === "up" ? "rotate-180" : ""}`} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEEP DIVE PANEL
// ═══════════════════════════════════════════════════════════

function DeepDivePanel({ layer, onClose }: { layer: string; onClose: () => void }) {
  const content = LAYER_DEEP_DIVE[layer];
  const config = LAYER_CONFIG[layer];
  const colors = LAYER_ROYAL_COLORS[layer];
  if (!content || !config || !colors) return null;

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg mt-2 overflow-hidden">
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-3 bg-gradient-to-r ${colors.gradient}`}>
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${colors.accent}`} />
            <span className={`font-cinzel font-bold ${colors.text}`}>Deep Dive: {config.label}</span>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* ELI5 */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-amber-800">Explain Like I'm 5</span>
            </div>
            <p className="text-sm text-amber-900 leading-relaxed">{content.eli5}</p>
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
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// LAYER ROW (updated with click-to-expand deep dive)
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
}) {
  const config = LAYER_CONFIG[layer];
  const colors = LAYER_ROYAL_COLORS[layer];
  const biblicalLabel = BIBLICAL_LABELS[layer];
  const plainEnglish = perspectiveText || LAYER_PLAIN_ENGLISH[layer];
  const sizing = LAYER_SIZING[layer] || { maxWidth: "max-w-2xl", border: "border", shadow: "shadow-sm" };
  if (!config || !colors) return null;

  const Icon = config.icon;
  const layerIndex = LAYERS_ORDER.indexOf(layer);
  const hasDeepDive = !!LAYER_DEEP_DIVE[layer];

  const [operationalOpen, setOperationalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center w-full">
      <motion.div
        animate={{
          opacity: isDimmed ? 0.25 : 1,
          scale: isSpotlit ? 1.02 : 1,
        }}
        transition={{ duration: 0.4 }}
        className={`
          relative w-full ${sizing.maxWidth} rounded-xl ${sizing.border} overflow-visible transition-all
          ${colors.border} ${sizing.shadow}
          ${isHighlighted ? "ring-2 ring-royal-gold ring-offset-2 shadow-lg shadow-royal-gold/20" : ""}
          ${isSpotlit ? "ring-2 ring-royal-gold ring-offset-2 shadow-xl shadow-royal-gold/30" : ""}
          ${compact ? "p-3" : "p-0"}
          ${!compact && hasDeepDive ? "cursor-pointer" : ""}
        `}
        onClick={!compact && hasDeepDive && onDeepDiveToggle ? onDeepDiveToggle : undefined}
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
          <div className="grid md:grid-cols-[160px,1fr] items-stretch overflow-hidden rounded-xl">
            {/* Layer label sidebar */}
            <div className={`${colors.bg} p-4 md:p-5 flex flex-col justify-center items-center md:items-start gap-1`}>
              <span className={`inline-block text-[10px] font-semibold ${colors.accent} bg-white/10 px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                Layer {layerIndex + 1}
              </span>
              <Icon className={`w-8 h-8 ${colors.accent} mt-1`} />
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
                <span className={`text-[10px] ${colors.accent} font-georgia italic`}>
                  {biblicalLabel}
                </span>
              )}
            </div>

            {/* Entity cards */}
            <div className="p-4 md:p-5 bg-white">
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
                    <Collapsible open={operationalOpen} onOpenChange={setOperationalOpen}>
                      <div className="flex items-center justify-between">
                        <CollapsibleTrigger className="flex items-center gap-2 text-left group">
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${operationalOpen ? 'rotate-180' : ''}`} />
                          <span className="text-sm text-gray-600">
                            <span className="font-medium text-royal-navy">{entities.length} specialized trusts</span>
                            {" "}managing different asset types
                          </span>
                        </CollapsibleTrigger>
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
                      <CollapsibleContent>
                        <AnimatePresence>
                          {operationalOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex flex-wrap gap-2 mt-3"
                            >
                              {entities.map((entity, i) => (
                                <div
                                  key={i}
                                  className="inline-flex flex-col bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                                >
                                  <div className="flex items-center gap-2">
                                    <Icon className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-sm font-medium text-royal-navy">{entity.name}</span>
                                  </div>
                                  {entity.subtitle && (
                                    <span className="text-xs text-gray-400 ml-5.5">{entity.subtitle}</span>
                                  )}
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CollapsibleContent>
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
                    </Collapsible>
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

      {/* Deep Dive Panel */}
      {!compact && (
        <AnimatePresence>
          {showDeepDive && (
            <div className={`w-full ${sizing.maxWidth}`}>
              <DeepDivePanel layer={layer} onClose={onDeepDiveToggle!} />
            </div>
          )}
        </AnimatePresence>
      )}
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
              <AnimatedConnector
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
              {/* ELI5 */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900 leading-relaxed font-medium">{currentStep.eli5}</p>
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

  // Clear any pending timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Auto-play scenario steps
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
    // Start playing after a brief delay to allow render
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

  // Build action map for current scenario step
  const actionByLayer: Record<string, string> = {};
  if (selectedScenario && activeStepIndex >= 0) {
    for (let i = 0; i <= activeStepIndex && i < selectedScenario.steps.length; i++) {
      const s = selectedScenario.steps[i];
      actionByLayer[s.layer] = s.action;
    }
  }

  return (
    <div className="flex flex-col items-center gap-0 py-4">
      {/* Scenario picker */}
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
          {/* Active scenario header */}
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

          {/* Diagram with scenario highlights */}
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
                  <AnimatedConnector
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

          {/* Outcome card — shows when all steps are done */}
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
// EXPLORE MODE (original diagram with deep-dive upgrade)
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
  const activePerspective = PERSPECTIVES.find(p => p.id === perspective) || PERSPECTIVES[0];

  // Escape key closes deep dive panel
  useEffect(() => {
    if (!deepDiveLayer) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDeepDiveLayer(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [deepDiveLayer]);

  const layersToShow = compact ? COMPACT_LAYERS : PUBLIC_LAYERS;

  // Group entities by layer
  const entitiesByLayer: Record<string, Array<{ name: string; subtitle?: string | null }>> = {};
  for (const layer of layersToShow) {
    entitiesByLayer[layer] = entities
      .filter(e => e.layer === layer)
      .map(e => ({ name: e.name, subtitle: e.subtitle }));
  }

  const visibleLayers = layersToShow.filter(
    layer => (entitiesByLayer[layer] || []).length > 0 || layer === 'member'
  );

  return (
    <div className={`flex flex-col items-center gap-0 ${compact ? "" : "py-4"}`}>
      {/* Perspective toggle — full mode only */}
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

      {/* Intro hint — full mode only */}
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
          <span>Click any layer to deep dive</span>
        </div>
      )}

      {visibleLayers.map((layer, idx) => {
        const layerEntities = entitiesByLayer[layer] || [];
        const connectorKey = idx < visibleLayers.length - 1
          ? `${layer}→${visibleLayers[idx + 1]}`
          : undefined;

        return (
          <motion.div key={layer} variants={staggerItemVariants} className="w-full flex flex-col items-center">
            <LayerRow
              layer={layer}
              entities={layerEntities}
              isHighlighted={highlightLayer === layer}
              compact={compact}
              perspectiveText={!compact ? activePerspective.layers[layer] : undefined}
              perspective={!compact ? perspective : undefined}
              onDeepDiveToggle={!compact ? () => setDeepDiveLayer(deepDiveLayer === layer ? null : layer) : undefined}
              showDeepDive={deepDiveLayer === layer}
            />
            {idx < visibleLayers.length - 1 && (
              <AnimatedConnector
                fromLayer={layer}
                toLayer={visibleLayers[idx + 1]}
                compact={compact}
                label={!compact ? activePerspective.connectors[connectorKey!] : undefined}
                perspective={!compact ? perspective : undefined}
                showFlow={!compact}
                flowDirection="down"
              />
            )}
          </motion.div>
        );
      })}
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

  // Use API data if available, otherwise fall back to static
  const hasData = data && data.entities && data.entities.length > 0;
  const entities = hasData
    ? data.entities
    : FALLBACK_ENTITIES.map(e => ({ ...e, description: null, status: "active" }));
  const relationships = hasData
    ? data.relationships.filter(r => PRIMARY_RELATIONSHIPS.includes(r.relationshipType))
    : [];

  // Shared layer computation for walkthrough/scenario modes
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
