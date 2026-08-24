import type {
    IntakeDraft,
    PricebookItem,
    ProposalDetail,
    ProposalRepository,
    ProposalSummary,
    ScopeItem,
} from '@/types/estimatedesk';

const baseProposal: ProposalDetail = {
    id: 'ed-1048',
    customer: 'Maya Thompson',
    email: 'maya.thompson@example.com',
    phone: '(707) 555-0148',
    address: '478 Cordoba Ln, Vacaville, CA 95688',
    company: 'Roofing Craftsmen',
    license: 'CA Lic. #1042187',
    submitter: 'Alex Morgan',
    submittedAt: 'Aug 22, 2026 · 9:42 AM',
    status: 'ready',
    total: 21780,
    revisionCount: 2,
    revisions: [
        {
            id: 'ed-1048-r2',
            label: 'Revision 2',
            createdAt: 'Aug 24, 2026',
            reason: 'Added skylight replacement',
            status: 'ready',
            total: 23030,
        },
        {
            id: 'ed-1048-r1',
            label: 'Revision 1',
            createdAt: 'Aug 23, 2026',
            reason: 'Updated shingle selection',
            status: 'ready',
            total: 21780,
        },
    ],
    snapshot: {
        id: 'snap-1048-v1',
        revision: 1,
        createdAt: 'Aug 22, 2026',
        validThrough: 'Sep 21, 2026',
        expired: false,
        measurementSource: 'EagleView XML · Report 53409152',
        roofSquares: 24.04,
        orderSquares: 26.68,
        wastePercent: 11,
        predominantPitch: '5/12',
        facets: 9,
        packages: [
            {
                id: 'essential',
                name: 'Good',
                subtitle: 'Essential protection',
                material: 'GAF Timberline NS',
                warranty: '10-year workmanship',
                price: 18920,
                description:
                    'A dependable architectural roofing system with proven protection.',
                features: [
                    'Architectural shingles',
                    'Synthetic underlayment',
                    'Standard ridge ventilation',
                ],
            },
            {
                id: 'signature',
                name: 'Better',
                subtitle: 'Our most popular system',
                material: 'GAF Timberline HDZ',
                warranty: '25-year workmanship',
                price: 21780,
                description:
                    'High-definition shingles and upgraded weather protection for lasting value.',
                features: [
                    'LayerLock shingles',
                    'WeatherWatch leak barrier',
                    'Cobra ridge ventilation',
                ],
                recommended: true,
            },
            {
                id: 'craftsman',
                name: 'Best',
                subtitle: 'Maximum protection',
                material: 'GAF Timberline UHDZ',
                warranty: 'Golden Pledge warranty',
                price: 25640,
                description:
                    'Premium dimensional shingles with the strongest complete-system warranty.',
                features: [
                    'Premium UHDZ shingles',
                    'Full deck protection',
                    'Enhanced attic ventilation',
                ],
            },
        ],
        assumptions: [
            'One existing roofing layer will be removed and disposed of.',
            'Roof decking is assumed serviceable; damaged decking is priced only after approval.',
            'Permit fees and standard site protection are included.',
            'Final color selection is confirmed before materials are ordered.',
        ],
        projectDuration: '2–3 working days, weather permitting',
        pricebookVersion: 'RC NorCal · 2026.08',
        engineVersion: 'EstimateDesk 0.9.4-demo',
    },
    additionalScope: [
        {
            id: 'skylight',
            name: 'Replace existing skylight',
            description: 'New curb-mounted skylight with flashing kit.',
            customerPrice: 1250,
            internalCost: 640,
        },
        {
            id: 'ridge-vent',
            name: 'Upgrade ridge ventilation',
            description: 'Add 34 linear feet of balanced ridge vent.',
            customerPrice: 850,
            internalCost: 390,
        },
        {
            id: 'chimney',
            name: 'Rebuild chimney flashing',
            description: 'Remove and replace step and counter flashing.',
            customerPrice: 1450,
            internalCost: 760,
        },
    ],
    breakdown: {
        proposalId: 'ed-1048',
        packageName: 'Better',
        customerPrice: 21780,
        totalCost: 14360,
        grossProfit: 7420,
        marginPercent: 34.1,
        wasteSource: 'EagleView suggested waste reconciled to 11%',
        laborDays: 5.5,
        siteDays: 3,
        dumpsters: 1,
        pricebookVersion: 'RC NorCal · 2026.08',
        engineVersion: 'EstimateDesk 0.9.4-demo',
        lines: [
            {
                category: 'Materials',
                description: 'GAF Timberline HDZ roofing system',
                quantity: '26.68 SQ',
                cost: 7610,
            },
            {
                category: 'Labor',
                description: 'Tear-off, preparation, and installation',
                quantity: '5.5 crew days',
                cost: 4730,
            },
            {
                category: 'Disposal',
                description: '30-yard roofing dumpster',
                quantity: '1 EA',
                cost: 1120,
            },
            {
                category: 'Site',
                description: 'Permit, delivery, and property protection',
                quantity: '1 LS',
                cost: 900,
            },
        ],
    },
    linkRevoked: false,
    history: [
        {
            title: 'Customer link copied',
            detail: 'Copied by Alex Morgan',
            at: 'Aug 22 · 10:18 AM',
        },
        {
            title: 'Proposal ready',
            detail: 'Pricing snapshot locked',
            at: 'Aug 22 · 9:47 AM',
        },
        {
            title: 'EagleView processed',
            detail: 'Measurements reconciled successfully',
            at: 'Aug 22 · 9:44 AM',
        },
        {
            title: 'Submission received',
            detail: 'Uploaded by Alex Morgan',
            at: 'Aug 22 · 9:42 AM',
        },
    ],
};

