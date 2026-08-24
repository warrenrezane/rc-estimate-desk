import { Link } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { ProposalStatus } from '@/types/estimatedesk';

export const money = (value: number): string =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);

export function BrandMark({ compact = false }: { compact?: boolean }) {
    return (
        <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-teal-700 text-white shadow-sm shadow-teal-950/20">
                <svg
                    viewBox="0 0 32 32"
                    className="size-5"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M4 17.5 16 7l12 10.5"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M8.5 16.5V25h15v-8.5M13 25v-6h6v6"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
            {!compact && (
                <span className="text-[17px] font-semibold tracking-[-0.03em] text-slate-950">
                    Estimate<span className="text-teal-700">Desk</span>
                </span>
            )}
        </div>
    );
}

const iconPaths: Record<string, ReactNode> = {
    proposals: (
        <>
            <path d="M6 3.5h9l3 3V20.5H6z" />
            <path d="M14.5 3.5v4h3.5M9 12h6M9 16h6" />
        </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    book: (
        <>
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
            <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" />
        </>
    ),
    search: (
        <>
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
        </>
    ),
    filter: <path d="M4 6h16M7 12h10M10 18h4" />,
    arrow: <path d="m9 18 6-6-6-6" />,
    copy: (
        <>
            <rect x="8" y="8" width="11" height="11" rx="2" />
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
        </>
    ),
    mail: (
        <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m4 7 8 6 8-6" />
        </>
    ),
    download: (
        <>
            <path d="M12 3v12m-4-4 4 4 4-4" />
            <path d="M5 20h14" />
        </>
    ),
    eye: (
        <>
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
            <circle cx="12" cy="12" r="2.5" />
        </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    alert: (
        <>
            <path d="m12 3 10 18H2z" />
            <path d="M12 9v5m0 3h.01" />
        </>
    ),
    clock: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </>
    ),
    lock: (
        <>
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    upload: (
        <>
            <path d="M12 16V4m-4 4 4-4 4 4" />
            <path d="M4 15v5h16v-5" />
        </>
    ),
    refresh: (
        <>
            <path d="M20 6v5h-5" />
            <path d="M18.5 9A8 8 0 1 0 20 15" />
        </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
};

export function Icon({
    name,
    className,
}: {
    name: keyof typeof iconPaths;
    className?: string;
}) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={clsx('size-4', className)}
            aria-hidden="true"
        >
            {iconPaths[name]}
        </svg>
    );
}

export function StatusBadge({ status }: { status: ProposalStatus }) {
    const styles: Record<ProposalStatus, string> = {
        received: 'bg-sky-50 text-sky-700 ring-sky-600/15',
        processing: 'bg-violet-50 text-violet-700 ring-violet-600/15',
        ready: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
        needs_review: 'bg-amber-50 text-amber-800 ring-amber-600/20',
        rejected: 'bg-rose-50 text-rose-700 ring-rose-600/15',
    };
    const labels: Record<ProposalStatus, string> = {
        received: 'Received',
        processing: 'Processing',
        ready: 'Ready',
        needs_review: 'Needs review',
        rejected: 'Rejected',
    };

    return (
        <span
            className={clsx(
                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
                styles[status],
            )}
        >
            {labels[status]}
        </span>
    );
}

const buttonBase =
    'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50';
const variants = {
    primary:
        'bg-teal-700 text-white shadow-sm hover:bg-teal-800 focus-visible:outline-teal-700',
    secondary:
        'border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-slate-400',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-slate-400',
    danger: 'border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 focus-visible:outline-rose-500',
};

export function Button({
    variant = 'primary',
    className,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: keyof typeof variants;
}) {
    return (
        <button
            className={clsx(buttonBase, variants[variant], className)}
            {...props}
        />
    );
}

export function ButtonLink({
    href,
    children,
    variant = 'primary',
    className,
}: {
    href: string;
    children: ReactNode;
    variant?: keyof typeof variants;
    className?: string;
}) {
    return (
        <Link
            href={href}
            className={clsx(buttonBase, variants[variant], className)}
        >
            {children}
        </Link>
    );
}

export function Card({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <section
            className={clsx(
                'rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]',
                className,
            )}
        >
            {children}
        </section>
    );
}

export function EmptyLoading() {
    return (
        <div className="grid min-h-64 place-items-center text-sm text-slate-500">
            <span className="animate-pulse">Loading proposal data…</span>
        </div>
    );
}
