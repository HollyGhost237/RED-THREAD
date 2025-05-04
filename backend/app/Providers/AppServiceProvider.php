<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema;
use App\Models\Discussion;
use App\Models\Recipe;
use App\Models\Reply;
use App\Policies\DiscussionPolicy;
use App\Policies\RecipePolicy;
use App\Policies\ReplyPolicy;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    protected $policies = [
        Recipe::class => RecipePolicy::class,
        Discussion::class => DiscussionPolicy::class,
        Reply::class => ReplyPolicy::class,
    ];

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // $this->registerPolicies();
        Schema::defaultStringLength(191);
    }
}
