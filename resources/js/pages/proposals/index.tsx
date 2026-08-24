import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    Button,
    ButtonLink,
    Card,
    Icon,
    money,
    StatusBadge,
} from '@/components/ui';
import { proposalRepository } from '@/data/proposal-repository';
import PortalLayout from '@/layouts/portal-layout';
import { create, show } from '@/routes/proposals';
import type { ProposalSummary } from '@/types/estimatedesk';

export default function ProposalIndex() {
    const [search, setSearch] = useState('');
    const [proposals, setProposals] = useState<ProposalSummary[]>([]);
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [calibrated, setCalibrated] = useState(false);
    const [expanded, setExpanded] = useState<string[]>(['ed-1048']);

    useEffect(() => {
        void proposalRepository.list(search).then(setProposals);
    }, [search]);

    const toggleRevision = (id: string) =>
        setExpanded((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id],
        );

    return (
        <PortalLayout>
            <Head title="Proposals" />
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-semibold text-teal-700">
                        Workspace
                    </p>
                    <h1 className="mt-1 text-3xl font-semibold tracking-[-0.035em] text-slate-950">
                        Proposals
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        From EagleView report to a customer-ready proposal.
                    </p>
                </div>
                <ButtonLink href={create().url}>
                    <Icon name="plus" />
                    New proposal
                </ButtonLink>
            </div>

            {!calibrated && (
                <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-3">
                        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-800">
                            <Icon name="alert" />
                        </span>
                        <div>
                            <p className="text-sm font-semibold text-amber-950">
                                Pricebook calibration needs owner verification
                            </p>
                            <p className="mt-1 text-sm leading-5 text-amber-800">
                                Review the demo labor and disposal rates before
                                presenting live pricing.
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        className="shrink-0 border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                        onClick={() => setCalibrated(true)}
                    >
                        Mark verified
                    </Button>
                </div>
            )}

            <Card className="mt-6 overflow-hidden">
                <div className="border-b border-slate-200 p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <label className="relative flex-1">
                            <span className="sr-only">Search proposals</span>
                            <Icon
                                name="search"
                                className="pointer-events-none absolute top-3 left-3.5 size-[18px] text-slate-400"
                            />
                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search customer, address, ID, or submitter"
                                className="h-11 w-full rounded-lg border border-slate-200 bg-white pr-4 pl-10 text-sm transition outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-3 focus:ring-teal-600/10"
                            />
                        </label>
                        <Button
                            variant="secondary"
                            onClick={() => setAdvancedOpen((open) => !open)}
                            aria-expanded={advancedOpen}
                        >
                            <Icon name="filter" />
                            Advanced filters
                        </Button>
                    </div>
                    {advancedOpen && (
                        <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
                            {[
                                'Status: Any',
                                'Submitted by: Anyone',
                                'Date: Last 30 days',
                            ].map((label) => (
                                <button
                                    key={label}
                                    type="button"
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-600"
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="hidden grid-cols-[1.4fr_1.2fr_.7fr_.8fr_.6fr_32px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase md:grid">
                    <span>Customer / property</span>
                    <span>Submitted</span>
                    <span>Status</span>
                    <span>Proposal</span>
                    <span>Value</span>
                    <span />
                </div>
                <div className="divide-y divide-slate-100">
                    {proposals.map((proposal) => (
                        <div key={proposal.id}>
                            <Link
                                href={show(proposal.id).url}
                                className="group grid gap-3 px-4 py-4 hover:bg-slate-50 md:grid-cols-[1.4fr_1.2fr_.7fr_.8fr_.6fr_32px] md:items-center md:gap-4 md:px-5"
                            >
                                <div>
                                    <p className="font-semibold text-slate-950 group-hover:text-teal-800">
                                        {proposal.customer}
                                    </p>
                                    <p className="mt-1 truncate text-sm text-slate-500">
                                        {proposal.address}
                                    </p>
                                </div>
                                <div className="text-sm text-slate-600">
                                    <p>{proposal.submitter}</p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        {proposal.submittedAt}
                                    </p>
                                </div>
                                <div>
                                    <StatusBadge status={proposal.status} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700 uppercase">
                                        {proposal.id}
                                    </p>
                                    {proposal.revisionCount > 0 && (
                                        <p className="mt-1 text-xs text-slate-400">
                                            {proposal.revisionCount} revisions
                                        </p>
                                    )}
                                </div>
                                <p className="text-sm font-semibold text-slate-900 tabular-nums">
                                    {proposal.total
                                        ? money(proposal.total)
                                        : '—'}
                                </p>
                                <Icon
                                    name="arrow"
                                    className="hidden text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-teal-700 md:block"
                                />
                            </Link>
                            {proposal.revisions.length > 0 && (
                                <div className="border-t border-dashed border-slate-200 bg-slate-50/60 px-4 py-2 md:px-5">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleRevision(proposal.id)
                                        }
                                        className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-teal-700"
                                    >
                                        <Icon
                                            name="refresh"
                                            className="size-3.5"
                                        />
                                        {expanded.includes(proposal.id)
                                            ? 'Hide'
                                            : 'Show'}{' '}
                                        revision history
                                    </button>
                                    {expanded.includes(proposal.id) && (
                                        <div className="mt-2 ml-1 border-l-2 border-slate-200 pl-4">
                                            {proposal.revisions.map(
                                                (revision) => (
                                                    <Link
                                                        key={revision.id}
                                                        href={
                                                            show(revision.id)
                                                                .url
                                                        }
                                                        className="grid gap-1 py-2 text-sm sm:grid-cols-[1fr_1fr_auto] sm:items-center sm:gap-4"
                                                    >
                                                        <span className="font-medium text-slate-700">
                                                            {revision.label} ·{' '}
                                                            {revision.reason}
                                                        </span>
                                                        <span className="text-xs text-slate-400">
                                                            {revision.createdAt}
                                                        </span>
                                                        <span className="font-semibold text-slate-700 tabular-nums">
                                                            {money(
                                                                revision.total,
                                                            )}
                                                        </span>
                                                    </Link>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {proposals.length === 0 && (
                        <div className="p-12 text-center text-sm text-slate-500">
                            No proposals match “{search}”.
                        </div>
                    )}
                </div>
            </Card>
            <p className="mt-4 text-xs text-slate-400">
                Showing {proposals.length} root proposals. Revisions stay
                grouped with their property.
            </p>
        </PortalLayout>
    );
}
