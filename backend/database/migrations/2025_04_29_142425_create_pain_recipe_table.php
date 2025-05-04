<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pain_recipe', function (Blueprint $table) {
            $table->foreignId('pain_type_id')->constrained();
            $table->foreignId('recipe_id')->constrained()->cascadeOnDelete();
            $table->primary(['pain_type_id', 'recipe_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pain_recipe');
    }
};
