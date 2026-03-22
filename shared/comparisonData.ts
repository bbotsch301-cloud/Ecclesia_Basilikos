export interface ComparisonRow {
  dimension: string;
  babylon: string;
  kingdom: string;
}

export interface Comparison {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  category: 'identity' | 'priesthood' | 'government' | 'economy' | 'legal';
  summary: string;
  keyRevelation: string;
  scriptureReferences: string[];
  comparisonTable: ComparisonRow[];
  pdfPath?: string;
  featured: boolean;
}

export const comparisons: Comparison[] = [
  {
    id: '1',
    title: 'Two Births',
    subtitle: 'Flesh vs Spirit',
    slug: 'two-births',
    category: 'identity',
    summary: 'Babylon\'s Registry of Flesh vs Heaven\'s Registry of Spirit',
    keyRevelation: 'The system\'s greatest counterfeit is birth itself: it reduces a living soul to a legal fiction, tied to debt and statutes from the first breath. In Christ, your name is written in the Book of Life, sealed by the Spirit, and beyond Babylon\'s reach.',
    scriptureReferences: ['John 3:3', 'Luke 10:20', 'Romans 8:17', '1 Peter 2:9', 'Ephesians 1:13', 'Jeremiah 31:33'],
    comparisonTable: [
      {
        dimension: 'Registry',
        babylon: 'Birth certificate, ALL CAPS name, social security number. Entered into Babylon\'s system as property.',
        kingdom: 'Born again, name written in the Lamb\'s Book of Life (John 3:3; Luke 10:20). Entered into heaven\'s eternal registry.'
      },
      {
        dimension: 'Identity',
        babylon: 'Legal fiction, citizen, taxpayer, consumer, subject of the state.',
        kingdom: 'Son/daughter of God, ambassador, priest, co-heir with Christ (Romans 8:17; 1 Peter 2:9).'
      },
      {
        dimension: 'Mark',
        babylon: 'Footprints, blood tests, ID cards, digital records.',
        kingdom: 'Sealed by the Holy Spirit (Ephesians 1:13). Law written on the heart (Jeremiah 31:33).'
      },
      {
        dimension: 'Economy',
        babylon: 'Immediately tied to debt: birth bonds, trust accounts, taxation for life.',
        kingdom: 'Immediately tied to inheritance: incorruptible treasure, eternal life, heavenly citizenship (1 Peter 1:4).'
      },
      {
        dimension: 'Jurisdiction',
        babylon: 'Governed by statutes, courts, and clerks; presumed guilty/debtor.',
        kingdom: 'Governed by Christ\'s covenant, grace, and law of liberty (James 1:25).'
      },
      {
        dimension: 'Outcome',
        babylon: 'Ends in death certificate, probate, and estate seized by Babylon.',
        kingdom: 'Ends in resurrection, eternal life, incorruptible inheritance (John 11:25–26).'
      }
    ],
    featured: true,
    pdfPath: '/attached_assets/two_births_flesh_vs_spirit_1759423474631.pdf'
  },
  {
    id: '2',
    title: 'Two Registries',
    subtitle: 'Man vs Heaven',
    slug: 'two-registries',
    category: 'identity',
    summary: 'Babylon\'s Registry of Man vs The New Covenant Registry of Heaven',
    keyRevelation: 'Babylon records you at birth, assigns numbers, and defines you as property of the state. Your value is reduced to labor, taxes, and compliance. Christ records you at new birth. You are sealed with the Spirit, your name is written in the Book of Life, and your inheritance is incorruptible.',
    scriptureReferences: ['Philippians 3:20', 'Revelation 20:12'],
    comparisonTable: [
      {
        dimension: 'Entry Point',
        babylon: 'Birth certificate, vital records, creation of ALL CAPS legal fiction tied to state registry.',
        kingdom: 'Born again, written in the Book of Life (Phil. 3:20, Rev. 20:12). Heavenly citizenship from spiritual rebirth.'
      },
      {
        dimension: 'Identity',
        babylon: 'Legal fiction / corporate person. Seen as subject, taxpayer, employee, consumer.',
        kingdom: 'Living soul / ambassador of Christ. Royal priesthood, steward, co-heir with Christ.'
      },
      {
        dimension: 'Rights',
        babylon: 'Granted as privileges by government. Can be suspended, taxed, revoked.',
        kingdom: 'Inherent in covenant. Irrevocable promises given by God, not subject to man\'s approval.'
      },
      {
        dimension: 'Authority',
        babylon: 'State and statutes define existence, obligations, and jurisdiction.',
        kingdom: 'Christ defines existence and authority. Operates under divine law and covenant freedom.'
      },
      {
        dimension: 'Obligations',
        babylon: 'Bound by debt, taxation, licenses, statutes of Babylon.',
        kingdom: 'Bound by love, stewardship, and Kingdom purpose. Servant of Christ, free from Babylon\'s claims.'
      }
    ],
    featured: true,
    pdfPath: '/attached_assets/two_registries_man_vs_heaven_1759423474632.pdf'
  },
  {
    id: '3',
    title: 'Two Creations',
    subtitle: 'Image of the Beast vs Image of God',
    slug: 'two-creations',
    category: 'identity',
    summary: 'From Shadow → Counterfeit → Fulfillment',
    keyRevelation: 'Shadow: God\'s covenant people bore outward marks pointing to Christ. Counterfeit: Babylon mimics this through IDs, numbers, and digital marks, reducing souls to commerce. Fulfillment: In Christ, you are sealed with the Spirit, made new, and crowned with eternal glory.',
    scriptureReferences: ['John 3:3', '2 Corinthians 5:17', 'Romans 8:17', '1 Peter 2:9', 'Ephesians 1:13', 'Revelation 22:4', 'Revelation 13:16-17', '1 Corinthians 15:53'],
    comparisonTable: [
      {
        dimension: 'Origin',
        babylon: 'Babylon creates a legal fiction at birth: ALL CAPS name, ID numbers, state seals.',
        kingdom: 'Born again in Christ: new creation, incorruptible life (John 3:3; 2 Cor. 5:17).'
      },
      {
        dimension: 'Identity',
        babylon: 'Citizen, taxpayer, consumer. Defined by numbers: SSN, ID, digital code.',
        kingdom: 'Son/daughter, ambassador, priest, co-heir (Romans 8:17; 1 Peter 2:9).'
      },
      {
        dimension: 'Mark',
        babylon: 'Mark of commerce: barcodes, IDs, biometrics, CBDCs (Rev. 13:16–17).',
        kingdom: 'Seal of the Spirit; God\'s name written on foreheads (Eph. 1:13; Rev. 22:4).'
      },
      {
        dimension: 'Purpose',
        babylon: 'To reduce men to units of commerce, labor, and consumption.',
        kingdom: 'To reign with Christ, steward creation, expand the Kingdom (Rev. 5:10).'
      },
      {
        dimension: 'Outcome',
        babylon: 'Ends in judgment; souls traded as commodities (Rev. 18:13).',
        kingdom: 'Glorification and eternal reign with Christ (Rev. 22:5).'
      }
    ],
    featured: true,
    pdfPath: '/attached_assets/two_creations_improved_1759423474632.pdf'
  },
  {
    id: '4',
    title: 'Two Lands',
    subtitle: 'Possession vs Inheritance',
    slug: 'two-lands',
    category: 'economy',
    summary: 'Babylon\'s Debt-Based Possession vs The Kingdom\'s Covenant Inheritance',
    keyRevelation: 'Babylon\'s Possession: You never truly own land; you are a tenant of the state. Property taxes and mortgages ensure perpetual dependence. Kingdom\'s Inheritance: What God gives cannot be taxed, seized, or revoked. The meek shall inherit the earth, and the inheritance is incorruptible.',
    scriptureReferences: ['Matthew 5:5', 'Joshua 1:3', 'Psalm 24:1', '1 Peter 1:4', 'Leviticus 25:23', 'Revelation 21:1-3'],
    comparisonTable: [
      {
        dimension: 'Title',
        babylon: 'Deed, title, or mortgage. Land is never fully owned; it is always held in trust for the state through property tax.',
        kingdom: 'Allodial inheritance: "The meek shall inherit the earth" (Matthew 5:5). What God gives cannot be taxed or taken.'
      },
      {
        dimension: 'Access',
        babylon: 'Purchased through fiat currency, contracts, and debt instruments.',
        kingdom: 'Given as covenant gift from God: allotment and stewardship (Joshua 1:3; Psalm 24:1).'
      },
      {
        dimension: 'Security',
        babylon: 'Subject to foreclosure, seizure, or forfeiture for failure to pay taxes or debts.',
        kingdom: 'Eternal inheritance incorruptible, cannot be seized or foreclosed (1 Peter 1:4).'
      },
      {
        dimension: 'Purpose',
        babylon: 'Land is used for commerce, speculation, and exploitation of resources.',
        kingdom: 'Land is used for fruitfulness, community life, stewardship, and rest (Leviticus 25:23).'
      }
    ],
    featured: false,
    pdfPath: '/attached_assets/two_lands_possession_vs_inheritance_1759423474632.pdf'
  },
  {
    id: '5',
    title: 'Levitical Priesthood vs Babylonian Currency',
    subtitle: 'The Shadow and the Counterfeit',
    slug: 'levitical-vs-currency',
    category: 'priesthood',
    summary: 'How the Modern Debt System Mirrors the Old Covenant Sacrificial System',
    keyRevelation: 'The Levitical system was God\'s shadow, pointing to Christ: endless sacrifices revealing the need for a once-for-all Redeemer. The Babylonian currency system copies this shadow: endless debt payments, taxes, and interest that never redeem, only enslave.',
    scriptureReferences: ['Hebrews 10:1-4', 'Hebrews 9:7', 'John 19:30', 'Numbers 3:6-10', 'Numbers 18:20-21'],
    comparisonTable: [
      {
        dimension: 'Sacrifices',
        babylon: 'Endless bills, mortgages, taxes, insurance, interest payments. Never final, always recurring.',
        kingdom: 'Christ\'s once-for-all sacrifice ended the cycle forever: "It is finished" (John 19:30).'
      },
      {
        dimension: 'Priesthood',
        babylon: 'Bankers, lawyers, tax collectors administer debt offerings and enforce compliance.',
        kingdom: 'Christ is the eternal High Priest; believers are a royal priesthood (Hebrews 7:24; 1 Peter 2:9).'
      },
      {
        dimension: 'Cycle',
        babylon: 'Debt cycle is endless; mortgages ("death pledge"), credit, and taxes require perpetual payments.',
        kingdom: 'Eternal redemption; jubilee fulfilled; rest in Christ (Hebrews 9:12).'
      },
      {
        dimension: 'Outcome',
        babylon: 'Never frees from debt; constant reminder of obligation. Perpetual guilt and arrears.',
        kingdom: 'Freedom, forgiveness, inheritance incorruptible; eternal rest (Revelation 21:7).'
      }
    ],
    featured: true,
    pdfPath: '/attached_assets/levitical_vs_currency_system_1759423474632.pdf'
  },
  {
    id: '6',
    title: 'Two Priesthoods',
    subtitle: 'Levi vs Melchizedek',
    slug: 'two-priesthoods',
    category: 'priesthood',
    summary: 'The Shadow of the Law vs The Eternal Priesthood of Christ',
    keyRevelation: 'Levitical Priesthood: Bound to genealogy, law, and endless sacrifice. It kept people under continual atonement but never brought perfection. Melchizedek Priesthood: Christ, the eternal High Priest, offered Himself once for all. He mediates a better covenant, gives direct access to God, and secures an eternal inheritance.',
    scriptureReferences: ['Hebrews 7:17', 'Hebrews 10:12-14', 'Hebrews 4:16', 'Matthew 27:51', 'Hebrews 8:6', 'Hebrews 8:10', 'Romans 8:17', 'Hebrews 7:22-25'],
    comparisonTable: [
      {
        dimension: 'Origin',
        babylon: 'Instituted under Moses; priesthood tied to genealogy of Levi (Numbers 3:6-10).',
        kingdom: 'Eternal order; Christ is High Priest "after the order of Melchizedek" (Hebrews 7:17).'
      },
      {
        dimension: 'Sacrifice',
        babylon: 'Daily sacrifices of bulls and goats, continual atonement for sin (Leviticus 4:35).',
        kingdom: 'One perfect sacrifice: Christ offered Himself once for all (Hebrews 10:12-14).'
      },
      {
        dimension: 'Access',
        babylon: 'Only high priest entered Holy of Holies once a year with blood (Hebrews 9:7).',
        kingdom: 'The veil was torn; all believers now have access to the throne of grace (Hebrews 4:16; Matthew 27:51).'
      },
      {
        dimension: 'Law',
        babylon: 'Priests maintained covenant through rituals and statutes (Leviticus 8–9).',
        kingdom: 'Christ mediates a better covenant, written on hearts not stone (Hebrews 8:6, 10).'
      },
      {
        dimension: 'Inheritance',
        babylon: 'Priests received tithes from Israel; no land inheritance (Numbers 18:20-21).',
        kingdom: 'Christ and His body inherit all things: heaven, earth, and nations (Romans 8:17; Revelation 21:7).'
      },
      {
        dimension: 'Duration',
        babylon: 'Temporal, limited, weak through flesh, destined to fade (Hebrews 7:18).',
        kingdom: 'Eternal, indestructible life, seated forever as King-Priest (Hebrews 7:16, 24).'
      }
    ],
    featured: true,
    pdfPath: '/attached_assets/two_priesthoods_levi_vs_melchizedek_1759423474632.pdf'
  },
  {
    id: '7',
    title: 'Two Legal Systems',
    subtitle: 'Statutes vs Covenant',
    slug: 'two-legal-systems',
    category: 'legal',
    summary: 'Babylon\'s Counterfeit Legalism vs Christ\'s Covenant Freedom',
    keyRevelation: 'Statutes: Babylon\'s legal system binds men with endless codes, licenses, and presumptions. It reduces living souls to corporate fictions and governs through coercion. Covenant: Christ\'s legal system operates through trust, covenant, and scripture. It presumes freedom in Him, empowers stewardship, and governs through love and truth.',
    scriptureReferences: ['James 1:25'],
    comparisonTable: [
      {
        dimension: 'Foundation',
        babylon: 'Codes, statutes, and regulations created by legislatures. Rooted in man-made authority.',
        kingdom: 'Covenants, trusts, and scripture. Rooted in divine law and eternal promises.'
      },
      {
        dimension: 'Identity',
        babylon: 'You are treated as a legal fiction (ALL CAPS name). Rights reduced to privileges.',
        kingdom: 'You are a living soul, priest, ambassador, and co-heir. Rights are God-given and irrevocable.'
      },
      {
        dimension: 'Mechanisms',
        babylon: 'Licenses, permits, registrations. Compliance enforced through presumption and penalty.',
        kingdom: 'Freedom exercised through trust, faith, and covenant. Obedience flows from love, not coercion.'
      },
      {
        dimension: 'Presumptions',
        babylon: 'Presumption of guilt, debt, and obligation until proven otherwise.',
        kingdom: 'Presumption of freedom in Christ. Burden rests on Babylon to prove claims.'
      },
      {
        dimension: 'Purpose',
        babylon: 'To regulate commerce, extract revenue, and control behavior.',
        kingdom: 'To steward creation, administer justice, and expand the Kingdom.'
      }
    ],
    featured: false,
    pdfPath: '/attached_assets/two_legal_systems_statutes_vs_covenant_1759423474632.pdf'
  },
  {
    id: '8',
    title: '501(c)(3) vs 508(c)(1)(a)',
    subtitle: 'Two Covenants: Caesar vs Christ',
    slug: '501c3-vs-508c1a',
    category: 'legal',
    summary: 'Mind-Blowing Comparison of Church Tax Status Options',
    keyRevelation: '501(c)(3): A covenant with the state, exchanging freedom for benefits, creating a religious corporation whose prophetic voice is muted. 508(c)(1)(a): A covenant with Christ, where the church is recognized inherently, free to speak, steward, and operate as the embassy of heaven.',
    scriptureReferences: ['Matthew 22:21'],
    comparisonTable: [
      {
        dimension: 'Founding Covenant',
        babylon: 'Created under state law; chartered as a corporate person. Permission granted by IRS.',
        kingdom: 'Rooted in the New Covenant; established by Christ Himself. Recognition is inherent, not applied for.'
      },
      {
        dimension: 'Source of Authority',
        babylon: 'Caesar / IRS is the final arbiter of existence and compliance.',
        kingdom: 'Christ the King is the head; the ekklesia is His embassy on earth.'
      },
      {
        dimension: 'Jurisdiction',
        babylon: 'Domestic, civil, statutory.',
        kingdom: 'Foreign to Babylon; heavenly, ecclesiastical, eternal.'
      },
      {
        dimension: 'Speech & Prophetic Voice',
        babylon: 'Bound by the Johnson Amendment: silence required on politics and \'offensive\' truth.',
        kingdom: 'Free to proclaim the whole counsel of God, without censor or gag order.'
      },
      {
        dimension: 'Benefits',
        babylon: 'Tax-exemption granted by the IRS (and revocable). Limited fundraising and bound by state definition of \'charity.\'',
        kingdom: 'Immunity from taxation inherent in ecclesiastical law. Unlimited ministerial fundraising, governed by Kingdom purpose.'
      },
      {
        dimension: 'Identity',
        babylon: 'Religious organization: an artificial entity with state-granted life.',
        kingdom: 'The Ekklesia Basilikos: a living body, eternal covenant community, stewarding heaven\'s economy.'
      }
    ],
    featured: true,
    pdfPath: '/attached_assets/501c_vs_508c1a_mindblowing_fixed_1759423474632.pdf'
  },
  {
    id: '9',
    title: 'Two Governments',
    subtitle: 'State vs Ecclesia',
    slug: 'two-governments',
    category: 'government',
    summary: 'Babylon\'s Counterfeit State vs Christ\'s Ecclesiastical Government',
    keyRevelation: 'State Government: A counterfeit government where men rule over men by coercion, licenses, and fear. Ecclesia Government: The true Kingdom government, where Christ rules through covenant trust, love, and stewardship. Every member is a priest, ambassador, and co-heir.',
    scriptureReferences: ['Jeremiah 31:33'],
    comparisonTable: [
      {
        dimension: 'Source of Authority',
        babylon: 'Constitutions, statutes, corporate charters. Man-made law.',
        kingdom: 'Christ the King. His covenant is the law written on hearts (Jer. 31:33).'
      },
      {
        dimension: 'Structure',
        babylon: 'Pyramid: centralized hierarchy with rulers at the top, subjects at the bottom.',
        kingdom: 'Circle / trust web: decentralized, Christ as head, all members co-heirs.'
      },
      {
        dimension: 'Power',
        babylon: 'Coercion, force, and fear. Citizens obey under threat of penalty.',
        kingdom: 'Voluntary covenant, love, and truth. Obedience flows from relationship with Christ.'
      },
      {
        dimension: 'Rights',
        babylon: 'Granted as privileges by the state; revocable at any time.',
        kingdom: 'Inherent, God-given, eternal; no man or institution can revoke.'
      },
      {
        dimension: 'Accountability',
        babylon: 'To rulers, agencies, and courts of Babylon.',
        kingdom: 'To Christ, covenant, and the body of believers.'
      },
      {
        dimension: 'Goal',
        babylon: 'Control, taxation, regulation, preservation of empire.',
        kingdom: 'Stewardship, freedom, discipleship, expansion of the Kingdom.'
      }
    ],
    featured: false,
    pdfPath: '/attached_assets/two_governments_state_vs_ecclesia_1759423474632.pdf'
  },
  {
    id: '10',
    title: 'Levitical → Babylonian → Melchizedek',
    subtitle: 'From Shadow, to Counterfeit, to Fulfillment',
    slug: 'levitical-babylon-melchizedek',
    category: 'priesthood',
    summary: 'The Complete Arc of Priesthood Systems',
    keyRevelation: 'Shadow → Counterfeit → Fulfillment. Levitical Priesthood: God\'s shadow system of endless sacrifices reminding Israel of sin and pointing to Messiah. Babylonian Currency System: the Counterfeit of Levi, with endless debt keeping men in cycles of guilt. Melchizedek Priesthood: Fulfillment in Christ with one sacrifice, eternal covenant, and freedom from debt.',
    scriptureReferences: ['Hebrews 10:12-14', 'Colossians 2:14', 'Hebrews 7:24', '1 Peter 2:9', 'Hebrews 9:12', 'Revelation 21:7'],
    comparisonTable: [
      {
        dimension: 'Sacrifices',
        babylon: 'Endless payments: taxes, mortgages, interest, fees; never final.',
        kingdom: 'Christ\'s once-for-all sacrifice; debt nailed to the cross (Hebrews 10:12–14; Colossians 2:14).'
      },
      {
        dimension: 'Priesthood',
        babylon: 'Bankers, lawyers, tax collectors as mediators of debt and commerce.',
        kingdom: 'Christ as eternal High Priest; believers as royal priesthood (Hebrews 7:24; 1 Peter 2:9).'
      },
      {
        dimension: 'Temple',
        babylon: 'Banks, courts, and government halls serve as modern temples of debt.',
        kingdom: 'Heavenly temple not made with hands; body of Christ as temple (Hebrews 9:11; 1 Cor. 3:16).'
      },
      {
        dimension: 'Cycle',
        babylon: 'Endless debt cycle; bills and obligations repeat without end.',
        kingdom: 'Eternal redemption; jubilee fulfilled; rest in Christ (Hebrews 9:12).'
      },
      {
        dimension: 'Outcome',
        babylon: 'Reminder of debt and obligation; perpetual arrears.',
        kingdom: 'Freedom, forgiveness, inheritance incorruptible; eternal rest (Revelation 21:7).'
      }
    ],
    featured: true,
    pdfPath: '/attached_assets/levitical_babylon_melchizedek_1759423474632.pdf'
  },
  {
    id: '11',
    title: 'Prophetic Trajectories',
    subtitle: 'Levi → Christ vs Babylon → Beast',
    slug: 'prophetic-trajectories',
    category: 'priesthood',
    summary: 'God\'s Shadow Fulfilled in Christ vs Babylon\'s Counterfeit Fulfilled in Antichrist',
    keyRevelation: 'Every soul follows one trajectory: Shadow → Christ or Counterfeit → Beast. Levitical System: God\'s shadow, a tutor leading Israel to Christ. It pointed forward to the once-for-all sacrifice and eternal priesthood of Jesus. Babylonian System: Satan\'s counterfeit, a false shadow leading humanity to Antichrist. It points forward to the Beast, demanding total control and worship through commerce.',
    scriptureReferences: ['Hebrews 10:1-14', 'Hebrews 7:17', 'Revelation 13:16-17', '2 Thessalonians 2:4', 'John 2:19', 'Hebrews 9:11', 'Revelation 19:20'],
    comparisonTable: [
      {
        dimension: 'Sacrifices',
        babylon: 'Endless debt and payments point to the Beast\'s demand for total worship through commerce (Rev. 13:16–17).',
        kingdom: 'Endless animal sacrifices pointed to Christ\'s once-for-all offering (Hebrews 10:1–14).'
      },
      {
        dimension: 'Priesthood',
        babylon: 'Babylon\'s false priesthood of bankers, lawyers, politicians points to Antichrist exalting himself as god (2 Thess. 2:4).',
        kingdom: 'Levitical priesthood pointed to Christ as eternal High Priest after Melchizedek (Heb. 7:17).'
      },
      {
        dimension: 'Temple',
        babylon: 'Temples of commerce (banks, courts, capitols) point to Mystery Babylon, the harlot city (Rev. 17–18).',
        kingdom: 'Earthly temple pointed to Christ\'s body and heavenly sanctuary (John 2:19; Hebrews 9:11).'
      },
      {
        dimension: 'Outcome',
        babylon: 'Fulfilled in the Beast: total slavery, commerce-mark control, destruction in fire (Rev. 19:20).',
        kingdom: 'Fulfilled in Christ: freedom, forgiveness, inheritance, eternal life.'
      }
    ],
    featured: false,
    pdfPath: '/attached_assets/levitical_vs_babylon_prophetic_trajectories_1759423474632.pdf'
  }
];

export const getFeaturedComparisons = () => comparisons.filter(c => c.featured);

export const getComparisonsByCategory = (category: Comparison['category']) => 
  comparisons.filter(c => c.category === category);

export const getComparisonBySlug = (slug: string) => 
  comparisons.find(c => c.slug === slug);
