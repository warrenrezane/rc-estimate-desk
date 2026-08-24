import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Icon, money } from '@/components/ui';
import { proposalRepository } from '@/data/proposal-repository';
import PortalLayout from '@/layouts/portal-layout';
import type { PricebookItem } from '@/types/estimatedesk';

export default function PricebookIndex() {
    const [items, setItems] = useState<PricebookItem[]>([]);
    const [search, setSearch] = useState('');
    const [verified, setVerified] = useState(false);
    useEffect(() => {
        void proposalRepository.pricebook().then(setItems);
    }, []);
    const filtered = useMemo(
        () =>
            items.filter((item) =>
                `${item.category} ${item.item}`
                    .toLowerCase()
                    .includes(search.toLowerCase()),
            ),
        [items, search],
    );

    const addDemoItem = () => {
        if (items.some((item) => item.id === 'drip-edge')) {
            return;
        }

        setItems((current) => [
            ...current,
            {
                id: 'drip-edge',
                category: 'Materials',
                item: 'Painted metal drip edge',
                unit: 'LF',
                cost: 2.1,
                markup: 36,
                customerPrice: 3.95,
                lastVerified: 'Pending',
            },
        ]);
    };

    return (
        <PortalLayout>
            <Head title="Pricebook" />
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-semibold text-teal-700">
                        Pricing control
                    </p>
                    <h1 className="mt-1 text-3xl font-semibold tracking-[-0.035em] text-slate-950">
                        Pricebook
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        The source rates behind every immutable proposal
                        snapshot.
                    </p>
                </div>
                <Button onClick={addDemoItem}>
                    <Icon name="plus" />
                    Add pricebook item
                </Button>
            </div>

            <div
                className={`mt-6 flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${verified ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}
            >
                <div className="flex gap-3">
                    <Icon
                        name={verified ? 'check' : 'alert'}
                        className={`mt-0.5 size-5 shrink-0 ${verified ? 'text-emerald-700' : 'text-amber-800'}`}
                    />
                    <div>
                        <p
                            className={`text-sm font-semibold ${verified ? 'text-emerald-950' : 'text-amber-950'}`}
                        >
                            {verified
                                ? 'Pricebook verified for demonstration'
                                : 'Owner calibration required'}
                        </p>
                        <p
                            className={`mt-1 text-sm ${verified ? 'text-emerald-800' : 'text-amber-800'}`}
                        >
                            RC NorCal · 2026.08 · 10 active line items · rates
                            are prototype fixtures.
                        </p>
                    </div>
                </div>
                <Button
                    variant="secondary"
                    onClick={() => setVerified((value) => !value)}
                >
                    {verified ? 'Reopen verification' : 'Verify this version'}
                </Button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Card className="p-5">
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                        Version
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                        RC NorCal · 2026.08
                    </p>
                </Card>
                <Card className="p-5">
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                        Default target margin
                    </p>
                    <p className="mt-2 text-lg font-semibold">34%</p>
                </Card>
                <Card className="p-5">
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                        Last verified
                    </p>
                    <p className="mt-2 text-lg font-semibold">Aug 20, 2026</p>
                </Card>
            </div>

            <Card className="mt-6 overflow-hidden">
                <div className="border-b border-slate-200 p-4 sm:p-5">
                    <label className="relative block max-w-lg">
                        <span className="sr-only">Search pricebook</span>
                        <Icon
                            name="search"
                            className="absolute top-3 left-3.5 size-[18px] text-slate-400"
                        />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="h-11 w-full rounded-lg border border-slate-200 pr-4 pl-10 text-sm outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-600/10"
                            placeholder="Search item or category"
                        />
                    </label>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[820px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] tracking-wider text-slate-500 uppercase">
                                <th className="px-5 py-3">Item</th>
                                <th className="px-5 py-3">Category</th>
                                <th className="px-5 py-3">Unit</th>
                                <th className="px-5 py-3 text-right">Cost</th>
                                <th className="px-5 py-3 text-right">Markup</th>
                                <th className="px-5 py-3 text-right">
                                    Customer price
                                </th>
                                <th className="px-5 py-3">Verified</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-slate-100 hover:bg-slate-50"
                                >
                                    <td className="px-5 py-4 font-medium text-slate-900">
                                        {item.item}
                                    </td>
                                    <td className="px-5 py-4 text-slate-500">
                                        {item.category}
                                    </td>
                                    <td className="px-5 py-4 text-slate-500">
                                        {item.unit}
                                    </td>
                                    <td className="px-5 py-4 text-right text-slate-600 tabular-nums">
                                        {money(item.cost)}
                                    </td>
                                    <td className="px-5 py-4 text-right text-slate-600 tabular-nums">
                                        {item.markup}%
                                    </td>
                                    <td className="px-5 py-4 text-right font-semibold tabular-nums">
                                        {money(item.customerPrice)}
                                    </td>
                                    <td className="px-5 py-4 text-xs text-slate-500">
                                        {item.lastVerified}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            <p className="mt-4 max-w-3xl text-xs leading-5 text-slate-400">
                Changing a pricebook item affects only future calculations.
                Existing proposal snapshots keep the exact version, engine,
                scope, and prices used when they were delivered.
            </p>
        </PortalLayout>
    );
}
