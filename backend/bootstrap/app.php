<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Middleware globaux
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);
        
        // Alias de middleware
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'verified.health.professional' => \App\Http\Middleware\CheckHealthProfessional::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Gestion des exceptions
    })->create();

// bootstrap/app.php
// use App\Http\Middleware\CheckHealthProfessional;

// return Application::configure()
//     ->withProviders()
//     ->withRouting()
//     ->withMiddleware(function ($middleware) {
//         $middleware->alias([
//             'verified.health.professional' => CheckHealthProfessional::class,
//         ]);
//     })
//     ->withExceptions(function ($exceptions) {
//         //
//     })->create();
