import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Printer,
  ChevronDown,
  ChevronRight,
  ScrollText,
} from "lucide-react";
import type { TrustEntity, TrustRelationship } from "@shared/schema";

// ═══════════════════════════════════════════════════════════
// VARIABLE RESOLVER — pulls all data from the trust structure
// ═══════════════════════════════════════════════════════════

interface ResolvedEntity {
  entity: TrustEntity;
  parentAuthorities: { entity: TrustEntity; relationship: TrustRelationship }[];
  childEntities: { entity: TrustEntity; relationship: TrustRelationship }[];
  beneficiaryEntities: { entity: TrustEntity; relationship: TrustRelationship }[];
  fundingSources: { entity: TrustEntity; relationship: TrustRelationship }[];
  fundingTargets: { entity: TrustEntity; relationship: TrustRelationship }[];
  oversightTargets: { entity: TrustEntity; relationship: TrustRelationship }[];
  rootAuthority: TrustEntity | null; // walk up the authority chain to the root
}

function resolveEntity(
  entity: TrustEntity,
  allEntities: TrustEntity[],
  relationships: TrustRelationship[]
): ResolvedEntity {
  const findEntity = (id: string) => allEntities.find(e => e.id === id);

  const incoming = relationships.filter(r => r.toEntityId === entity.id);
  const outgoing = relationships.filter(r => r.fromEntityId === entity.id);

  const parentAuthorities = incoming
    .filter(r => ['authority', 'grants', 'establishes_pma'].includes(r.relationshipType))
    .map(r => ({ entity: findEntity(r.fromEntityId)!, relationship: r }))
    .filter(r => r.entity);

  const childEntities = outgoing
    .filter(r => ['grants', 'establishes_pma', 'oversees', 'authority'].includes(r.relationshipType))
    .map(r => ({ entity: findEntity(r.toEntityId)!, relationship: r }))
    .filter(r => r.entity);

  const beneficiaryEntities = outgoing
    .filter(r => r.relationshipType === 'benefits')
    .map(r => ({ entity: findEntity(r.toEntityId)!, relationship: r }))
    .filter(r => r.entity);

  const fundingSources = incoming
    .filter(r => r.relationshipType === 'funds')
    .map(r => ({ entity: findEntity(r.fromEntityId)!, relationship: r }))
    .filter(r => r.entity);

  const fundingTargets = outgoing
    .filter(r => r.relationshipType === 'funds')
    .map(r => ({ entity: findEntity(r.toEntityId)!, relationship: r }))
    .filter(r => r.entity);

  const oversightTargets = outgoing
    .filter(r => r.relationshipType === 'oversees')
    .map(r => ({ entity: findEntity(r.toEntityId)!, relationship: r }))
    .filter(r => r.entity);

  // Walk up authority chain to find root
  let rootAuthority: TrustEntity | null = null;
  let current = entity;
  const visited = new Set<string>();
  while (current) {
    visited.add(current.id);
    const parentRel = relationships.find(
      r => r.toEntityId === current.id && ['authority', 'grants', 'establishes_pma'].includes(r.relationshipType)
    );
    if (!parentRel) { rootAuthority = current; break; }
    const parent = findEntity(parentRel.fromEntityId);
    if (!parent || visited.has(parent.id)) { rootAuthority = current; break; }
    current = parent;
  }

  return {
    entity,
    parentAuthorities,
    childEntities,
    beneficiaryEntities,
    fundingSources,
    fundingTargets,
    oversightTargets,
    rootAuthority,
  };
}

// ═══════════════════════════════════════════════════════════
// DOCUMENT TEMPLATES — per entity type
// ═══════════════════════════════════════════════════════════

interface DocumentSection {
  title: string;
  content: string;
  collapsible?: boolean;
}