const summaries: ProposalSummary[] = [
    baseProposal,
    {
        id: 'ed-1052',
        customer: 'Priya Shah',
        address: '912 Alderbrook Dr, Fairfield, CA',
        submitter: 'Jordan Lee',
        submittedAt: 'Aug 25, 2026 · 8:16 AM',
        status: 'ready',
        total: 16480,
        revisionCount: 0,
        revisions: [],
    },
    {
        id: 'ed-1051',
        customer: 'Leah Gardner',
        address: '1436 Golden Way, Dixon, CA',
        submitter: 'Alex Morgan',
        submittedAt: 'Aug 24, 2026 · 4:08 PM',
        status: 'needs_review',
        total: null,
        revisionCount: 0,
        revisions: [],
    },
    {
        id: 'ed-1050',
        customer: 'Daniel Kim',
        address: '88 Peabody Rd, Vacaville, CA',
        submitter: 'Jordan Lee',
        submittedAt: 'Aug 24, 2026 · 1:32 PM',
        status: 'processing',
        total: null,
        revisionCount: 0,
        revisions: [],
    },
    {
        id: 'ed-1049',
        customer: 'Noah Wilson',
        address: '626 Rockville Rd, Suisun City, CA',
        submitter: 'Alex Morgan',
        submittedAt: 'Aug 23, 2026 · 11:07 AM',
        status: 'received',
        total: null,
        revisionCount: 0,
        revisions: [],
    },
    {
        id: 'ed-1047',
        customer: 'Cameron Wells',
        address: '37 Morning Glory Dr, Napa, CA',
        submitter: 'Taylor Ruiz',
        submittedAt: 'Aug 21, 2026 · 3:51 PM',
        status: 'rejected',
        total: null,
        revisionCount: 0,
        revisions: [],
    },
];

