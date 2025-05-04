<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // public function up()
    // {
    //     Schema::table('users', function (Blueprint $table) {
    //         $table->enum('role', ['user', 'health_professional', 'admin'])
    //             ->default('user')
    //             ->after('password');
                
    //         $table->string('professional_title')
    //             ->nullable()
    //             ->after('role');
                
    //         $table->string('avatar')
    //             ->nullable()
    //             ->after('professional_title');
                
    //         $table->text('bio')
    //             ->nullable()
    //             ->after('avatar');
            
    //         $table->string('professional_title')
    //             ->nullable();

    //         $table->boolean('is_verified')
    //             ->default(false);
                
    //         $table->timestamp('verified_at')
    //             ->nullable();   
                
    //         $table->boolean('is_verified')
    //             ->default(false)
    //             ->after('bio');
    //     });
    // }

    public function up()
{
    Schema::table('users', function (Blueprint $table) {
        // Déplacement des champs existants pour éviter les doublons
        if (!Schema::hasColumn('users', 'role')) {
            $table->enum('role', ['user', 'health_professional', 'admin'])
                ->default('user')
                ->after('password');
        }

        // Ajout seulement si le champ n'existe pas déjà
        if (!Schema::hasColumn('users', 'professional_title')) {
            $table->string('professional_title')
                ->nullable()
                ->after('role');
        }

        if (!Schema::hasColumn('users', 'avatar')) {
            $table->string('avatar')
                ->nullable()
                ->after('professional_title');
        }

        if (!Schema::hasColumn('users', 'bio')) {
            $table->text('bio')
                ->nullable()
                ->after('avatar');
        }

        // Correction du doublon is_verified
        if (!Schema::hasColumn('users', 'is_verified')) {
            $table->boolean('is_verified')
                ->default(false)
                ->after('bio');
        }

        if (!Schema::hasColumn('users', 'verified_at')) {
            $table->timestamp('verified_at')
                ->nullable()
                ->after('is_verified');
        }

        // Nouveaux champs admin (optionnels)
        if (!Schema::hasColumn('users', 'admin_settings')) {
            $table->json('admin_settings')
                ->nullable()
                ->after('verified_at');
        }

        $table->index(['role', 'is_verified']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'professional_title', 'avatar', 'bio', 'is_verified']);
        });
        // $table->dropColumn([
        //     'admin_settings'
        //     // Ajoutez ici seulement les nouveaux champs ajoutés
        // ]);
    }
};
