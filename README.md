# 🚪 Projet Transversal Équipe B - Contrôle d'Accès RFID

Ce projet est un système complet de contrôle d'accès physique. Il utilise un Raspberry Pi Pico W couplé à un lecteur RFID pour scanner des badges, communique en temps réel via MQTT avec un serveur central, et propose un tableau de bord web pour administrer les accès.

## 🛠️ Architecture et Technologies

Ce projet est divisé en plusieurs composants :

* **Matériel (IoT) :** Raspberry Pi Pico W (MicroPython), Lecteur RFID MFRC522.
* **Message Broker :** Eclipse Mosquitto (MQTT).
* **Backend (API & BDD) :** Node.js, TypeScript, Express, Base de données SQLite.
* **Frontend (Interface Web) :** React, Vite, CSS.
* **Déploiement :** Docker, Docker Compose, Nginx.

## 📁 Structure du dépôt

* `/client` : Code source de l'interface d'administration en React.
* `/server` : Code source de l'API Node.js et logique métier MQTT.
* `/mosquitto` : Fichiers de configuration pour le broker MQTT.
* `/` *(racine)* : Fichiers de configuration globaux (Docker Compose, GitHub Actions).

*(Note : Le code MicroPython du Raspberry Pi Pico W peut être ajouté dans un dossier `/pico` ou `/hardware` si ce n'est pas déjà fait).*

## 🚀 Installation et Lancement (avec Docker)

La méthode la plus simple pour faire tourner le projet complet (Backend, Frontend et Broker MQTT) est d'utiliser Docker.

### Prérequis
* [Docker](https://www.docker.com/) et Docker Compose installés sur votre machine.

### Étapes
1. Clonez le dépôt sur votre machine locale :
   ```bash
   git clone [https://github.com/VOTRE_NOM/projet_transversal_equipe_b.git](https://github.com/VOTRE_NOM/projet_transversal_equipe_b.git)
   cd projet_transversal_equipe_b