function generateDocument(resolved: ResolvedEntity): { title: string; subtitle: string; sections: DocumentSection[] } {
  const { entity } = resolved;
  const layer = entity.layer;

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const parentNames = resolved.parentAuthorities.map(p => p.entity.name).join(', ') || 'N/A';
  const rootName = resolved.rootAuthority?.name || entity.name;

  switch (layer) {
    case 'charter':
      return generateCharterDocument(resolved, today, rootName);
    case 'trust':
      return generateGovernanceDocument(resolved, today, parentNames, rootName);
    case 'operational':
      return generateSubTrustDocument(resolved, today, parentNames, rootName);
    case 'pma':
      return generatePMADocument(resolved, today, parentNames, rootName);
    case 'chapter':
      return generateChapterDocument(resolved, today, parentNames);
    case 'commune':
      return generateCommuneDocument(resolved, today, parentNames);
    case 'guild':
      return generateGuildDocument(resolved, today, parentNames);
    case 'project':
      return generateProjectDocument(resolved, today, parentNames);
    case 'beneficiary':
      return generateBeneficiaryDocument(resolved, today);
    default:
      return generateGenericDocument(resolved, today);
  }
}

function generateCharterDocument(r: ResolvedEntity, today: string, _rootName: string): ReturnType<typeof generateDocument> {
  const e = r.entity;
  const childList = r.childEntities.map(c => `    ${c.entity.name} — ${c.entity.subtitle || c.entity.entityType}`).join('\n') || '    (None defined)';

  return {
    title: `DECLARATION OF TRUST`,
    subtitle: e.name,
    sections: [
      {
        title: "Preamble",
        content: `This Declaration of Trust is established on ${today} under the authority of divine law, constitutional principles, and the inherent right of free association.\n\nThis instrument creates and governs "${e.name}" as an irrevocable express trust, serving as the constitutional root and covenant charter for the entire trust ecosystem described herein.`,
      },
      {
        title: "Article I — Purpose & Covenant",
        content: e.charter || '(No charter/purpose statement defined. Edit this entity to add one.)',
      },
      {
        title: "Article II — Legal Foundation",
        content: e.legalBasis || '(No legal basis defined. Edit this entity to add one.)',
      },
      {
        title: "Article III — Governance Structure",
        content: `Trustee: ${e.trusteeLabel || '(Not assigned)'}\n\nProtector: ${e.protectorLabel || '(Not assigned)'}\n\nThe Trustee shall administer the Trust corpus and operations in accordance with this Declaration. The Protector Council shall provide oversight and ensure alignment with the covenant purpose.`,
      },
      {
        title: "Article IV — Description & Scope",
        content: e.description || '(No description defined.)',
      },
      {
        title: "Article V — Sub-Trusts & Entities Authorized",
        content: `The following entities are authorized under this trust:\n\n${childList}`,
      },
      {
        title: "Article VI — Amendments & Irrevocability",
        content: `This trust is irrevocable. Amendments to this Declaration require unanimous approval of the Protector Council.\n\n${e.notes || ''}`,
      },
      {
        title: "Article VII — Signatures & Attestation",
        content: `IN WITNESS WHEREOF, the Grantor has executed this Declaration of Trust on the date first written above.\n\n\n____________________________________\n${e.trusteeLabel || 'Trustee'}\nDate: _______________\n\n\n____________________________________\n${e.protectorLabel || 'Protector'}\nDate: _______________`,
      },
    ],
  };
}

