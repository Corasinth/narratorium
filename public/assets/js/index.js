//Directs socket connection to server
const socket = io('http://localhost:3001') || io('https://narratorium.herokuapp.com')

//Logs connection on connection to server
socket.on('connect', () => {
    console.log(`Connected with socket id ${socket.id}`)
})

socket.on('displayStory', (string) => {
    //Displays story from database on page
    console.log(string);
})

socket.on('error', (error) => {
    console.log(`%c Server returned the following error: ${error}, 'color:red;font-weight:500'`)
})

function onSubmit (submissionText, position, user, story) {
    socket.emit('submission', submissionText, position, user)
}

function onDelete (wordDeleted, position) {
    socket.emit('deletion', wordDeleted, position, story)
}


