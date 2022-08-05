//Directs socket connection to server
const socket = io('http://localhost:3001') || io('https://narratorium.herokuapp.com')

//Logs connection on connection to server
socket.on('connect', () => {
    console.log(`Connected with socket id ${socket.id}`)
})
