import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { BrandMark, Button, EmptyLoading, Icon, money } from '@/components/ui';
import { proposalRepository } from '@/data/proposal-repository';
import type { PackageOption, ProposalDetail } from '@/types/estimatedesk';

export default function HomeownerProposal({
    proposalId,
}: {
    proposalId: string;
}) {
    const [proposal, setProposal] = useState<ProposalDetail | null>(null);
    const [selected, setSelected] = useState('signature');
    const [confirmed, setConfirmed] = useState(false);
    useEffect(() => {
        void proposalRepository.retrieve(proposalId).then(setProposal);
    }, [proposalId]);

    if (!proposal) {
        return (
            <main className="min-h-screen bg-stone-50">
                <EmptyLoading />
            </main>
        );
    }

    const selectedPackage = proposal.snapshot.packages.find(
        (item) => item.id === selected,
    ) as PackageOption;

    return (
        <div className="min-h-screen bg-[#f4f2ed] text-slate-900 print:bg-white">
            <Head title={`Roofing proposal for ${proposal.customer}`} />
            {proposal.snapshot.expired && (
                <div className="border-b border-amber-300 bg-amber-100 px-4 py-3 text-center text-sm font-medium text-amber-950 print:border print:text-left">
                    <strong>
                        Pricing period ended {proposal.snapshot.validThrough}.
                    </strong>{' '}
                    This original proposal remains unchanged. Ask Roofing
                    Craftsmen for a new revision.
                </div>
            )}
            <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 print:border-0 print:px-0">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <BrandMark />
                        <span className="hidden h-7 w-px bg-slate-200 sm:block" />
                        <span className="hidden text-sm font-semibold text-slate-600 sm:block">
                            Roofing Craftsmen
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">
                            (707) 555-0182
                        </p>
                        <p className="text-xs text-slate-500">
                            {proposal.license}
                        </p>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 print:max-w-none print:px-0 print:py-4">
                <section className="proposal-hero overflow-hidden rounded-3xl bg-[#123b38] text-white shadow-xl shadow-slate-900/10 print:rounded-none print:shadow-none">
                    <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.25fr_.75fr] lg:p-14">
                        <div>
                            <p className="text-xs font-bold tracking-[0.18em] text-teal-200 uppercase">
                                Roof replacement proposal
                            </p>
                            <h1 className="mt-5 max-w-xl text-4xl leading-[1.05] font-semibold tracking-[-0.045em] sm:text-5xl">
                                A roof built to protect what matters most.
                            </h1>
                            <p className="mt-6 max-w-xl text-base leading-7 text-teal-50/80">
                                Prepared for{' '}
                                <strong className="text-white">
                                    {proposal.customer}
                                </strong>{' '}
                                at {proposal.address}.
                            </p>
                        </div>
                        <div className="flex items-end">
                            <div className="w-full rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                                <p className="text-xs font-semibold tracking-wider text-teal-100/70 uppercase">
                                    Your home at a glance
                                </p>
                                <div className="mt-4 grid grid-cols-3 gap-3">
                                    <div>
                                        <strong className="block text-2xl">
                                            {proposal.snapshot.roofSquares}
                                        </strong>
                                        <span className="text-xs text-teal-50/70">
                                            roof squares
                                        </span>
                                    </div>
                                    <div>
                                        <strong className="block text-2xl">
                                            {proposal.snapshot.predominantPitch}
                                        </strong>
                                        <span className="text-xs text-teal-50/70">
                                            main pitch
                                        </span>
                                    </div>
                                    <div>
                                        <strong className="block text-2xl">
                                            {proposal.snapshot.facets}
                                        </strong>
                                        <span className="text-xs text-teal-50/70">
                                            roof facets
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-teal-50/60">
                                    Professionally measured from{' '}
                                    {proposal.snapshot.measurementSource}.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-10 print:mt-6">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold tracking-[0.16em] text-teal-700 uppercase">
                            Choose your roofing system
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-slate-950">
                            Three clear ways to protect your home
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            Every option includes complete tear-off, site
                            protection, cleanup, permits, and the roofing system
                            listed below.
                        </p>
                    </div>
                    <div className="mt-7 grid gap-4 lg:grid-cols-3 print:grid-cols-3 print:gap-3">
                        {proposal.snapshot.packages.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => setSelected(option.id)}
                                className={`relative flex min-h-[360px] flex-col rounded-2xl border bg-white p-5 text-left transition print:min-h-0 print:p-4 ${selected === option.id ? 'border-teal-700 ring-2 ring-teal-700/15' : 'border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg'} ${option.recommended ? 'lg:-mt-3 lg:mb-[-12px] print:mt-0 print:mb-0' : ''}`}
                            >
                                {option.recommended && (
                                    <span className="absolute -top-3 left-5 rounded-full bg-teal-700 px-3 py-1 text-[11px] font-bold tracking-wider text-white uppercase print:static print:mb-2 print:self-start">
                                        Most popular
                                    </span>
                                )}
                                <p className="text-sm font-bold text-teal-700">
                                    {option.name}
                                </p>
                                <h3 className="mt-1 text-xl font-semibold text-slate-950">
                                    {option.subtitle}
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    {option.description}
                                </p>
                                <ul className="mt-5 flex flex-col gap-2.5">
                                    {option.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex gap-2 text-sm text-slate-700"
                                        >
                                            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-700">
                                                <Icon
                                                    name="check"
                                                    className="size-3"
                                                />
                                            </span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-auto border-t border-slate-100 pt-5">
                                    <p className="text-3xl font-semibold tracking-tight text-slate-950">
                                        {money(option.price)}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {option.warranty}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px] print:mt-6 print:grid-cols-[1fr_320px]">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 print:p-4">
                        <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                            What we planned for
                        </p>
                        <h2 className="mt-2 text-xl font-semibold text-slate-950">
                            Clear scope. No mystery line items.
                        </h2>
                        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                            {proposal.snapshot.assumptions.map((assumption) => (
                                <li
                                    key={assumption}
                                    className="flex gap-2 text-sm leading-6 text-slate-600"
                                >
                                    <Icon
                                        name="check"
                                        className="mt-1 size-4 shrink-0 text-teal-700"
                                    />
                                    {assumption}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 text-sm sm:flex-row sm:justify-between">
                            <span>
                                <strong className="text-slate-900">
                                    Estimated duration:
                                </strong>{' '}
                                {proposal.snapshot.projectDuration}
                            </span>
                            <span>
                                <strong className="text-slate-900">
                                    Pricing valid through:
                                </strong>{' '}
                                {proposal.snapshot.validThrough}
                            </span>
                        </div>
                    </div>
                    <aside className="rounded-2xl bg-slate-950 p-6 text-white print:bg-slate-100 print:text-slate-950">
                        <p className="text-xs font-bold tracking-wider text-teal-300 uppercase print:text-teal-700">
                            Your selection
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold">
                            {selectedPackage.name} · {selectedPackage.material}
                        </h2>
                        <p className="mt-6 text-4xl font-semibold tracking-tight">
                            {money(selectedPackage.price)}
                        </p>
                        <p className="mt-2 text-sm text-slate-400 print:text-slate-600">
                            Investment for the complete scope described
                        </p>
                        <Button
                            className="mt-6 w-full bg-white text-slate-950 hover:bg-teal-50 print:hidden"
                            onClick={() => setConfirmed(true)}
                        >
                            {confirmed ? (
                                <>
                                    <Icon name="check" />
                                    Selection noted
                                </>
                            ) : (
                                'I’m interested in this option'
                            )}
                        </Button>
                        <p className="mt-4 text-xs leading-5 text-slate-400 print:text-slate-600">
                            No payment or binding signature is collected in this
                            prototype. Your Roofing Craftsmen representative
                            will confirm final scope with you.
                        </p>
                    </aside>
                </section>

                <footer className="mt-10 flex flex-col gap-3 border-t border-slate-300 py-6 text-xs leading-5 text-slate-500 sm:flex-row sm:justify-between print:mt-5">
                    <p>
                        Roofing Craftsmen · {proposal.license}
                        <br />
                        hello@roofingcraftsmen.example · (707) 555-0182
                    </p>
                    <p className="sm:text-right">
                        Proposal {proposal.id.toUpperCase()} · Revision{' '}
                        {proposal.snapshot.revision}
                        <br />
                        Prepared {proposal.snapshot.createdAt}
                    </p>
                </footer>
            </main>
        </div>
    );
}
