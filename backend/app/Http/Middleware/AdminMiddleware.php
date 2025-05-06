<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Administrator privileges required',
                // 'docs' => route('api.docs') 
            ], Response::HTTP_FORBIDDEN);
        }

        // Vérification supplémentaire pour les requêtes non-GET
        if (!$request->isMethod('GET') && !$request->expectsJson()) {
            return response()->json([
                'message' => 'JSON requests only for admin actions'
            ], Response::HTTP_BAD_REQUEST);
        }

        return $next($request);
    }
}