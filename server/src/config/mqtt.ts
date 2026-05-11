import mqtt from 'mqtt';

// Connexion au broker (exemple public gratuit)
const client = mqtt.connect('mqtt://broker.hivemq.com');

client.on('connect', () => {
    console.log('✅ Connecté au broker MQTT');
    // On s'abonne au topic où l'électronique envoie les badges
    client.subscribe('ephec/equipeB/badge', (err) => {
        if (!err) {
            console.log('📡 Abonné au topic : ephec/equipeB/badge');
        }
    });
});

export default client;