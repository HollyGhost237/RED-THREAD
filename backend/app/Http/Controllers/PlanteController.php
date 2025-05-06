<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Plante;

class PlanteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Plante::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom_local' => 'required|string|max:255',
            'nom_scientifique' => 'nullable|string|max:255',
            'description_courte' => 'required|string',
            'description_complete' => 'required|string',
            'lieu_culture' => 'required|string|max:255',
            'periode_culture' => 'required|string|max:255',
            'maladies' => 'required|array',
            'maladies.*' => 'string|max:255',
            'image' => 'required|image|max:2048'
        ]);

        $imagePath = $request->file('image')->store('plantes', 'public');

        $plante = Plante::create([
            'nom_local' => $validated['nom_local'],
            'nom_scientifique' => $validated['nom_scientifique'],
            'description_courte' => $validated['description_courte'],
            'description_complete' => $validated['description_complete'],
            'lieu_culture' => $validated['lieu_culture'],
            'periode_culture' => $validated['periode_culture'],
            'maladies' => $validated['maladies'],
            'image_path' => $imagePath
        ]);

        return response()->json($plante, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
