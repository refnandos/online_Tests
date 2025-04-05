const socket = io();
let jugador = 0;

socket.on('jugadorAsignado', num => {
    jugador = num;
    document.getElementById('mensaje').textContent = `Eres el Jugador ${jugador}`;
    if (jugador === 1) document.getElementById('boton').disabled = false;
});

socket.on('salaLlena', () => {
    document.getElementById('mensaje').textContent = "La sala está llena. Inténtalo más tarde.";
});

socket.on('cambiarTurno', turno => {
    document.getElementById('boton').disabled = (jugador !== turno);
});

document.getElementById('boton').addEventListener('click', () => {
    socket.emit('presionarBoton');
});
