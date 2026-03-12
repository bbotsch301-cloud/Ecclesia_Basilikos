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
  rootAuthority: TrustEntity | null;
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
    benefitSources,
    fundingSources,
    fundingTargets,
    oversightTargets,
    coordinationTargets,
    landStewardship,
    remitsTo,
    rootAuthority,
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
