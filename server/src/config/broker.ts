import { Aedes } from 'aedes';
import { createServer } from 'net';
import { createServer as createHttpServer } from 'http';
import ws from 'websocket-stream';

const MQTT_PORT = 1883;
const WS_PORT = 9001;

Aedes.createBroker().then((broker) => {
    // Serveur TCP pour le backend et la partie elec
    const server = createServer(broker.handle.bind(broker));
    server.listen(MQTT_PORT, () => {
        console.log(`🚀 Broker MQTT démarré sur le port ${MQTT_PORT}`);
    });

    // Serveur WebSocket pour le frontend (navigateur)
    const httpServer = createHttpServer();
    ws.createServer({ server: httpServer }, broker.handle.bind(broker) as any);
    httpServer.listen(WS_PORT, () => {
        console.log(`🌐 Broker MQTT WebSocket démarré sur le port ${WS_PORT}`);
    });

    broker.on('client', (client) => {
        console.log(`📡 Client MQTT connecté : ${client.id}`);
    });

    broker.on('clientDisconnect', (client) => {
        console.log(`❌ Client MQTT déconnecté : ${client.id}`);
    });
});