function generateGovernanceDocument(r: ResolvedEntity, today: string, parentNames: string, rootName: string): ReturnType<typeof generateDocument> {
  const e = r.entity;
  const assetArm = r.childEntities.filter(c => c.entity.layer === 'operational');
  const peopleArm = r.childEntities.filter(c => c.entity.layer === 'pma');
  const assetList = assetArm.map(c => `    ${c.entity.name} — ${c.entity.subtitle || ''}`).join('\n') || '    (None)';
  const peopleList = peopleArm.map(c => `    ${c.entity.name} — ${c.entity.subtitle || ''}`).join('\n') || '    (None)';

  return {
    title: `TRUST ADMINISTRATION AGREEMENT`,
    subtitle: e.name,
    sections: [
      {
        title: "Preamble",
        content: `This Trust Administration Agreement is executed on ${today} under the authority of ${parentNames}.\n\n"${e.name}" serves as the governance anchor for the trust ecosystem rooted in ${rootName}.`,
      },
      {
        title: "Article I — Mission & Charter",
        content: e.charter || '(No charter defined.)',
      },
      {
        title: "Article II — Authority Derived",
        content: `This trust derives its authority from: ${parentNames}.\n\n${e.legalBasis || ''}`,
      },
      {
        title: "Article III — Governance",
        content: `Administrative Trustee: ${e.trusteeLabel || '(Not assigned)'}\n\nProtector/Oversight: ${e.protectorLabel || '(Not assigned)'}`,
      },
      {
        title: "Article IV — Asset Stewardship Arm",
        content: `The following operational trusts are authorized under the asset stewardship arm:\n\n${assetList}\n\nEach sub-trust holds and administers specific categories of assets for the benefit of the community.`,
      },
      {
        title: "Article V — Community Governance Arm",
        content: `The following community governance entities are authorized:\n\n${peopleList}\n\nThe PMA organizes members as beneficiaries and stewards. Neither arm controls the other; both are authorized independently by this governance trust.`,
      },
      {
        title: "Article VI — Scope & Operations",
        content: e.description || '(No description defined.)',
      },
      {
        title: "Article VII — Additional Provisions",
        content: e.notes || '(No additional provisions.)',
      },
      {
        title: "Signatures",
        content: `Executed on ${today}.\n\n\n____________________________________\n${e.trusteeLabel || 'Trustee'}\n\n\n____________________________________\n${e.protectorLabel || 'Protector'}`,
      },
    ],
  };
}

function generateSubTrustDocument(r: ResolvedEntity, today: string, parentNames: string, rootName: string): ReturnType<typeof generateDocument> {
  const e = r.entity;
  const beneficiaries = r.beneficiaryEntities.map(b => `    ${b.entity.name}`).join('\n') || '    All PMA members (as defined by the community governance arm)';
  const fundingInfo = r.fundingSources.length > 0
    ? `This trust receives funding from: ${r.fundingSources.map(f => f.entity.name).join(', ')}.`
    : '';
  const fundingOut = r.fundingTargets.length > 0
    ? `This trust allocates funds to: ${r.fundingTargets.map(f => f.entity.name).join(', ')}.`
    : '';

  return {
    title: `SUB-TRUST DECLARATION`,
    subtitle: e.name,
    sections: [
      {
        title: "Preamble",
        content: `This Sub-Trust Declaration is executed on ${today} under the authority granted by ${parentNames}, ultimately rooted in ${rootName}.`,
      },
      {
        title: "Article I — Purpose",
        content: e.charter || '(No purpose statement defined.)',
      },
      {
        title: "Article II — Scope of Operations",
        content: e.description || '(No description defined.)',
      },
      {
        title: "Article III — Legal Basis",
        content: e.legalBasis || '(No legal basis defined.)',
      },
      {
        title: "Article IV — Governance",
        content: `Trustee: ${e.trusteeLabel || '(Not assigned)'}\n\nOversight: ${e.protectorLabel || '(Not assigned)'}\n\nAuthority derived from: ${parentNames}`,
      },
      {
        title: "Article V — Beneficiaries",
        content: `Assets held by this trust are for the benefit of:\n\n${beneficiaries}`,
      },
      {
        title: "Article VI — Financial Provisions",
        content: [fundingInfo, fundingOut, e.notes].filter(Boolean).join('\n\n') || '(No financial provisions defined.)',
      },
      {
        title: "Signatures",
        content: `Executed on ${today}.\n\n\n____________________________________\n${e.trusteeLabel || 'Trustee'}\n\n\n____________________________________\n${e.protectorLabel || 'Oversight'}`,
      },
    ],
  };
}

