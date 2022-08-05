//Directs socket connection to server
const socket = io('http://localhost:3001') || io('https://narratorium.herokuapp.com')

//TODO place this in an event listener 
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

socket.on('testEvent', (data) => {
    console.table(data)
})

//Call this function when a user makes a submission
function onSubmit (submissionText, position, user, story) {
    socket.emit('submission', submissionText, position, user, story)
}

//Call this function when a user deletes a word
function onDelete (wordDeleted, position) {
    socket.emit('deletion', wordDeleted, position, story)
}

//Call this function when the user navigates to a story
function viewStory(storyName) {
    socket.emit('viewStory', storyname)
}

//Call this function when the user renames a story
function renameStory(newName, story_id) {
    socket.emit('renameStory', newName, story_id, (response) => {
        //Function for renaming the story title and any relevant HTML changes here
        console.log(response)
    })
    
}