<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()?->isAdmin()) {
            return response()->json([
                'message' => 'Administrator privileges required',
                'docs' => route('api.docs') // Optionnel
            ], Response::HTTP_FORBIDDEN);
        }

        // Vérification CSRF pour les formulaires admin
        if ($request->isMethod('POST|PUT|PATCH|DELETE') && 
            !$request->routeIs('admin.*')) {
            abort_unless(
                $request->header('X-Requested-With') === 'XMLHttpRequest',
                Response::HTTP_FORBIDDEN
            );
        }

        return $next($request);
    }
}