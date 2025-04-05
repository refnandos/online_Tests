import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let turno = 1; // Empieza el jugador 1
let jugadores = []; // Lista de jugadores conectados

// app.get('/', (req, res) => {
//     res.send('Welcome to Servfer')
// });

app.use(express.static('public')); // Servir archivos estáticos (HTML, JS)

app.get('/', (req, res) => {
    res.sendFile('public/index.html', {root: 'src'});
});

// app.listen(3000, () => console.log('Servidor en http://localhost:3000'));

io.on('connection', (socket) => {
    if (jugadores.length < 2) {
        jugadores.push(socket.id);
        socket.emit('jugadorAsignado', jugadores.length); // Asigna jugador 1 o 2
    } else {
        socket.emit('salaLlena');
        return;
    }

    socket.on('presionarBoton', () => {
        if (socket.id === jugadores[turno - 1]) {
            turno = turno === 1 ? 2 : 1; // Cambia de turno
            io.emit('cambiarTurno', turno); // Notifica a ambos jugadores
        }
    });

    socket.on('disconnect', () => {
        jugadores = jugadores.filter(id => id !== socket.id);
        turno = 1;
        io.emit('reiniciarJuego');
    });
});

server.listen(3000, () => {
    console.log('Servidor en http://localhost:3000');
});
