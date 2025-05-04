<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Recipe>
 */
class RecipeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->sentence,
            'slug' => $this->faker->slug,
            'description' => $this->faker->paragraph,
            'ingredients' => json_encode([
                ['name' => $this->faker->word, 'quantity' => $this->faker->randomDigit],
                ['name' => $this->faker->word, 'quantity' => $this->faker->randomDigit]
            ]),
            'preparation_steps' => $this->faker->paragraphs(3, true),
            'preparation_time' => $this->faker->numberBetween(5, 120) . ' minutes',
            'cover_image' => 'recipes/' . $this->faker->image('public/storage/recipes', 640, 480, null, false),
            'is_approved' => $this->faker->boolean(80)
        ];
    }
}
