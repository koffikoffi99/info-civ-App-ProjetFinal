Présentation Technique – InfoCIV

▶️ Lancer l'application en local
1. Démarrer le backend

cd backend
npm install
npm run dev
Le backend sera accessible sur http://localhost:5000.

2. Démarrer le frontend

cd frontend
npm install
npm run dev
Le frontend sera accessible sur http://localhost:5173.

🖥️ Frontend
Le frontend de ce projet a été développé avec React.js, avec un design entièrement responsive grâce à Tailwind CSS.

🔧 Structure du dossier frontend/
frontend/
├── public/
├── src/
│   ├── components/    # Composants réutilisables (Navbar, Formulaires, etc.)
│   ├── pages/         # Vues principales (Accueil, Connexion, Inscription...)
│   └── App.jsx        # Point d’entrée de l’application React

✨ Fonctionnalités principales
Barre de navigation présente sur toutes les pages :

À gauche : nom du site

À droite : liens vers Accueil, Connexion et Inscription

Accueil :

Affiche toutes les publications

Lorsqu’un utilisateur connecté publie un message, il s’affiche automatiquement

Connexion : permet aux utilisateurs déjà inscrits de se connecter

Inscription : permet aux nouveaux utilisateurs de créer un compte

Interface responsive (mobile, tablette, desktop)

⚙️ Backend
Le backend repose sur Node.js et Express, avec une structure modulaire pour faciliter la maintenance.

🧰 Technologies utilisées
Express : API REST

Mongoose : base de données MongoDB

bcryptjs : hachage des mots de passe

jsonwebtoken : gestion des tokens d’authentification

multer + cloudinary + datauri : gestion et stockage des fichiers (images)

dotenv : gestion des variables d’environnement

cors : communication sécurisée entre frontend et backend

express-async-handler : simplification des gestionnaires d’erreurs asynchrones

📁 Structure du dossier backend/
backend/
├── config/        # Configuration de services externes (Cloudinary, etc.)
├── controllers/   # Logique métier
├── database/      # Connexion à MongoDB
├── middleware/    # Authentification, gestion d’erreurs
├── models/        # Schémas Mongoose
├── routes/        # Routes API
└── server.js      # Point d’entrée de l’application Express

🔐 Fonctionnalités

Authentification sécurisée par JWT

Inscription / connexion d’utilisateurs

Création de publications avec ou sans image

Middleware de protection des routes privées

Connexion robuste à MongoDB avec gestion d’erreurs

🔁 Intégration frontend-backend
Le frontend communique avec le backend via des appels API REST grâce à Axios.
Les actions suivantes sont possibles :

Inscription et connexion des utilisateurs

Création de publications

Récupération et affichage des publications sur la page d'accueil

Un système de token permet de protéger les routes selon l'état de connexion de l'utilisateur.

📝 Formulaire de création de publication
Les utilisateurs connectés peuvent remplir un formulaire avec les champs suivants :

Champ	Description
Titre	Titre de la publication
Catégorie	Sélection parmi : Tourisme, Santé, Astuces, Loisir
Lieu	Lieu géographique concerné
Description	Texte descriptif
Image	Image illustrative (uploadée et stockée via Cloudinary)

Une fois le formulaire soumis :

Les données sont envoyées au backend via une API.

Le backend enregistre le post (et l’image si fournie).

Le post est immédiatement visible dans la section Accueil du frontend.


🌐 Déploiement
Frontend : Netlify

Backend : Render

🧑‍💻 Auteur
Projet réalisé par [koffi koffi]
Contact : [koffikoffias23@gmail.com]

lien du projet en ligne : https://mellow-salamander-74a33b.netlify.app/

