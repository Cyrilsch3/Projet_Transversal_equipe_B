# 📖 User Stories - Projet Contrôle d'Accès RFID

Ce document liste les fonctionnalités attendues du système de contrôle d'accès (Pico W + MQTT + Node.js/SQLite + React) sous forme de User Stories.

## 📡 Épique 1 : Interaction Matérielle (Lecteur RFID Pico W)

### US 1.1 : Badgage utilisateur connu
* **En tant qu'** utilisateur enregistré,
* **Je veux** passer mon badge RFID sur le lecteur,
* **Afin de** valider mon entrée ou ma sortie du bâtiment.
* **Critères d'acceptation :** Le Pico lit l'UID, l'envoie sur le topic `rfid/scan`, reçoit `status:"ok"`, et allume la LED correspondante (Entrée ou Sortie) pendant 2 secondes.

### US 1.2 : Présentation d'un nouveau badge
* **En tant qu'** administrateur ou nouvel employé,
* **Je veux** badger une carte vierge ou inconnue sur le lecteur,
* **Afin que** le système la reconnaisse comme étant en attente d'assignation.
* **Critères d'acceptation :** Le Pico reçoit le statut `status:"pending"` et fait clignoter les LEDs de manière alternée pour indiquer visuellement l'attente d'enregistrement.

### US 1.3 : Tolérance aux pannes réseau
* **En tant qu'** utilisateur,
* **Je veux** être averti si le lecteur n'arrive pas à joindre le serveur lors de mon badgage,
* **Afin de** comprendre pourquoi l'accès ne s'ouvre pas.
* **Critères d'acceptation :** En cas de non-réponse du serveur MQTT dans les 2 secondes, les deux LEDs du Pico flashent rapidement pour signaler l'erreur de communication.

---

## ⚙️ Épique 2 : Traitement Backend et Base de données (Serveur / MQTT)

### US 2.1 : Vérification des accès
* **En tant que** système backend,
* **Je veux** écouter le broker MQTT sur le topic de scan pour vérifier l'UID dans la base de données (SQLite),
* **Afin de** répondre en temps réel sur le topic `rfid/response/<UID>` avec le statut approprié.

### US 2.2 : Gestion de la présence (Toggle Entrée/Sortie)
* **En tant qu'** administrateur,
* **Je veux** que la base de données mette à jour automatiquement le statut de l'utilisateur (présent/absent) à chaque scan valide,
* **Afin de** garder une trace exacte de qui est dans les locaux.

### US 2.3 : Capture des badges en attente
* **En tant qu'** administrateur,
* **Je veux** que le backend enregistre temporairement les UID inconnus scannés,
* **Afin de** pouvoir les afficher sur l'interface web pour une assignation future.

---

## 💻 Épique 3 : Interface Web d'Administration (Client React)

### US 3.1 : Tableau de bord des utilisateurs
* **En tant qu'** administrateur RH ou sécurité,
* **Je veux** consulter une page web présentant la liste de tous les utilisateurs enregistrés,
* **Afin de** voir d'un coup d'œil qui est actuellement présent ou absent.

### US 3.2 : Enregistrement d'un nouveau badge
* **En tant qu'** administrateur,
* **Je veux** voir apparaître sur l'interface web la dernière carte inconnue scannée,
* **Afin de** pouvoir l'associer facilement à un profil (nom, prénom) et lui donner les droits d'accès.

### US 3.3 : Ajout, modification et suppression d'utilisateurs
* **En tant qu'** administrateur,
* **Je veux** pouvoir créer un nouvel utilisateur ou supprimer un compte existant via le tableau de bord,
* **Afin de** gérer facilement le cycle de vie du personnel.

---

## 📊 Tableau Récapitulatif

| ID | Épique | Rôle | Action | Bénéfice attendu |
| :--- | :--- | :--- | :--- | :--- |
| **US 1.1** | 📡 Pico W | Utilisateur | Passer mon badge RFID | Valider mon entrée/sortie |
| **US 1.2** | 📡 Pico W | Admin | Badger une carte inconnue | Mettre la carte en attente d'assignation |
| **US 1.3** | 📡 Pico W | Utilisateur | Être averti si panne réseau | Comprendre le refus d'accès (LEDs) |
| **US 2.1** | ⚙️ Serveur | Backend | Écouter MQTT et vérifier SQLite | Répondre en temps réel au Pico W |
| **US 2.2** | ⚙️ Serveur | Admin | Maj BDD sur présence/absence | Suivre qui est dans les locaux |
| **US 2.3** | ⚙️ Serveur | Admin | Capturer les UIDs inconnus | Pouvoir les assigner plus tard via l'UI |
| **US 3.1** | 💻 React | Admin | Consulter la liste des employés | Voir l'état de présence en direct |
| **US 3.2** | 💻 React | Admin | Voir le dernier badge inconnu | Associer le badge à un nouveau profil |
| **US 3.3** | 💻 React | Admin | Gérer les utilisateurs (CRUD) | Gérer le cycle de vie du personnel |