function generatePMADocument(r: ResolvedEntity, today: string, parentNames: string, rootName: string): ReturnType<typeof generateDocument> {
  const e = r.entity;
  const subEntities = r.oversightTargets.map(c => `    ${c.entity.name} — ${c.entity.subtitle || ''}`).join('\n') || '    (None defined)';

  return {
    title: `PRIVATE MEMBERSHIP ASSOCIATION AGREEMENT`,
    subtitle: e.name,
    sections: [
      {
        title: "Preamble",
        content: `This Private Membership Association Agreement is established on ${today} under the authority of ${parentNames}, rooted in ${rootName}.\n\nThis agreement governs the voluntary association of members under the ecclesia covenant.`,
      },
      {
        title: "Article I — Purpose & Mission",
        content: e.charter || '(No charter defined.)',
      },
      {
        title: "Article II — Legal Foundation",
        content: e.legalBasis || '(No legal basis defined.)',
      },
      {
        title: "Article III — Membership",
        content: `${e.description || ''}\n\nMembership is voluntary and requires execution of this agreement. Members are beneficiaries of trust assets held by the asset stewardship arm, not owners. All member interactions are private and protected by constitutional association rights.`,
      },
      {
        title: "Article IV — Governance",
        content: `PMA Administrator: ${e.trusteeLabel || '(Not assigned)'}\n\nOversight Body: ${e.protectorLabel || '(Not assigned)'}`,
      },
      {
        title: "Article V — Community Structure",
        content: `The following organizational units operate under this PMA:\n\n${subEntities}`,
      },
      {
        title: "Article VI — Member Rights & Obligations",
        content: `Members have the right to:\n    • Beneficial use of trust assets as allocated\n    • Participation in community governance\n    • Access to community resources and programs\n    • Voluntary withdrawal at any time\n\nMembers have the obligation to:\n    • Abide by the covenant charter\n    • Contribute labor, skills, or resources as agreed\n    • Respect the governance structure\n    • Maintain the private nature of the association`,
      },
      {
        title: "Article VII — Additional Provisions",
        content: e.notes || '(No additional provisions.)',
      },
      {
        title: "Signatures",
        content: `I, the undersigned, voluntarily enter into this Private Membership Association Agreement.\n\n\nMember: ____________________________________\nDate: _______________\n\n\nPMA Administrator: ____________________________________\n${e.trusteeLabel || ''}\nDate: _______________`,
      },
    ],
  };
}

function generateChapterDocument(r: ResolvedEntity, today: string, parentNames: string): ReturnType<typeof generateDocument> {
  const e = r.entity;
  const children = r.childEntities.map(c => `    ${c.entity.name} — ${c.entity.subtitle || ''}`).join('\n') || '    (None defined yet)';

  return {
    title: `CHAPTER CHARTER`,
    subtitle: e.name,
    sections: [
      { title: "Authorization", content: `This Chapter Charter is issued on ${today}, authorized by ${parentNames}.` },
      { title: "Article I — Purpose", content: e.charter || e.description || '(No purpose defined.)' },
      { title: "Article II — Governance", content: `Chapter Steward: ${e.trusteeLabel || '(Not assigned)'}\nOversight: ${e.protectorLabel || '(Not assigned)'}` },
      { title: "Article III — Sub-Units", content: `The following units operate within this chapter:\n\n${children}` },
      { title: "Article IV — Provisions", content: e.notes || '(No additional provisions.)' },
      { title: "Signatures", content: `Chapter Steward: ____________________________________\nDate: _______________` },
    ],
  };
}

