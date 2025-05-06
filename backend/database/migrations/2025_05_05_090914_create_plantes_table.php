<?php 

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('plantes', function (Blueprint $table) {
            $table->id();
            $table->string('nom_local');
            $table->string('nom_scientifique')->nullable();
            $table->text('description_courte');
            $table->text('description_complete');
            $table->string('lieu_culture');
            $table->string('periode_culture');
            $table->json('maladies'); // Stockera un tableau JSON des maladies
            $table->string('image_path'); // Chemin vers l'image dans storage
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('plantes');
    }
};