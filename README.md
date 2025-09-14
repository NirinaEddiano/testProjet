Studena Matchmaking
Studena Matchmaking est une application web développée avec Next.js pour connecter des tuteurs et des élèves en fonction de leurs matières, niveaux scolaires et disponibilités. L’application utilise une base de données MySQL pour stocker les informations des utilisateurs et effectue des calculs de compatibilité pour proposer des correspondances optimales.
Prérequis

Node.js : Version 18.x ou supérieure.
npm : Inclus avec Node.js.
MySQL : Une instance MySQL (par exemple, hébergée sur Aiven ou localement avec XAMPP pour le développement).
Git : Pour gérer le code source.
Vercel CLI (facultatif) : Pour le déploiement local ou les tests.

Installation

Cloner le dépôt :
git clone <URL_DU_DEPOT>
cd studena-matchmaking


Installer les dépendances :
npm install


Configurer la base de données :

Créez une base de données MySQL nommée studena_matchmaking.

Exécutez le script SQL suivant pour créer les tables nécessaires :
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role ENUM('tutor', 'student') NOT NULL
);

CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE levels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE user_subjects (
    user_id INT,
    subject_id INT,
    PRIMARY KEY (user_id, subject_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

CREATE TABLE user_levels (
    user_id INT,
    level_id INT,
    PRIMARY KEY (user_id, level_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (level_id) REFERENCES levels(id)
);

CREATE TABLE availabilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    day VARCHAR(255) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);




Configurer les variables d’environnement :

Créez un fichier .env.local à la racine du projet avec les informations de connexion à votre base de données MySQL :DB_HOST=<VOTRE_HOST>
DB_PORT=<VOTRE_PORT>
DB_USER=<VOTRE_UTILISATEUR>
DB_PASSWORD=<VOTRE_MOT_DE_PASSE>
DB_NAME=studena_matchmaking

Par exemple, pour une instance locale avec XAMPP :DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=studena_matchmaking




Lancer le serveur de développement :
npm run dev

Ouvrez http://localhost:3000 dans votre navigateur pour voir l’application.


Structure du projet

app/page.js : Page d’accueil affichant le formulaire d’ajout d’utilisateur, la liste des tuteurs et les correspondances pour les élèves.
app/components/AddUserForm.js : Composant client pour ajouter des utilisateurs (tuteurs ou élèves) avec leurs matières, niveaux et disponibilités.
app/components/TutorCard.js, StudentCard.js, StudentMatchCard.js, TutorMatchResult.js : Composants pour afficher les informations des tuteurs, des élèves et des correspondances.
services/dataService.js : Contient les fonctions serveur pour récupérer les tuteurs, élèves, matières et niveaux depuis la base de données.
services/matchmakingService.js : Gère la logique de matchmaking pour associer les élèves aux tuteurs en fonction des critères.
lib/db.js : Configure la connexion à la base de données MySQL avec mysql2/promise.

Déploiement sur Vercel

Pousser le code vers GitHub :

Créez un dépôt GitHub et poussez votre code :git remote add origin <URL_DU_DEPOT>
git push -u origin main




Configurer une base de données MySQL gratuite (Aiven) :

Inscrivez-vous sur Aiven.io et créez une instance MySQL (plan Startup gratuit).
Importez votre base de données locale dans Aiven en utilisant un client MySQL :mysql -h <AIVEN_HOST> -P <AIVEN_PORT> -u <AIVEN_USER> -p <AIVEN_DATABASE> < studena_matchmaking.sql




Créer un projet sur Vercel :

Connectez-vous à Vercel.
Importez votre dépôt GitHub via New Project.
Configurez les variables d’environnement dans Settings > Environment Variables :DB_HOST=<AIVEN_HOST>
DB_PORT=<AIVEN_PORT>
DB_USER=<AIVEN_USER>
DB_PASSWORD=<AIVEN_PASSWORD>
DB_NAME=studena_matchmaking




Configurer Webpack :

Assurez-vous que next.config.js inclut la configuration suivante pour éviter les erreurs liées aux modules Node.js :/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        net: false,
        tls: false,
        timers: false,
        events: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;




Déployer :

Cliquez sur Deploy dans l’interface Vercel. Une fois déployé, vous obtiendrez une URL pour accéder à votre application.



Tester l’application

Ajoutez un utilisateur via le formulaire pour vérifier que les données sont enregistrées dans la base de données.
Consultez les sections Nos Tuteurs et Matchmaking Élèves pour vérifier l’affichage des données.
Vérifiez les journaux dans Vercel (Logs) pour diagnostiquer tout problème.

