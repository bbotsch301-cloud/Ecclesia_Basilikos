import type { TrustEntity, TrustRelationship } from "@shared/schema";

// ═══════════════════════════════════════════════════════════
// RESOLVED ENTITY — pulls all data from the trust structure
// ═══════════════════════════════════════════════════════════

export interface ResolvedEntity {
  entity: TrustEntity;
  parentAuthorities: { entity: TrustEntity; relationship: TrustRelationship }[];
  childEntities: { entity: TrustEntity; relationship: TrustRelationship }[];
  beneficiaryEntities: { entity: TrustEntity; relationship: TrustRelationship }[];
  benefitSources: { entity: TrustEntity; relationship: TrustRelationship }[];
  fundingSources: { entity: TrustEntity; relationship: TrustRelationship }[];
  fundingTargets: { entity: TrustEntity; relationship: TrustRelationship }[];
  oversightTargets: { entity: TrustEntity; relationship: TrustRelationship }[];
  coordinationTargets: { entity: TrustEntity; relationship: TrustRelationship }[];
  landStewardship: { entity: TrustEntity; relationship: TrustRelationship }[];
  remitsTo: { entity: TrustEntity; relationship: TrustRelationship }[];
  shepherdTargets: { entity: TrustEntity; relationship: TrustRelationship }[];
  shepherdSources: { entity: TrustEntity; relationship: TrustRelationship }[];
  teachTargets: { entity: TrustEntity; relationship: TrustRelationship }[];
  teachSources: { entity: TrustEntity; relationship: TrustRelationship }[];
  serveTargets: { entity: TrustEntity; relationship: TrustRelationship }[];
  serveSources: { entity: TrustEntity; relationship: TrustRelationship }[];
  titheTargets: { entity: TrustEntity; relationship: TrustRelationship }[];
  titheSources: { entity: TrustEntity; relationship: TrustRelationship }[];
  rootAuthority: TrustEntity | null;
  authorityChain: TrustEntity[];
}

export function resolveEntity(
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

  const benefitSources = incoming
    .filter(r => r.relationshipType === 'benefits')
    .map(r => ({ entity: findEntity(r.fromEntityId)!, relationship: r }))
    .filter(r => r.entity);

  const coordinationTargets = outgoing
    .filter(r => r.relationshipType === 'coordinates')
    .map(r => ({ entity: findEntity(r.toEntityId)!, relationship: r }))
    .filter(r => r.entity);

  const landStewardship = outgoing
    .filter(r => r.relationshipType === 'land')
    .map(r => ({ entity: findEntity(r.toEntityId)!, relationship: r }))
    .filter(r => r.entity);

  const remitsTo = outgoing
    .filter(r => r.relationshipType === 'remits')
    .map(r => ({ entity: findEntity(r.toEntityId)!, relationship: r }))
    .filter(r => r.entity);

  // Ecclesiastical relationships
  const shepherdTargets = outgoing
    .filter(r => r.relationshipType === 'shepherds')
    .map(r => ({ entity: findEntity(r.toEntityId)!, relationship: r }))
    .filter(r => r.entity);
  const shepherdSources = incoming
    .filter(r => r.relationshipType === 'shepherds')
    .map(r => ({ entity: findEntity(r.fromEntityId)!, relationship: r }))
    .filter(r => r.entity);
  const teachTargets = outgoing
    .filter(r => r.relationshipType === 'teaches')
    .map(r => ({ entity: findEntity(r.toEntityId)!, relationship: r }))
    .filter(r => r.entity);
  const teachSources = incoming
    .filter(r => r.relationshipType === 'teaches')
    .map(r => ({ entity: findEntity(r.fromEntityId)!, relationship: r }))
    .filter(r => r.entity);
  const serveTargets = outgoing
    .filter(r => r.relationshipType === 'serves')
    .map(r => ({ entity: findEntity(r.toEntityId)!, relationship: r }))
    .filter(r => r.entity);
  const serveSources = incoming
    .filter(r => r.relationshipType === 'serves')
    .map(r => ({ entity: findEntity(r.fromEntityId)!, relationship: r }))
    .filter(r => r.entity);
  const titheTargets = outgoing
    .filter(r => r.relationshipType === 'tithes')
    .map(r => ({ entity: findEntity(r.toEntityId)!, relationship: r }))
    .filter(r => r.entity);
  const titheSources = incoming
    .filter(r => r.relationshipType === 'tithes')
    .map(r => ({ entity: findEntity(r.fromEntityId)!, relationship: r }))
    .filter(r => r.entity);

  // Walk authority chain
  let rootAuthority: TrustEntity | null = null;
  const authorityChain: TrustEntity[] = [];
  let current = entity;
  const visited = new Set<string>();
  while (current) {
    visited.add(current.id);
    authorityChain.unshift(current);
    const parentRel = relationships.find(
      r => r.toEntityId === current.id && ['authority', 'grants', 'establishes_pma'].includes(r.relationshipType)
    );
    if (!parentRel) { rootAuthority = current; break; }
    const parent = findEntity(parentRel.fromEntityId);
    if (!parent || visited.has(parent.id)) { rootAuthority = current; break; }
    current = parent;
  }

  return {
    entity, parentAuthorities, childEntities, beneficiaryEntities, benefitSources,
    fundingSources, fundingTargets, oversightTargets, coordinationTargets,
    landStewardship, remitsTo, shepherdTargets, shepherdSources,
    teachTargets, teachSources, serveTargets, serveSources,
    titheTargets, titheSources, rootAuthority, authorityChain,
  };
}

