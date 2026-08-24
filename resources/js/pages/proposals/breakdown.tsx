import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button, EmptyLoading, Icon, money } from '@/components/ui';
import { proposalRepository } from '@/data/proposal-repository';
import { show } from '@/routes/proposals';
import type { ProposalDetail } from '@/types/estimatedesk';

export default function BreakdownPage({ proposalId }: { proposalId: string }) {
    const [proposal, setProposal] = useState<ProposalDetail | null>(null);
    useEffect(() => {
        void proposalRepository.retrieve(proposalId).then(setProposal);
    }, [proposalId]);

    if (!proposal) {
        return (
            <main className="min-h-screen bg-slate-100">
                <EmptyLoading />
            </main>
        );
    }

    const data = proposal.breakdown;

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-6 text-slate-950 print:bg-white print:p-0">
            <Head title={`Internal breakdown · ${proposal.id.toUpperCase()}`} />
            <div className="mx-auto mb-4 flex max-w-5xl items-center justify-between print:hidden">
                <Link
                    href={show(proposal.id).url}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-teal-700"
                >
                    <span className="rotate-180">
                        <Icon name="arrow" />
                    </span>
                    Back to proposal
                </Link>
                <Button onClick={() => window.print()}>
                    <Icon name="download" />
                    Print / save PDF
                </Button>
            </div>
            <article className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-lg print:max-w-none print:rounded-none print:shadow-none">
                <div className="border-b-4 border-amber-500 bg-slate-950 p-6 text-white sm:p-8 print:border-b-2 print:p-5">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-bold tracking-wider text-amber-300 uppercase">
                                <Icon name="lock" className="size-3.5" />
                                Internal only
                            </span>
                            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
                                Estimate breakdown
                            </h1>
                            <p className="mt-2 text-sm text-slate-300">
                                Costs, pricing logic, and operating assumptions.
                                Never share with the homeowner.
                            </p>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-lg font-semibold">
                                Roofing Craftsmen
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                                {proposal.id.toUpperCase()} · Revision{' '}
                                {proposal.snapshot.revision}
                            </p>
                            <p className="text-sm text-slate-400">
                                {proposal.customer}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-5 sm:p-8 print:p-5">
                    <section className="grid gap-3 sm:grid-cols-4">
                        {[
                            ['Customer price', money(data.customerPrice)],
                            ['Total cost', money(data.totalCost)],
                            ['Gross profit', money(data.grossProfit)],
                            ['Gross margin', `${data.marginPercent}%`],
                        ].map(([label, value], index) => (
                            <div
                                key={label}
                                className={`rounded-xl p-4 ${index === 2 || index === 3 ? 'bg-emerald-50' : 'bg-slate-100'}`}
                            >
                                <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                    {label}
                                </p>
                                <p
                                    className={`mt-2 text-2xl font-semibold tabular-nums ${index === 2 || index === 3 ? 'text-emerald-800' : 'text-slate-950'}`}
                                >
                                    {value}
                                </p>
                            </div>
                        ))}
                    </section>

                    <section className="mt-8">
                        <h2 className="text-lg font-semibold">
                            Cost detail · {data.packageName} package
                        </h2>
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full min-w-[620px] text-left text-sm">
                                <thead>
                                    <tr className="border-y border-slate-200 bg-slate-50 text-xs tracking-wider text-slate-500 uppercase">
                                        <th className="px-3 py-3">Category</th>
                                        <th className="px-3 py-3">
                                            Description
                                        </th>
                                        <th className="px-3 py-3">Quantity</th>
                                        <th className="px-3 py-3 text-right">
                                            Internal cost
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.lines.map((line) => (
                                        <tr
                                            key={line.category}
                                            className="border-b border-slate-100"
                                        >
                                            <td className="px-3 py-4 font-semibold text-slate-800">
                                                {line.category}
                                            </td>
                                            <td className="px-3 py-4 text-slate-600">
                                                {line.description}
                                            </td>
                                            <td className="px-3 py-4 text-slate-600">
                                                {line.quantity}
                                            </td>
                                            <td className="px-3 py-4 text-right font-semibold tabular-nums">
                                                {money(line.cost)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-slate-300">
                                        <td
                                            colSpan={3}
                                            className="px-3 py-4 text-right font-semibold"
                                        >
                                            Total estimated cost
                                        </td>
                                        <td className="px-3 py-4 text-right text-lg font-semibold tabular-nums">
                                            {money(data.totalCost)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </section>

                    <section className="mt-8 grid gap-5 md:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 p-5">
                            <h2 className="text-sm font-semibold">
                                Production assumptions
                            </h2>
                            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <dt className="text-slate-500">Labor</dt>
                                    <dd className="mt-1 font-semibold">
                                        {data.laborDays} crew days
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">
                                        Site duration
                                    </dt>
                                    <dd className="mt-1 font-semibold">
                                        {data.siteDays} working days
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">
                                        Dumpsters
                                    </dt>
                                    <dd className="mt-1 font-semibold">
                                        {data.dumpsters} × 30 yard
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">
                                        Order quantity
                                    </dt>
                                    <dd className="mt-1 font-semibold">
                                        {proposal.snapshot.orderSquares} SQ
                                    </dd>
                                </div>
                            </dl>
                        </div>
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                            <h2 className="text-sm font-semibold text-amber-950">
                                Waste reconciliation
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-amber-900">
                                {data.wasteSource}. Final order quantity is{' '}
                                {proposal.snapshot.orderSquares} SQ from{' '}
                                {proposal.snapshot.roofSquares} measured SQ.
                            </p>
                        </div>
                    </section>

                    <footer className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:justify-between">
                        <p>
                            Pricebook:{' '}
                            <strong className="text-slate-700">
                                {data.pricebookVersion}
                            </strong>
                            <br />
                            Engine:{' '}
                            <strong className="text-slate-700">
                                {data.engineVersion}
                            </strong>
                        </p>
                        <p className="sm:text-right">
                            Snapshot {proposal.snapshot.id}
                            <br />
                            Generated for internal estimating review
                        </p>
                    </footer>
                </div>
            </article>
        </div>
    );
}
