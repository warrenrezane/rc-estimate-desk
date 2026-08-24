<?php

use App\Http\Controllers\PricebookController;
use App\Http\Controllers\ProposalController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/proposals')->name('home');

Route::prefix('proposals')->name('proposals.')->group(function (): void {
    Route::get('/', [ProposalController::class, 'index'])->name('index');
    Route::get('/new', [ProposalController::class, 'create'])->name('create');
    Route::get('/{proposal}', [ProposalController::class, 'show'])->name('show');
    Route::get('/{proposal}/customer', [ProposalController::class, 'homeowner'])->name('homeowner');
    Route::get('/{proposal}/breakdown', [ProposalController::class, 'breakdown'])->name('breakdown');
});

Route::get('/pricebook', [PricebookController::class, 'index'])->name('pricebook.index');