// ═══════════════════════════════════════════════════════════
// VARIABLE RESOLUTION — replaces {{key}} with entity data
// ═══════════════════════════════════════════════════════════

export const TEMPLATE_VARIABLES = [
  { key: 'entity.name', label: 'Entity Name', category: 'Entity' },
  { key: 'entity.charter', label: 'Charter / Purpose', category: 'Entity' },
  { key: 'entity.legalBasis', label: 'Legal Basis', category: 'Entity' },
  { key: 'entity.description', label: 'Description', category: 'Entity' },
  { key: 'entity.trusteeLabel', label: 'Trustee Label', category: 'Entity' },
  { key: 'entity.protectorLabel', label: 'Protector Label', category: 'Entity' },
  { key: 'entity.notes', label: 'Notes', category: 'Entity' },
  { key: 'entity.subtitle', label: 'Subtitle', category: 'Entity' },
  { key: 'entity.location', label: 'Location', category: 'Entity' },
  { key: 'parent.names', label: 'Parent Authority Names', category: 'Relationships' },
  { key: 'root.name', label: 'Root Authority Name', category: 'Relationships' },
  { key: 'children.list', label: 'Child Entities List', category: 'Relationships' },
  { key: 'beneficiaries.list', label: 'Beneficiaries List', category: 'Relationships' },
  { key: 'funding.sources', label: 'Funding Sources', category: 'Relationships' },
  { key: 'funding.targets', label: 'Funding Targets', category: 'Relationships' },
  { key: 'oversight.targets', label: 'Oversight Targets', category: 'Relationships' },
  { key: 'benefit.sources', label: 'Benefit Sources', category: 'Relationships' },
  { key: 'coordination.targets', label: 'Coordination Targets', category: 'Relationships' },
  { key: 'land.stewardship', label: 'Land Stewardship', category: 'Relationships' },
  { key: 'remits.targets', label: 'Remits To', category: 'Relationships' },
  { key: 'shepherds.targets', label: 'Shepherds (outgoing)', category: 'Ecclesiastical' },
  { key: 'shepherds.sources', label: 'Shepherded By', category: 'Ecclesiastical' },
  { key: 'teaches.targets', label: 'Teaches (outgoing)', category: 'Ecclesiastical' },
  { key: 'teaches.sources', label: 'Taught By', category: 'Ecclesiastical' },
  { key: 'serves.targets', label: 'Serves (outgoing)', category: 'Ecclesiastical' },
  { key: 'serves.sources', label: 'Served By', category: 'Ecclesiastical' },
  { key: 'tithe.targets', label: 'Tithe Recipients', category: 'Ecclesiastical' },
  { key: 'tithe.sources', label: 'Tithe Sources', category: 'Ecclesiastical' },
  { key: 'authority.chain', label: 'Full Authority Chain', category: 'Governance' },
  { key: 'date', label: 'Current Date', category: 'Meta' },
];

