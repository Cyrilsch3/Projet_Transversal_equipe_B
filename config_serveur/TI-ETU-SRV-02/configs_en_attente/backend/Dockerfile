# Utilisation d'une image légère
FROM node:18-alpine

# Créer le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers de dépendances (optimisation du cache Docker)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port sur lequel l'API écoute (ex: 3000)
EXPOSE 8000

# Commande pour démarrer l'application 
CMD ["npm", "start"]
