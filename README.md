# RED-THREAD

Enclyclopedie des Plantes - Documentation du Projet
Table des matières

    Introduction

    Fonctionnalités

    Technologies

    Installation

    Configuration

    Déploiement

    Structure du Projet

    API Endpoints

    Tests

    Contributions

    License

🌱 Introduction

Plateforme collaborative de recettes à base de plantes médicinales avec système d'authentification et forum communautaire. Permet aux professionnels de santé d'enregistrer des remèdes naturels validés scientifiquement.
Fonctionnalités

    Authentification (Sanctum)

    Système de favoris

    Tableau de bord utilisateur

    Recherche avancée

    Upload d'images

💻 Technologies
Backend (Laravel 12)

    PHP 8.2+

    Laravel Sanctum (API Auth)

    MySQL 8.0

    Eloquent ORM

    Laravel Resources

Frontend (React)

    React 18

    Axios (HTTP Client)

    React Router v6

    Tailwind CSS

    React Icons

    Framer Motion (Animations)

Outils

    Composer 2.5

    Node.js 18+

    npm 9+

    Docker (Optionnel)

🛠 Installation
Prérequis
bash

php >= 8.2
composer >= 2.5
node >= 18
mysql >= 8.0

Étapes d'installation

    Cloner le dépôt

bash

git clone https://github.com/HollyGhost237/RED-THREAD/plantes-medicinales.git
cd plantes-medicinales

    Backend (Laravel)

bash

composer install
cp .env.example .env
php artisan key:generate

    Frontend (React)

bash

cd frontend
npm install
cp .env.example .env

    Base de données

bash

mysql -u root -p
CREATE DATABASE plantes_medicinales;
exit

php artisan migrate --seed

⚙ Configuration
Fichier .env (Laravel)
ini

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=plantes_medicinales
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost

Fichier .env (React)
ini

VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Plantes Médicinales

Structure du Projet

backend/
  ├── app/
  │   ├── Models/
  │   ├── Http/
  │   │   ├── Controllers/
  │   │   ├── Middleware/
  │   │   └── Requests/
  │   └── Providers/
  ├── config/
  ├── database/
  │   ├── migrations/
  │   └── seeders/
  └── routes/
frontend/
  ├── public/
  ├── src/
  │   ├── components/
  │   ├── pages/
  │   ├── contexts/
  │   └── layouts/
  └── package.json

API Endpoints (Key Routes)
http

POST    /api/auth/login
POST    /api/auth/register
GET     /api/user/profile
PUT     /api/user/profile

GET     /api/recipes
POST    /api/recipes
GET     /api/recipes/{id}
PUT     /api/recipes/{id}

GET     /api/discussions
POST    /api/discussions

Tests
bash

# Tests PHP (Backend)
php artisan test

# Tests Frontend (React)
cd frontend
npm test

Déploiement
Pour production
bash

# Backend
php artisan optimize
php artisan config:cache

# Frontend
cd frontend
npm run build


🤝 Contributions

    Forkez le projet

    Créez une branche (git checkout -b feature/AmazingFeature)

    Committez (git commit -m 'Add some AmazingFeature')

    Pushez (git push origin feature/AmazingFeature)

    Ouvrez une Pull Request

License

MIT License - Voir le fichier LICENSE pour plus de détails.

Note : Ce projet utilise Laravel 12 avec Sanctum pour l'authentification API et React 18 pour l'interface. Assurez-vous d'avoir les versions correctes des dépendances avant l'installation.