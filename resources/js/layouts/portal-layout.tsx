import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { BrandMark, Icon } from '@/components/ui';
import { index as pricebookIndex } from '@/routes/pricebook';
import { create, homeowner, index, show } from '@/routes/proposals';

export default function PortalLayout({ children }: { children: ReactNode }) {
    const { url } = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [demoOpen, setDemoOpen] = useState(false);
    const nav = [
        {
            label: 'Proposals',
            href: index().url,
            icon: 'proposals' as const,
            active: url.startsWith('/proposals') && !url.includes('/new'),
        },
        {
            label: 'Pricebook',
            href: pricebookIndex().url,
            icon: 'book' as const,
            active: url.startsWith('/pricebook'),
        },
    ];

    const scenarios = [
        { label: 'Ready proposal', href: show('ed-1048').url },
        { label: 'Needs review', href: show('ed-1051').url },
        { label: 'Processing', href: show('ed-1050').url },
        { label: 'Rejected file', href: show('ed-1047').url },
        {
            label: 'Expired customer view',
            href: homeowner('ed-1048-expired').url,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <a
                href="#main-content"
                className="fixed top-3 left-3 z-50 -translate-y-20 rounded-md bg-slate-950 px-3 py-2 text-sm text-white focus:translate-y-0"
            >
                Skip to content
            </a>
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white px-4 py-6 lg:flex lg:flex-col">
                <div className="px-2">
                    <BrandMark />
                </div>
                <nav
                    className="mt-9 flex flex-col gap-1"
                    aria-label="Portal navigation"
                >
                    {nav.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${item.active ? 'bg-teal-50 text-teal-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'}`}
                        >
                            <Icon name={item.icon} className="size-[18px]" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="mt-auto rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-semibold text-slate-900">
                        Roofing Craftsmen
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        Demo workspace
                        <br />
                        Alex Morgan · Owner
                    </p>
                </div>
            </aside>

            <div className="lg:pl-64">
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
                    <button
                        type="button"
                        className="grid size-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
                        onClick={() => setMobileOpen((open) => !open)}
                        aria-label="Toggle navigation"
                        aria-expanded={mobileOpen}
                    >
                        <Icon name="menu" className="size-5" />
                    </button>
                    <div className="lg:hidden">
                        <BrandMark />
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                        <span className="hidden rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 sm:inline">
                            Prototype data
                        </span>
                        <span className="grid size-9 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">
                            AM
                        </span>
                    </div>
                </header>
                {mobileOpen && (
                    <nav
                        className="border-b border-slate-200 bg-white p-3 lg:hidden"
                        aria-label="Mobile navigation"
                    >
                        {nav.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700"
                            >
                                <Icon name={item.icon} />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                )}
                <main
                    id="main-content"
                    className="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8"
                >
                    {children}
                </main>
            </div>

            <div className="fixed right-4 bottom-4 z-40 print:hidden">
                {demoOpen && (
                    <div className="mb-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                        <p className="px-2 pt-1 pb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                            Presenter scenarios
                        </p>
                        {scenarios.map((scenario) => (
                            <button
                                key={scenario.label}
                                type="button"
                                onClick={() => router.visit(scenario.href)}
                                className="block w-full rounded-lg px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                            >
                                {scenario.label}
                            </button>
                        ))}
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => setDemoOpen((open) => !open)}
                    className="rounded-full border border-slate-300 bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-lg"
                    aria-expanded={demoOpen}
                >
                    Demo scenarios
                </button>
            </div>
        </div>
    );
}
