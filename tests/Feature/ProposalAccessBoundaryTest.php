<?php

use Inertia\Testing\AssertableInertia as Assert;

test('the homeowner proposal is public and receives no internal breakdown data', function () {
    $this->get(route('proposals.homeowner', 'ed-1048'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('proposals/homeowner')
            ->where('proposalId', 'ed-1048')
            ->missing('breakdown')
            ->missing('internal')
        );
});

test('the internal breakdown uses its own portal route and page', function () {
    $this->get(route('proposals.breakdown', 'ed-1048'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('proposals/breakdown')
            ->where('proposalId', 'ed-1048')
        );
});

test('unknown portal routes return not found', function () {
    $this->get('/breakdown/ed-1048')->assertNotFound();
});
