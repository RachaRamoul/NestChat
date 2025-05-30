# NestChat

Application fullstack avec **NestJS** pour le backend et **React** pour le frontend, avec authentification sécurisée via JWT.


## Lancer le projet
    - A la racine du projet : docker-compose up --build

## Fonctionnalités

# Authentification
    - Inscription d'un nouvel utilisateur avec email, mot de passe et nom d'utilisateur
    - Connexion sécurisée avec génération de token JWT
    - Stockage du token dans localStorage côté frontend

# Sécurité
    - Hachage des mots de passe avec bcrypt
    - Protection des routes via JwtGuard côté backend
    - Accès restreint à la page /chat si l’utilisateur n’est pas connecté

# Chat
    - Connexion à un chat en temps réel (WebSocket)
    - Liste de tous les utilisateurs connectés visible
    - Possibilité de sélectionner un utilisateur pour discuter
    - Réception de messages avec notification visuelle
    - Nom + messages colorés selon le choix personnalisé

# Profil & Personnalisation
    - L’utilisateur peut choisir une couleur personnalisée
    - Cette couleur s’applique à son nom et à ses messages
    - La couleur est visible pour lui-même et les autres utilisateurs

# Frontend (React)
    - Formulaires de login et register centrés, stylés et responsive
    - Messages d’erreur et de succès visibles dans l’interface
    - Redirection automatique après connexion/inscription
    - Appels d’API via Axios vers le backend Nest

# Technologies utilisées
    - Backend : NestJS, Prisma, JWT, bcrypt
    - Frontend : React (Vite), Axios, CSS natif
    - Base de données : SQLite (en développement)
    - Déploiement : Docker / docker-compose

# Arborescence simplifiée
    .
    ├── backend/
    │   ├── src/ (auth, users, chat, etc.)
    │   └── prisma/ (schema + base SQLite)
    ├── frontend/
    │   ├── src/pages/ (Login, Register, Chat)
    │   └── src/components/
    └── docker-compose.yml
