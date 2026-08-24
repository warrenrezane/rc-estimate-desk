import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Button, ButtonLink, Card, Icon } from '@/components/ui';
import { proposalRepository } from '@/data/proposal-repository';
import PortalLayout from '@/layouts/portal-layout';
import { index, show } from '@/routes/proposals';
import type { IntakeDraft } from '@/types/estimatedesk';

const emptyDraft: IntakeDraft = {
    customerName: '',
    email: '',
    phone: '',
    address: '',
    roofMaterial: 'Architectural asphalt',
    layers: '1',
    unusualWork: false,
    fileName: '',
    photos: [],
};

type ResultMode =
    'form' | 'processing' | 'ready' | 'review' | 'rejected' | 'duplicate';

const fieldClass =
    'mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-3 focus:ring-teal-600/10';

export default function CreateProposal() {
    const [draft, setDraft] = useState<IntakeDraft>(emptyDraft);
    const [step, setStep] = useState(1);
    const [mode, setMode] = useState<ResultMode>('form');
    const [progress, setProgress] = useState(18);

    useEffect(() => {
        if (mode !== 'processing') {
            return;
        }

        const timer = window.setInterval(
            () =>
                setProgress((value) => {
                    if (value >= 100) {
                        window.clearInterval(timer);
                        setMode('ready');

                        return 100;
                    }

                    return Math.min(value + 17, 100);
                }),
            500,
        );

        return () => window.clearInterval(timer);
    }, [mode]);

    const update = (
        key: keyof IntakeDraft,
        value: string | boolean | string[],
    ) => setDraft((current) => ({ ...current, [key]: value }));

    const chooseSample = () => {
        setDraft({
            ...draft,
            customerName: 'Maya Thompson',
            email: 'maya.thompson@example.com',
            phone: '(707) 555-0148',
            address: '478 Cordoba Ln, Vacaville, CA 95688',
            fileName: 'EagleView-53409152.xml',
        });
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        const lower = draft.fileName.toLowerCase();

        if (!lower.endsWith('.xml') || lower.includes('malformed')) {
            return setMode('rejected');
        }

        if (lower.includes('duplicate')) {
            return setMode('duplicate');
        }

        if (draft.unusualWork) {
            return setMode('review');
        }

        void proposalRepository.submit(draft);
        setMode('processing');
    };

    if (mode !== 'form') {
        const content = {
            processing: {
                icon: 'clock' as const,
                title: 'Building the proposal',
                text:
                    progress < 45
                        ? 'Reading EagleView measurements…'
                        : progress < 80
                          ? 'Reconciling waste and package quantities…'
                          : 'Locking the pricing snapshot…',
            },
            ready: {
                icon: 'check' as const,
                title: 'Proposal ready',
                text: 'The rep notification includes the customer proposal link and the internal breakdown PDF.',
            },
            review: {
                icon: 'alert' as const,
                title: 'Manual review required',
                text: 'The unusual-work flag paused automatic pricing. An owner can review scope and release a revision.',
            },
            rejected: {
                icon: 'alert' as const,
                title: 'This file could not be read',
                text: 'Upload the original EagleView XML export. PDFs, renamed files, and malformed XML are not supported.',
            },
            duplicate: {
                icon: 'copy' as const,
                title: 'Report already uploaded',
                text: 'EstimateDesk found the same EagleView fingerprint and returned the existing result instead of creating a duplicate.',
            },
        }[mode];

        return (
            <PortalLayout>
                <Head title="New proposal" />
                <div className="mx-auto max-w-2xl py-8 sm:py-16">
                    <Card className="p-6 text-center sm:p-10">
                        <span
                            className={`mx-auto grid size-14 place-items-center rounded-2xl ${mode === 'ready' ? 'bg-emerald-50 text-emerald-700' : mode === 'processing' ? 'bg-violet-50 text-violet-700' : 'bg-amber-50 text-amber-800'}`}
                        >
                            <Icon name={content.icon} className="size-7" />
                        </span>
                        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
                            {content.title}
                        </h1>
                        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">
                            {content.text}
                        </p>
                        {mode === 'processing' && (
                            <div className="mx-auto mt-7 max-w-md">
                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-teal-700 transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="mt-2 text-xs font-medium text-slate-400">
                                    {progress}% complete
                                </p>
                            </div>
                        )}
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            {(mode === 'ready' || mode === 'duplicate') && (
                                <ButtonLink href={show('ed-1048').url}>
                                    Open proposal
                                    <Icon name="arrow" />
                                </ButtonLink>
                            )}
                            {mode !== 'processing' && (
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setMode('form');
                                        setStep(1);
                                    }}
                                >
                                    Try another scenario
                                </Button>
                            )}
                            {mode === 'processing' && (
                                <ButtonLink
                                    href={index().url}
                                    variant="secondary"
                                >
                                    Return to portal
                                </ButtonLink>
                            )}
                        </div>
                    </Card>
                </div>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout>
            <Head title="New proposal" />
            <div className="mx-auto max-w-4xl">
                <div>
                    <p className="text-sm font-semibold text-teal-700">
                        New proposal
                    </p>
                    <h1 className="mt-1 text-3xl font-semibold tracking-[-0.035em] text-slate-950">
                        Turn an EagleView into a proposal
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Add the property details and original XML report. You
                        can review everything before submission.
                    </p>
                </div>
                <ol
                    className="mt-7 grid grid-cols-4 gap-2"
                    aria-label="Proposal steps"
                >
                    {['Customer', 'Report', 'Scope', 'Review'].map(
                        (label, indexValue) => (
                            <li
                                key={label}
                                className={`border-t-2 pt-2 text-xs font-semibold ${step >= indexValue + 1 ? 'border-teal-700 text-teal-800' : 'border-slate-200 text-slate-400'}`}
                            >
                                {indexValue + 1}.{' '}
                                <span className="hidden sm:inline">
                                    {label}
                                </span>
                            </li>
                        ),
                    )}
                </ol>

                <form onSubmit={submit}>
                    <Card className="mt-6 p-5 sm:p-7">
                        {step === 1 && (
                            <div>
                                <h2 className="text-lg font-semibold text-slate-950">
                                    Customer and property
                                </h2>
                                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Customer name
                                        <input
                                            required
                                            value={draft.customerName}
                                            onChange={(event) =>
                                                update(
                                                    'customerName',
                                                    event.target.value,
                                                )
                                            }
                                            className={fieldClass}
                                            placeholder="Full name"
                                        />
                                    </label>
                                    <label className="text-sm font-medium text-slate-700">
                                        Email
                                        <input
                                            required
                                            type="email"
                                            value={draft.email}
                                            onChange={(event) =>
                                                update(
                                                    'email',
                                                    event.target.value,
                                                )
                                            }
                                            className={fieldClass}
                                            placeholder="customer@example.com"
                                        />
                                    </label>
                                    <label className="text-sm font-medium text-slate-700">
                                        Phone
                                        <input
                                            value={draft.phone}
                                            onChange={(event) =>
                                                update(
                                                    'phone',
                                                    event.target.value,
                                                )
                                            }
                                            className={fieldClass}
                                            placeholder="(555) 555-0100"
                                        />
                                    </label>
                                    <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                                        Property address
                                        <input
                                            required
                                            value={draft.address}
                                            onChange={(event) =>
                                                update(
                                                    'address',
                                                    event.target.value,
                                                )
                                            }
                                            className={fieldClass}
                                            placeholder="Street, city, state, ZIP"
                                        />
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    onClick={chooseSample}
                                    className="mt-5 text-sm font-semibold text-teal-700 hover:text-teal-900"
                                >
                                    Fill with the boss-demo sample
                                </button>
                            </div>
                        )}
                        {step === 2 && (
                            <div>
                                <h2 className="text-lg font-semibold text-slate-950">
                                    EagleView report
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Use the original XML export. EstimateDesk
                                    validates its structure before any
                                    calculation starts.
                                </p>
                                <label className="mt-5 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-teal-500 hover:bg-teal-50/30">
                                    <Icon
                                        name="upload"
                                        className="size-7 text-teal-700"
                                    />
                                    <span className="mt-3 text-sm font-semibold text-slate-800">
                                        {draft.fileName ||
                                            'Choose EagleView XML'}
                                    </span>
                                    <span className="mt-1 text-xs text-slate-500">
                                        XML only · original export preferred
                                    </span>
                                    <input
                                        type="file"
                                        accept=".xml,text/xml,application/xml"
                                        className="sr-only"
                                        onChange={(event) =>
                                            update(
                                                'fileName',
                                                event.target.files?.[0]?.name ??
                                                    '',
                                            )
                                        }
                                    />
                                </label>
                                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            update(
                                                'fileName',
                                                'EagleView-53409152.xml',
                                            )
                                        }
                                        className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-600"
                                    >
                                        Use valid sample
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            update(
                                                'fileName',
                                                'malformed-report.xml',
                                            )
                                        }
                                        className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-600"
                                    >
                                        Demo malformed
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            update(
                                                'fileName',
                                                'duplicate-53409152.xml',
                                            )
                                        }
                                        className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-600"
                                    >
                                        Demo duplicate
                                    </button>
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                            <div>
                                <h2 className="text-lg font-semibold text-slate-950">
                                    Roof and scope
                                </h2>
                                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Roof material
                                        <select
                                            value={draft.roofMaterial}
                                            onChange={(event) =>
                                                update(
                                                    'roofMaterial',
                                                    event.target.value,
                                                )
                                            }
                                            className={fieldClass}
                                        >
                                            <option>
                                                Architectural asphalt
                                            </option>
                                            <option>Designer asphalt</option>
                                            <option>Metal</option>
                                            <option>Tile</option>
                                        </select>
                                    </label>
                                    <label className="text-sm font-medium text-slate-700">
                                        Existing layers
                                        <select
                                            value={draft.layers}
                                            onChange={(event) =>
                                                update(
                                                    'layers',
                                                    event.target.value,
                                                )
                                            }
                                            className={fieldClass}
                                        >
                                            <option value="1">One layer</option>
                                            <option value="2">
                                                Two layers
                                            </option>
                                            <option value="3">
                                                Three or more
                                            </option>
                                        </select>
                                    </label>
                                </div>
                                <label className="mt-6 flex cursor-pointer gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                    <input
                                        type="checkbox"
                                        checked={draft.unusualWork}
                                        onChange={(event) =>
                                            update(
                                                'unusualWork',
                                                event.target.checked,
                                            )
                                        }
                                        className="mt-1 size-4 accent-amber-700"
                                    />
                                    <span>
                                        <span className="block text-sm font-semibold text-amber-950">
                                            This project includes unusual work
                                        </span>
                                        <span className="mt-1 block text-sm leading-5 text-amber-800">
                                            Flags the proposal for owner review
                                            before pricing is released.
                                        </span>
                                    </span>
                                </label>
                                <label className="mt-5 block text-sm font-medium text-slate-700">
                                    Site photos{' '}
                                    <span className="font-normal text-slate-400">
                                        (optional)
                                    </span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="mt-2 block w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:font-semibold"
                                    />
                                </label>
                            </div>
                        )}
                        {step === 4 && (
                            <div>
                                <h2 className="text-lg font-semibold text-slate-950">
                                    Review submission
                                </h2>
                                <dl className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
                                    {[
                                        [
                                            'Customer',
                                            draft.customerName || 'Not entered',
                                        ],
                                        [
                                            'Property',
                                            draft.address || 'Not entered',
                                        ],
                                        [
                                            'Report',
                                            draft.fileName ||
                                                'No file selected',
                                        ],
                                        [
                                            'Roof',
                                            `${draft.roofMaterial} · ${draft.layers} layer(s)`,
                                        ],
                                        [
                                            'Review',
                                            draft.unusualWork
                                                ? 'Owner review required'
                                                : 'Standard automatic checks',
                                        ],
                                    ].map(([term, value]) => (
                                        <div
                                            key={term}
                                            className="grid gap-1 px-4 py-3 sm:grid-cols-[140px_1fr]"
                                        >
                                            <dt className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                                                {term}
                                            </dt>
                                            <dd className="text-sm font-medium text-slate-700">
                                                {value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                                <div className="mt-5 flex gap-3 rounded-xl bg-sky-50 p-4 text-sm leading-6 text-sky-900">
                                    <Icon
                                        name="mail"
                                        className="mt-1 shrink-0"
                                    />
                                    <p>
                                        <strong>
                                            Notification goes to the rep.
                                        </strong>{' '}
                                        It includes the proposal link and
                                        internal breakdown PDF. EstimateDesk
                                        does not automatically email the
                                        homeowner; the rep chooses when to send
                                        the customer link.
                                    </p>
                                </div>
                            </div>
                        )}
                    </Card>
                    <div className="mt-5 flex items-center justify-between">
                        <Button
                            type="button"
                            variant="ghost"
                            disabled={step === 1}
                            onClick={() => setStep((value) => value - 1)}
                        >
                            Back
                        </Button>
                        {step < 4 ? (
                            <Button
                                type="button"
                                onClick={() => setStep((value) => value + 1)}
                            >
                                Continue
                                <Icon name="arrow" />
                            </Button>
                        ) : (
                            <Button type="submit">
                                Submit proposal
                                <Icon name="arrow" />
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </PortalLayout>
    );
}