function generateCommuneDocument(r: ResolvedEntity, today: string, parentNames: string): ReturnType<typeof generateDocument> {
  const e = r.entity;
  return {
    title: `COMMUNE OPERATING AGREEMENT`,
    subtitle: e.name,
    sections: [
      { title: "Authorization", content: `This Commune Operating Agreement is issued on ${today}, authorized by ${parentNames}.` },
      { title: "Article I — Purpose", content: e.charter || e.description || '(No purpose defined.)' },
      { title: "Article II — Governance", content: `Commune Lead: ${e.trusteeLabel || '(Not assigned)'}\nOversight: ${e.protectorLabel || '(Not assigned)'}` },
      { title: "Article III — Provisions", content: e.notes || '(No additional provisions.)' },
      { title: "Signatures", content: `Commune Lead: ____________________________________\nDate: _______________` },
    ],
  };
}

function generateGuildDocument(r: ResolvedEntity, today: string, parentNames: string): ReturnType<typeof generateDocument> {
  const e = r.entity;
  return {
    title: `GUILD CHARTER`,
    subtitle: e.name,
    sections: [
      { title: "Authorization", content: `This Guild Charter is issued on ${today}, authorized by ${parentNames}.` },
      { title: "Article I — Purpose & Scope", content: e.charter || e.description || '(No purpose defined.)' },
      { title: "Article II — Governance", content: `Guild Master: ${e.trusteeLabel || '(Not assigned)'}\nOversight: ${e.protectorLabel || '(Not assigned)'}` },
      { title: "Article III — Cross-Chapter Operations", content: `This guild operates across all chapters and geographic boundaries. Members from any chapter may participate based on relevant skills and expertise.` },
      { title: "Article IV — Provisions", content: e.notes || '(No additional provisions.)' },
      { title: "Signatures", content: `Guild Master: ____________________________________\nDate: _______________` },
    ],
  };
}

function generateProjectDocument(r: ResolvedEntity, today: string, parentNames: string): ReturnType<typeof generateDocument> {
  const e = r.entity;
  return {
    title: `PROJECT AUTHORIZATION`,
    subtitle: e.name,
    sections: [
      { title: "Authorization", content: `This Project Authorization is issued on ${today}, authorized by ${parentNames}.` },
      { title: "Article I — Scope & Deliverables", content: e.charter || e.description || '(No scope defined.)' },
      { title: "Article II — Governance", content: `Project Lead: ${e.trusteeLabel || '(Not assigned)'}\nOversight: ${e.protectorLabel || '(Not assigned)'}` },
      { title: "Article III — Provisions", content: e.notes || '(No additional provisions.)' },
      { title: "Signatures", content: `Project Lead: ____________________________________\nDate: _______________\n\nAuthorizing Body: ____________________________________\nDate: _______________` },
    ],
  };
}

function generateBeneficiaryDocument(r: ResolvedEntity, today: string): ReturnType<typeof generateDocument> {
  const e = r.entity;
  const benefitSources = r.entity.id
    ? [] // We'd need incoming "benefits" relationships
    : [];

  return {
    title: `BENEFICIAL INTEREST DECLARATION`,
    subtitle: e.name,
    sections: [
      { title: "Declaration", content: `This Beneficial Interest Declaration is issued on ${today}.\n\nAll members of the trust ecosystem are hereby recognized as both beneficiaries and stewards.` },
      { title: "Article I — Rights", content: e.charter || e.description || '(No rights defined.)' },
      { title: "Article II — Obligations", content: `Members contribute labor, skills, and resources back to the community through the PMA. The relationship is reciprocal.` },
      { title: "Article III — Provisions", content: e.notes || '(No additional provisions.)' },
    ],
  };
}

function generateGenericDocument(r: ResolvedEntity, today: string): ReturnType<typeof generateDocument> {
  const e = r.entity;
  return {
    title: `TRUST ENTITY DOCUMENT`,
    subtitle: e.name,
    sections: [
      { title: "Overview", content: `Document generated on ${today} for "${e.name}".` },
      { title: "Purpose", content: e.charter || e.description || '(No purpose defined.)' },
      { title: "Legal Basis", content: e.legalBasis || '(No legal basis defined.)' },
      { title: "Governance", content: `Trustee: ${e.trusteeLabel || '(Not assigned)'}\nProtector: ${e.protectorLabel || '(Not assigned)'}` },
      { title: "Notes", content: e.notes || '(No notes.)' },
    ],
  };
}

