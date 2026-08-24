<?php

use Inertia\Testing\AssertableInertia as Assert;

test('the proposal portal is the application entry point', function () {
    $this->get(route('home'))
        ->assertRedirect(route('proposals.index'));

    $this->get(route('proposals.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('proposals/index')
        );
});

test('the complete proposal journey has routable screens', function () {
    $this->get(route('proposals.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page->component('proposals/create'));

    $this->get(route('proposals.show', 'ed-1048'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('proposals/show')
            ->where('proposalId', 'ed-1048')
        );

    $this->get(route('pricebook.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page->component('pricebook/index'));
});
