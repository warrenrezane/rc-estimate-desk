import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import {
    Button,
    ButtonLink,
    Card,
    EmptyLoading,
    Icon,
    money,
    StatusBadge,
} from '@/components/ui';
import { proposalRepository } from '@/data/proposal-repository';
import PortalLayout from '@/layouts/portal-layout';
import { breakdown, create, homeowner, index, show } from '@/routes/proposals';
import type { ProposalDetail, ScopeItem } from '@/types/estimatedesk';

export default function ShowProposal({ proposalId }: { proposalId: string }) {
    const [proposal, setProposal] = useState<ProposalDetail | null>(null);
    const [notice, setNotice] = useState('');
    const [revisionOpen, setRevisionOpen] = useState(false);
    const [selectedScope, setSelectedScope] = useState<ScopeItem[]>([]);

    useEffect(() => {
        void proposalRepository.retrieve(proposalId).then(setProposal);
    }, [proposalId]);
    const revisedTotal = useMemo(
        () =>
            (proposal?.total ?? 0) +
            selectedScope.reduce((sum, item) => sum + item.customerPrice, 0),
        [proposal, selectedScope],
    );

    if (!proposal) {
        return (
            <PortalLayout>
                <Head title="Proposal" />
                <EmptyLoading />
            </PortalLayout>
        );
    }

    const copyLink = async () => {
        const url = new URL(
            homeowner(proposal.id).url,
            window.location.origin,
        ).toString();
        await navigator.clipboard?.writeText(url);
        setNotice('Customer link copied. The homeowner has not been emailed.');
    };

    const sendRepEmail = async () => {
        const result = await proposalRepository.send(proposal.id);
        setNotice(
            `Email prepared for ${result.sentTo} with ${result.attachments.join(' and ')}.`,
        );
    };

    const revoke = async () => {
        const updated = await proposalRepository.revoke(proposal.id);
        setProposal(updated);
        setNotice(
            'Customer link revoked. The immutable proposal snapshot remains in history.',
        );
    };

    const createRevision = async () => {
        const updated = await proposalRepository.revise(
            proposal.id,
            selectedScope,
        );
        setRevisionOpen(false);
        setNotice(
            `Revision ${updated.snapshot.revision} created at ${money(updated.total ?? 0)}. The original was not changed.`,
        );
    };

    const exception = proposal.status !== 'ready';

    return (
        <PortalLayout>
            <Head
                title={`${proposal.customer} · ${proposal.id.toUpperCase()}`}
            />
            <Link
                href={index().url}
                className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-teal-700"
            >
                <span className="rotate-180">
                    <Icon name="arrow" />
                </span>
                All proposals
            </Link>

            <div className="mt-5 flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-semibold tracking-[-0.035em] text-slate-950">
                            {proposal.customer}
                        </h1>
                        <StatusBadge status={proposal.status} />
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                        {proposal.address}
                    </p>
                    <p className="mt-1 text-xs font-medium tracking-wider text-slate-400 uppercase">
                        {proposal.id} · Submitted by {proposal.submitter}
                    </p>
                </div>
                {proposal.status === 'ready' && (
                    <div className="flex flex-wrap gap-2">
                        <ButtonLink href={homeowner(proposal.id).url}>
                            <Icon name="eye" />
                            View customer proposal
                        </ButtonLink>
                        <Button variant="secondary" onClick={copyLink}>
                            <Icon name="copy" />
                            Copy customer link
                        </Button>
                        <Button variant="secondary" onClick={sendRepEmail}>
                            <Icon name="mail" />
                            Email rep
                        </Button>
                    </div>
                )}
            </div>

            {notice && (
                <div
                    role="status"
                    className="mt-5 flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
                >
                    <span className="flex gap-2">
                        <Icon name="check" className="mt-0.5 shrink-0" />
                        {notice}
                    </span>
                    <button
                        type="button"
                        onClick={() => setNotice('')}
                        aria-label="Dismiss notification"
                    >
                        <Icon name="close" />
                    </button>
                </div>
            )}

            {proposal.status === 'needs_review' && (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <div className="flex gap-3">
                        <Icon
                            name="alert"
                            className="mt-0.5 size-5 shrink-0 text-amber-800"
                        />
                        <div>
                            <h2 className="font-semibold text-amber-950">
                                Automatic pricing paused for owner review
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-amber-800">
                                The unusual-work toggle was selected and the
                                calculated labor falls outside the configured
                                sanity band.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <Button
                                    className="bg-amber-800 hover:bg-amber-900"
                                    onClick={() => {
                                        setProposal({
                                            ...proposal,
                                            status: 'ready',
                                            total: 21780,
                                        });
                                        setNotice(
                                            'Inputs verified. A ready proposal snapshot was released to the rep.',
                                        );
                                    }}
                                >
                                    Verify inputs and release
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="border-amber-300 bg-amber-50 text-amber-900"
                                    onClick={() =>
                                        setNotice(
                                            'Returned to the submitter with a request for unusual-work notes and photos.',
                                        )
                                    }
                                >
                                    Return to submitter
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {proposal.status === 'processing' && (
                <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-50 p-5">
                    <div className="flex gap-3">
                        <Icon
                            name="clock"
                            className="mt-0.5 size-5 shrink-0 text-violet-700"
                        />
                        <div className="flex-1">
                            <h2 className="font-semibold text-violet-950">
                                Measurements are being reconciled
                            </h2>
                            <p className="mt-1 text-sm text-violet-800">
                                XML validated · 9 roof facets identified ·
                                checking waste and pitch rules now.
                            </p>
                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-violet-100">
                                <div className="h-full w-2/3 rounded-full bg-violet-600" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {proposal.status === 'received' && (
                <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-5">
                    <h2 className="font-semibold text-sky-950">
                        Submission received
                    </h2>
                    <p className="mt-1 text-sm text-sky-800">
                        The EagleView XML is queued for validation. The rep will
                        be notified when a result is ready.
                    </p>
                </div>
            )}
            {proposal.status === 'rejected' && (
                <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5">
                    <div className="flex gap-3">
                        <Icon
                            name="alert"
                            className="mt-0.5 size-5 shrink-0 text-rose-700"
                        />
                        <div>
                            <h2 className="font-semibold text-rose-950">
                                Unsupported EagleView export
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-rose-800">
                                The upload does not contain the required roof
                                measurement nodes. Download the original XML
                                from EagleView and upload it without renaming or
                                converting it.
                            </p>
                            <ButtonLink
                                href={create().url}
                                variant="secondary"
                                className="mt-4 border-rose-300 bg-rose-50 text-rose-900"
                            >
                                Replace file
                            </ButtonLink>
                        </div>
                    </div>
                </div>
            )}

            {!exception && (
                <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="flex flex-col gap-6">
                        <Card className="p-5 sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold tracking-wider text-teal-700 uppercase">
                                        Current snapshot
                                    </p>
                                    <h2 className="mt-1 text-xl font-semibold text-slate-950">
                                        Customer proposal · Revision{' '}
                                        {proposal.snapshot.revision}
                                    </h2>
                                </div>
                                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                    Immutable
                                </span>
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
                                {[
                                    [
                                        'Roof area',
                                        `${proposal.snapshot.roofSquares} SQ`,
                                    ],
                                    [
                                        'Order',
                                        `${proposal.snapshot.orderSquares} SQ`,
                                    ],
                                    [
                                        'Waste',
                                        `${proposal.snapshot.wastePercent}%`,
                                    ],
                                    [
                                        'Pitch',
                                        proposal.snapshot.predominantPitch,
                                    ],
                                    [
                                        'Facets',
                                        String(proposal.snapshot.facets),
                                    ],
                                ].map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="rounded-xl bg-slate-50 p-3"
                                    >
                                        <dt className="text-xs text-slate-500">
                                            {label}
                                        </dt>
                                        <dd className="mt-1 text-lg font-semibold text-slate-900">
                                            {value}
                                        </dd>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 overflow-x-auto">
                                <table className="w-full min-w-[560px] text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-xs tracking-wider text-slate-400 uppercase">
                                            <th className="pb-3 font-semibold">
                                                Package
                                            </th>
                                            <th className="pb-3 font-semibold">
                                                System
                                            </th>
                                            <th className="pb-3 font-semibold">
                                                Warranty
                                            </th>
                                            <th className="pb-3 text-right font-semibold">
                                                Price
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {proposal.snapshot.packages.map(
                                            (option) => (
                                                <tr
                                                    key={option.id}
                                                    className="border-b border-slate-100 last:border-0"
                                                >
                                                    <td className="py-4 font-semibold text-slate-900">
                                                        {option.name}
                                                        {option.recommended && (
                                                            <span className="ml-2 text-xs text-teal-700">
                                                                Recommended
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 text-slate-600">
                                                        {option.material}
                                                    </td>
                                                    <td className="py-4 text-slate-600">
                                                        {option.warranty}
                                                    </td>
                                                    <td className="py-4 text-right font-semibold text-slate-900 tabular-nums">
                                                        {money(option.price)}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>

                        <Card className="p-5 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                                        Version history
                                    </p>
                                    <h2 className="mt-1 text-lg font-semibold text-slate-950">
                                        Revisions stay with this property
                                    </h2>
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={() => setRevisionOpen(true)}
                                >
                                    <Icon name="plus" />
                                    Create revision
                                </Button>
                            </div>
                            <div className="mt-5 divide-y divide-slate-100 border-t border-slate-100">
                                {proposal.revisions.map((revision) => (
                                    <Link
                                        key={revision.id}
                                        href={show(revision.id).url}
                                        className="grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:items-center"
                                    >
                                        <span>
                                            <strong className="text-sm text-slate-800">
                                                {revision.label}
                                            </strong>
                                            <span className="ml-2 text-sm text-slate-500">
                                                {revision.reason}
                                            </span>
                                        </span>
                                        <span className="text-sm font-semibold text-slate-700 tabular-nums">
                                            {money(revision.total)}
                                        </span>
                                    </Link>
                                ))}
                                <div className="grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                                    <span>
                                        <strong className="text-sm text-slate-800">
                                            Original proposal
                                        </strong>
                                        <span className="ml-2 text-sm text-slate-500">
                                            Created{' '}
                                            {proposal.snapshot.createdAt}
                                        </span>
                                    </span>
                                    <span className="text-sm font-semibold text-slate-700 tabular-nums">
                                        {money(proposal.total ?? 0)}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <aside className="flex flex-col gap-6">
                        <Card className="p-5">
                            <h2 className="text-sm font-semibold text-slate-950">
                                Documents & delivery
                            </h2>
                            <div className="mt-4 flex flex-col gap-2">
                                <ButtonLink
                                    href={breakdown(proposal.id).url}
                                    variant="secondary"
                                    className="justify-start"
                                >
                                    <Icon name="download" />
                                    Open breakdown PDF view
                                </ButtonLink>
                                <Button
                                    variant="secondary"
                                    className="justify-start"
                                    onClick={sendRepEmail}
                                >
                                    <Icon name="mail" />
                                    Email rep + breakdown
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="justify-start"
                                    onClick={() => setRevisionOpen(true)}
                                >
                                    <Icon name="refresh" />
                                    Add scope / revise
                                </Button>
                                <Button
                                    variant="danger"
                                    className="justify-start"
                                    onClick={revoke}
                                >
                                    <Icon name="lock" />
                                    {proposal.linkRevoked
                                        ? 'Link revoked'
                                        : 'Revoke customer link'}
                                </Button>
                            </div>
                            <p className="mt-4 text-xs leading-5 text-slate-500">
                                Email is simulated in this prototype. It goes to
                                the rep with the proposal link and internal
                                breakdown—not directly to the homeowner.
                            </p>
                        </Card>
                        <Card className="p-5">
                            <h2 className="text-sm font-semibold text-slate-950">
                                Activity
                            </h2>
                            <div className="mt-4 flex flex-col gap-4">
                                {proposal.history.map((entry) => (
                                    <div
                                        key={entry.title}
                                        className="relative pl-5 before:absolute before:top-1.5 before:left-0 before:size-2 before:rounded-full before:bg-teal-600"
                                    >
                                        <p className="text-sm font-medium text-slate-800">
                                            {entry.title}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {entry.detail}
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-slate-400">
                                            {entry.at}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </aside>
                </div>
            )}

            {revisionOpen && (
                <div
                    className="fixed inset-0 z-50 grid place-items-end bg-slate-950/40 p-0 sm:place-items-center sm:p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="revision-title"
                >
                    <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:max-w-xl sm:rounded-2xl sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-teal-700 uppercase">
                                    New immutable version
                                </p>
                                <h2
                                    id="revision-title"
                                    className="mt-1 text-xl font-semibold text-slate-950"
                                >
                                    Add scope to this proposal
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setRevisionOpen(false)}
                                className="grid size-9 place-items-center rounded-lg hover:bg-slate-100"
                                aria-label="Close"
                            >
                                <Icon name="close" />
                            </button>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Selected scope is added to a new revision. The
                            delivered original stays unchanged.
                        </p>
                        <div className="mt-5 flex flex-col gap-3">
                            {proposal.additionalScope.map((scope) => {
                                const checked = selectedScope.some(
                                    (item) => item.id === scope.id,
                                );

                                return (
                                    <label
                                        key={scope.id}
                                        className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${checked ? 'border-teal-500 bg-teal-50' : 'border-slate-200'}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() =>
                                                setSelectedScope((current) =>
                                                    checked
                                                        ? current.filter(
                                                              (item) =>
                                                                  item.id !==
                                                                  scope.id,
                                                          )
                                                        : [...current, scope],
                                                )
                                            }
                                            className="mt-1 size-4 accent-teal-700"
                                        />
                                        <span className="flex-1">
                                            <span className="flex justify-between gap-3">
                                                <strong className="text-sm text-slate-900">
                                                    {scope.name}
                                                </strong>
                                                <strong className="text-sm text-slate-900 tabular-nums">
                                                    +
                                                    {money(scope.customerPrice)}
                                                </strong>
                                            </span>
                                            <span className="mt-1 block text-xs leading-5 text-slate-500">
                                                {scope.description}
                                            </span>
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                        <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-950 p-4 text-white">
                            <span>
                                <span className="block text-xs text-slate-400">
                                    Revision total
                                </span>
                                <span className="mt-1 block text-xl font-semibold tabular-nums">
                                    {money(revisedTotal)}
                                </span>
                            </span>
                            <Button
                                disabled={selectedScope.length === 0}
                                onClick={createRevision}
                            >
                                Create revision
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </PortalLayout>
    );
}