// ═══════════════════════════════════════════════════════════
// DOCUMENT PREVIEW COMPONENT
// ═══════════════════════════════════════════════════════════

export function DocumentBuilderButton({
  entity,
  allEntities,
  relationships,
}: {
  entity: TrustEntity;
  allEntities: TrustEntity[];
  relationships: TrustRelationship[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="secondary"
        className="h-7 text-xs bg-white/15 hover:bg-white/25 text-white border-0"
        onClick={() => setOpen(true)}
      >
        <FileText className="w-3 h-3 mr-1" /> Build Document
      </Button>
      {open && (
        <DocumentPreviewDialog
          entity={entity}
          allEntities={allEntities}
          relationships={relationships}
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function DocumentPreviewDialog({
  entity,
  allEntities,
  relationships,
  open,
  onClose,
}: {
  entity: TrustEntity;
  allEntities: TrustEntity[];
  relationships: TrustRelationship[];
  open: boolean;
  onClose: () => void;
}) {
  const resolved = resolveEntity(entity, allEntities, relationships);
  const doc = generateDocument(resolved);
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const printRef = useRef<HTMLDivElement>(null);

  const toggleSection = (idx: number) => {
    setCollapsed(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = printRef.current.innerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${doc.title} — ${doc.subtitle}</title>
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
        ${content}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-3 border-b bg-slate-50 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <Badge className="text-[10px] mb-1 bg-royal-navy text-white border-0">
                <ScrollText className="w-3 h-3 mr-1" />
                Trust Instrument
              </Badge>
              <DialogTitle className="font-cinzel text-lg">
                {doc.title}
              </DialogTitle>
              <p className="text-sm text-gray-500">{doc.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-1" /> Print
              </Button>
              <Button size="sm" variant="outline" onClick={handlePrint}>
                <Download className="w-4 h-4 mr-1" /> Export
              </Button>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            This document is generated from the trust structure data. Edit the entity fields to update the document content.
          </p>
        </DialogHeader>

        {/* Document body — scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-6">
          {/* Printable version (hidden but used for print/export) */}
          <div ref={printRef} className="hidden">
            <h1>{doc.title}</h1>
            <div className="doc-subtitle">{doc.subtitle}</div>
            <hr className="separator" />
            {doc.sections.map((section, idx) => (
              <div key={idx}>
                <div className="section-title">{section.title}</div>
                <div className="section-content">{section.content}</div>
              </div>
            ))}
          </div>

          {/* Visual preview */}
          <div className="max-w-2xl mx-auto">
            {/* Document title block */}
            <div className="text-center mb-8">
              <h1 className="font-cinzel text-xl tracking-[0.15em] text-gray-800 uppercase">
                {doc.title}
              </h1>
              <p className="font-cinzel text-base text-gray-500 mt-1">{doc.subtitle}</p>
              <div className="mt-3 mx-auto w-32 border-t-2 border-slate-700" />
            </div>

            {/* Sections */}
            <div className="space-y-1">
              {doc.sections.map((section, idx) => {
                const isCollapsed = collapsed[idx] === true;

                return (
                  <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection(idx)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
                    >
                      {isCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                      <span className="font-cinzel text-sm font-semibold tracking-wide text-gray-700 uppercase">
                        {section.title}
                      </span>
                    </button>
                    {!isCollapsed && (
                      <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                        <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-gray-700">
                          {section.content}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <div className="mx-auto w-32 border-t border-gray-300 mb-3" />
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                Generated from Trust Structure Data
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Edit entity fields in the sidebar to update this document
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
