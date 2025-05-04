<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckHealthProfessional
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user()->isHealthProfessional() || !$request->user()->is_verified) {
            return response()->json([
                'message' => 'Accès réservé aux professionnels de santé vérifiés'
            ], 403);
        }

        return $next($request);
    }
}
