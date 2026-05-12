import { Aedes } from 'aedes';
import { createServer } from 'net';

const MQTT_PORT = 1883;

Aedes.createBroker().then((broker) => {
    const server = createServer(broker.handle.bind(broker));

    server.listen(MQTT_PORT, () => {
        console.log(`🚀 Broker MQTT démarré sur le port ${MQTT_PORT}`);
    });

    broker.on('client', (client) => {
        console.log(`📡 Client MQTT connecté : ${client.id}`);
    });

    broker.on('clientDisconnect', (client) => {
        console.log(`❌ Client MQTT déconnecté : ${client.id}`);
    });
});
