<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ProposalController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('proposals/index');
    }

    public function create(): Response
    {
        return Inertia::render('proposals/create');
    }

    public function show(string $proposal): Response
    {
        return Inertia::render('proposals/show', [
            'proposalId' => $proposal,
        ]);
    }

    public function homeowner(string $proposal): Response
    {
        return Inertia::render('proposals/homeowner', [
            'proposalId' => $proposal,
        ]);
    }

    public function breakdown(string $proposal): Response
    {
        return Inertia::render('proposals/breakdown', [
            'proposalId' => $proposal,
        ]);
    }
}
