<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PricebookController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('pricebook/index');
    }
}
