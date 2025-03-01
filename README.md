# CalcMent

## Introduction

CalcMent est une application mobile développée avec Expo et TypeScript. Elle vise à aider les utilisateurs à améliorer leurs compétences en calcul mental en leur proposant des opérations à résoudre.

## Objectifs

* Fournir une interface simple et intuitive pour pratiquer le calcul mental.
* Générer des opérations aléatoires entre deux nombres avec plusieurs niveaux de difficulté.
* Permettre à l'utilisateur de vérifier sa réponse et d'afficher un feedback immédiat.
* Maintenir un score pour motiver l'utilisateur à s'améliorer avec un système de highscore.
* Avoir le choix entre le français et l'anglais pour le langage de l'application

## Fonctionnalités actuelles

### Page d'acceuil

* Affiche le titre du jeu
* Contient le bouton jouer

### Page de jeu

* Génère deux nombres aléatoires
* Affiche l'opération à résoudre
* Fournit un champ de texte pour que l'utilisateur entre sa réponse.
* Met à jour le score en fonction des réponses correctes.
* Génère une nouvelle addition après chaque réponse.

## Structure du Projet

```
CalcMent/
├── app/
│   ├── index.tsx          # Page d'accueil
│   ├── game.tsx           # Page de jeu
│   └── _layout.tsx        # Layout global (optionnel)
├── components/            # Composants réutilisables
├── assets/                # Assets (images, polices, etc.)
├── app.json               # Configuration Expo
└── package.json
```

### Description des fichiers
* ``app/index.tsx`` : Page d'accueil avec un bouton pour démarrer le jeu.
* ``app/game.tsx`` : Page de jeu où les additions sont générées et résolues
* ``app/_layout.tsx`` : Layout global
* ``components/`` : Dossier pour les composants
* ``assets/`` : Dossier pour les images, polices, etc.

## Technologies Utilisées

* Expo : Framework pour développer des applications React Native.
* TypeScript : Langage de programmation pour ajouter des types à JavaScript.
* Expo Router : Système de navigation basé sur le dossier app/.
* React Native : Bibliothèque pour construire des interfaces utilisateur natives.
* React Navigation : Gestion de la navigation entre les écrans.

## Améliorations Futures

* plusieurs niveaux de difficulté 
* score basé sur le temps et difficulté 
* plusieurs opérations autres que la multiplication
* système de highscore stocké localement
* style plus personnalisé