<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::factory()
            ->admin()
            ->create([
                'name' => 'Admin Principal',
                'email' => 'admin@naturopathie.com'
            ]);
    }
}