export function buildVariableMap(resolved: ResolvedEntity): Record<string, string> {
  const e = resolved.entity;
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return {
    'entity.name': e.name || '',
    'entity.charter': e.charter || '(No charter defined.)',
    'entity.legalBasis': e.legalBasis || '(No legal basis defined.)',
    'entity.description': e.description || '(No description defined.)',
    'entity.trusteeLabel': e.trusteeLabel || '(Not assigned)',
    'entity.protectorLabel': e.protectorLabel || '(Not assigned)',
    'entity.notes': e.notes || '',
    'entity.subtitle': e.subtitle || '',
    'entity.location': e.location || '',
    'parent.names': resolved.parentAuthorities.map(p => p.entity.name).join(', ') || 'N/A',
    'root.name': resolved.rootAuthority?.name || e.name,
    'children.list': resolved.childEntities.map(c => `${c.entity.name} — ${c.entity.subtitle || c.entity.entityType}`).join('\n') || '(None defined)',
    'beneficiaries.list': resolved.beneficiaryEntities.map(b => b.entity.name).join('\n') || 'All PMA members',
    'funding.sources': resolved.fundingSources.map(f => f.entity.name).join(', ') || '(None)',
    'funding.targets': resolved.fundingTargets.map(f => f.entity.name).join(', ') || '(None)',
    'oversight.targets': resolved.oversightTargets.map(o => `${o.entity.name} — ${o.entity.subtitle || ''}`).join('\n') || '(None defined)',
    'benefit.sources': resolved.benefitSources.map(b => `${b.entity.name}${b.relationship.label ? ` — ${b.relationship.label}` : ''}`).join('\n') || '(None)',
    'coordination.targets': resolved.coordinationTargets.map(c => `${c.entity.name}${c.relationship.label ? ` — ${c.relationship.label}` : ''}`).join('\n') || '(None)',
    'land.stewardship': resolved.landStewardship.map(l => `${l.entity.name}${l.relationship.label ? ` — ${l.relationship.label}` : ''}`).join('\n') || '(None)',
    'remits.targets': resolved.remitsTo.map(rt => `${rt.entity.name}${rt.relationship.label ? ` — ${rt.relationship.label}` : ''}`).join('\n') || '(None)',
    // Ecclesiastical variables
    'shepherds.targets': resolved.shepherdTargets.map(s => `${s.entity.name}${s.relationship.label ? ` — ${s.relationship.label}` : ''}`).join('\n') || '(None)',
    'shepherds.sources': resolved.shepherdSources.map(s => `${s.entity.name}${s.relationship.label ? ` — ${s.relationship.label}` : ''}`).join('\n') || '(None)',
    'teaches.targets': resolved.teachTargets.map(t => `${t.entity.name}${t.relationship.label ? ` — ${t.relationship.label}` : ''}`).join('\n') || '(None)',
    'teaches.sources': resolved.teachSources.map(t => `${t.entity.name}${t.relationship.label ? ` — ${t.relationship.label}` : ''}`).join('\n') || '(None)',
    'serves.targets': resolved.serveTargets.map(s => `${s.entity.name}${s.relationship.label ? ` — ${s.relationship.label}` : ''}`).join('\n') || '(None)',
    'serves.sources': resolved.serveSources.map(s => `${s.entity.name}${s.relationship.label ? ` — ${s.relationship.label}` : ''}`).join('\n') || '(None)',
    'tithe.targets': resolved.titheTargets.map(t => `${t.entity.name}${t.relationship.label ? ` — ${t.relationship.label}` : ''}`).join('\n') || '(None)',
    'tithe.sources': resolved.titheSources.map(t => `${t.entity.name}${t.relationship.label ? ` — ${t.relationship.label}` : ''}`).join('\n') || '(None)',
    // Authority chain
    'authority.chain': resolved.authorityChain.map(e => e.name).join(' → ') || e.name,
    'date': today,
  };
}

export function resolveVariables(templateHtml: string, resolved: ResolvedEntity): string {
  const vars = buildVariableMap(resolved);
  return templateHtml.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const trimmed = key.trim();
    return vars[trimmed] !== undefined ? vars[trimmed] : match;
  });
}
