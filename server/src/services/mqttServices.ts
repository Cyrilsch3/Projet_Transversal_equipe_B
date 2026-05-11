// Fichier : src/services/mqttService.ts

import * as mqtt from 'mqtt';

// 1. On crée une Interface pour typer les données qu'on attend du Pico
interface RfidPayload {
    uid: string;
}

export const startMqttService = (): void => {
    // Connexion au broker Mosquitto (en local)
    const client = mqtt.connect('mqtt://127.0.0.1:1883');

    client.on('connect', () => {
        console.log('[MQTT] Serveur Node/TS connecté à Mosquitto');
        
        // Abonnement au canal du lecteur
        client.subscribe('rfid/scan', (err) => {
            if (!err) {
                console.log('[MQTT] En écoute sur le canal : rfid/scan');
            }
        });
    });

    // Écoute des messages entrants
    client.on('message', (topic: string, message: Buffer) => {
        if (topic === 'rfid/scan') {
            console.log(`[MQTT] Message reçu sur ${topic} : ${message.toString()}`);
            
            try {
                // 2. On parse le JSON en forçant le type avec notre interface
                const data = JSON.parse(message.toString()) as RfidPayload;
                const uid = data.uid;

                // --- C'EST ICI QUE TU APPELLES TA BASE DE DONNÉES ---
                let accesAutorise = false;
                
                // Exemple de vérification :
                if (uid === "A1B2C3D4") {
                    accesAutorise = true;
                }

                // 3. On prépare et on envoie la réponse
                const reponse = JSON.stringify({ status: accesAutorise });
                client.publish('rfid/response', reponse);
                console.log(`[MQTT] Réponse publiée : ${reponse}`);

            } catch (error) {
                console.error('[MQTT] Erreur lors de la lecture du JSON :', error);
            }
        }
    });
};