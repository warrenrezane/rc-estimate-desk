export type ProposalStatus =
    'received' | 'processing' | 'ready' | 'needs_review' | 'rejected';

export type PackageTier = 'Good' | 'Better' | 'Best';

export interface Revision {
    id: string;
    label: string;
    createdAt: string;
    reason: string;
    status: ProposalStatus;
    total: number;
}

export interface ProposalSummary {
    id: string;
    customer: string;
    address: string;
    submitter: string;
    submittedAt: string;
    status: ProposalStatus;
    total: number | null;
    revisionCount: number;
    revisions: Revision[];
}

export interface PackageOption {
    id: string;
    name: PackageTier;
    subtitle: string;
    material: string;
    warranty: string;
    price: number;
    description: string;
    features: string[];
    recommended?: boolean;
}

export interface ProposalSnapshot {
    id: string;
    revision: number;
    createdAt: string;
    validThrough: string;
    expired: boolean;
    measurementSource: string;
    roofSquares: number;
    orderSquares: number;
    wastePercent: number;
    predominantPitch: string;
    facets: number;
    packages: PackageOption[];
    assumptions: string[];
    projectDuration: string;
    pricebookVersion: string;
    engineVersion: string;
}

export interface ScopeItem {
    id: string;
    name: string;
    description: string;
    customerPrice: number;
    internalCost: number;
}

export interface BreakdownLine {
    category: string;
    description: string;
    quantity: string;
    cost: number;
}

export interface Breakdown {
    proposalId: string;
    packageName: PackageTier;
    customerPrice: number;
    totalCost: number;
    grossProfit: number;
    marginPercent: number;
    wasteSource: string;
    laborDays: number;
    siteDays: number;
    dumpsters: number;
    pricebookVersion: string;
    engineVersion: string;
    lines: BreakdownLine[];
}

export interface ProposalDetail extends ProposalSummary {
    email: string;
    phone: string;
    company: string;
    license: string;
    snapshot: ProposalSnapshot;
    breakdown: Breakdown;
    additionalScope: ScopeItem[];
    linkRevoked: boolean;
    history: Array<{
        title: string;
        detail: string;
        at: string;
    }>;
}

export interface IntakeDraft {
    customerName: string;
    email: string;
    phone: string;
    address: string;
    roofMaterial: string;
    layers: string;
    unusualWork: boolean;
    fileName: string;
    photos: string[];
}

export interface PricebookItem {
    id: string;
    category: string;
    item: string;
    unit: string;
    cost: number;
    markup: number;
    customerPrice: number;
    lastVerified: string;
}

export interface ProposalRepository {
    list(search?: string): Promise<ProposalSummary[]>;
    retrieve(id: string): Promise<ProposalDetail>;
    submit(draft: IntakeDraft): Promise<ProposalDetail>;
    revise(id: string, scope: ScopeItem[]): Promise<ProposalDetail>;
    send(id: string): Promise<{ sentTo: string; attachments: string[] }>;
    revoke(id: string): Promise<ProposalDetail>;
    pricebook(): Promise<PricebookItem[]>;
}