const pricebookItems: PricebookItem[] = [
    {
        id: 'mat-hdz',
        category: 'Materials',
        item: 'GAF Timberline HDZ shingles',
        unit: 'SQ',
        cost: 164,
        markup: 38,
        customerPrice: 264,
        lastVerified: 'Aug 20, 2026',
    },
    {
        id: 'mat-uhdz',
        category: 'Materials',
        item: 'GAF Timberline UHDZ shingles',
        unit: 'SQ',
        cost: 228,
        markup: 38,
        customerPrice: 367,
        lastVerified: 'Aug 20, 2026',
    },
    {
        id: 'underlay',
        category: 'Materials',
        item: 'Synthetic roof deck protection',
        unit: 'SQ',
        cost: 31,
        markup: 35,
        customerPrice: 48,
        lastVerified: 'Aug 18, 2026',
    },
    {
        id: 'leak',
        category: 'Materials',
        item: 'WeatherWatch leak barrier',
        unit: 'RL',
        cost: 82,
        markup: 35,
        customerPrice: 126,
        lastVerified: 'Aug 18, 2026',
    },
    {
        id: 'tearoff',
        category: 'Labor',
        item: 'Tear-off — one layer',
        unit: 'SQ',
        cost: 76,
        markup: 42,
        customerPrice: 131,
        lastVerified: 'Aug 12, 2026',
    },
    {
        id: 'install',
        category: 'Labor',
        item: 'Architectural shingle installation',
        unit: 'SQ',
        cost: 92,
        markup: 42,
        customerPrice: 159,
        lastVerified: 'Aug 12, 2026',
    },
    {
        id: 'decking',
        category: 'Labor',
        item: 'Replace damaged decking',
        unit: 'SF',
        cost: 3.85,
        markup: 45,
        customerPrice: 7,
        lastVerified: 'Aug 12, 2026',
    },
    {
        id: 'dumpster',
        category: 'Disposal',
        item: '30-yard roofing dumpster',
        unit: 'EA',
        cost: 820,
        markup: 27,
        customerPrice: 1120,
        lastVerified: 'Aug 5, 2026',
    },
    {
        id: 'permit',
        category: 'Site',
        item: 'Standard permit allowance',
        unit: 'LS',
        cost: 540,
        markup: 25,
        customerPrice: 720,
        lastVerified: 'Aug 1, 2026',
    },
    {
        id: 'skylight',
        category: 'Additional scope',
        item: 'Replace curb-mounted skylight',
        unit: 'EA',
        cost: 640,
        markup: 39,
        customerPrice: 1250,
        lastVerified: 'Aug 20, 2026',
    },
];

const clone = <T>(value: T): T => structuredClone(value);

class FixtureProposalRepository implements ProposalRepository {
    async list(search = ''): Promise<ProposalSummary[]> {
        const needle = search.trim().toLowerCase();

        return clone(
            summaries.filter(
                (proposal) =>
                    !needle ||
                    [
                        proposal.customer,
                        proposal.address,
                        proposal.id,
                        proposal.submitter,
                    ].some((value) => value.toLowerCase().includes(needle)),
            ),
        );
    }

    async retrieve(id: string): Promise<ProposalDetail> {
        const proposal = clone(baseProposal);
        const summary = summaries.find((item) => item.id === id);

        if (summary) {
            Object.assign(proposal, summary);
        }

        if (id.includes('expired')) {
            proposal.snapshot.expired = true;
            proposal.snapshot.validThrough = 'Jul 18, 2026';
        }

        return proposal;
    }

    async submit(draft: IntakeDraft): Promise<ProposalDetail> {
        return clone({
            ...baseProposal,
            id: 'ed-1053',
            customer: draft.customerName || 'New customer',
            email: draft.email,
            phone: draft.phone,
            address: draft.address || 'Address pending',
            status: draft.unusualWork ? 'needs_review' : 'processing',
            total: draft.unusualWork ? null : baseProposal.total,
        });
    }

    async revise(id: string, scope: ScopeItem[]): Promise<ProposalDetail> {
        const proposal = await this.retrieve(id);
        const added = scope.reduce((sum, item) => sum + item.customerPrice, 0);
        proposal.id = `${id}-r${proposal.revisionCount + 1}`;
        proposal.snapshot.revision += 1;
        proposal.total = (proposal.total ?? 0) + added;

        return proposal;
    }

    async send(): Promise<{ sentTo: string; attachments: string[] }> {
        return {
            sentTo: 'Alex Morgan',
            attachments: [
                'Customer proposal link',
                'Internal Estimate Breakdown.pdf',
            ],
        };
    }

    async revoke(id: string): Promise<ProposalDetail> {
        const proposal = await this.retrieve(id);
        proposal.linkRevoked = true;

        return proposal;
    }

    async pricebook(): Promise<PricebookItem[]> {
        return clone(pricebookItems);
    }
}

export const proposalRepository: ProposalRepository =
    new FixtureProposalRepository();
