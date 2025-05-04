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
        Schema::create('discussions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('content');
            $table->foreignId('recipe_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('views_count')->default(0);
            $table->timestamps();
            
            // Index pour les performances
            $table->index(['created_at']);
            $table->index(['recipe_id']);
            $table->index(['user_id']);
        });
    
        Schema::create('discussion_views', function (Blueprint $table) {
            $table->foreignId('discussion_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->nullOnDelete();
            $table->string('ip_address')->nullable();
            $table->timestamp('viewed_at');
            
            $table->primary(['discussion_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discussions');
    }
};
