import mqtt from 'mqtt';

const client = mqtt.connect('mqtt://127.0.0.1:1883');

client.on('connect', () => {
    console.log('✅ Connecté au broker MQTT');
    // On s'abonne au topic où l'électronique envoie les badges
    client.subscribe('rfid/scan', (err) => {
        if (!err) {
            console.log('📡 Abonné au topic : rfid/scan');
        }
    });
});

export default client;