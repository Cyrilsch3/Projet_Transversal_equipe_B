import * as mqtt from 'mqtt';


interface RfidPayload {
    uid: string;
}

export const startMqttService = (): void => {
    // Connexion au broker Mosquitto (en local)
    const client = mqtt.connect('mqtt://127.0.0.1:1883');

    client.on('connect', () => {
        console.log('[MQTT] Serveur Node/TS connecté à Mosquitto');
        
        
        client.subscribe('rfid/scan', (err) => {
            if (!err) {
                console.log('[MQTT] En écoute sur le canal : rfid/scan');
            }
        });
    });

    client.on('message', (topic: string, message: Buffer) => {
        if (topic === 'rfid/scan') {
            console.log(`[MQTT] Message reçu sur ${topic} : ${message.toString()}`);
            
            try {
                
                const data = JSON.parse(message.toString()) as RfidPayload;
                const uid = data.uid;

                
                let accesAutorise = false;
                
                if (uid === "A1B2C3D4") {
                    accesAutorise = true;
                }

               
                const reponse = JSON.stringify({ status: accesAutorise });
                client.publish('rfid/response', reponse);
                console.log(`[MQTT] Réponse publiée : ${reponse}`);

            } catch (error) {
                console.error('[MQTT] Erreur lors de la lecture du JSON :', error);
            }
        }
    });
};