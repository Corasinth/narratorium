//Directs socket connection to server
const socket = io('http://localhost:3001') || io('https://narratorium.herokuapp.com')

//TODO place this in an event listener 
socket.on('connect', () => {
    console.log(`Connected with socket id ${socket.id}`)
})

socket.on('displayStory', (data) => {
    //Displays story from database on page
    let storyString;
    for (let entries of data.submissions) {
        storyString += `${entries.submission} `
    }
    console.log(storyString)
})

socket.on('error', (error) => {
    console.log(`%c Server returned the following error: ${error}`, 'color:red;font-weight:500')
    console.log(error)
})

socket.on('testEvent', (data) => {
    console.table(data)
})

//Call this function when a user makes a submission
function onSubmit(submissionText, position, user_id, story_id) {
    socket.emit('submission', submissionText, position, user_id, story_id)
}

//Call this function when a user deletes a word
function onDelete(word_id) {
    socket.emit('deletion', word_id)
}

//Call this function when the user navigates to a story
function viewStory(story_id) {
    socket.emit('viewStory', story_id)
}

//Call this function when the user renames a story
function renameStory(newName, story_id) {
    socket.emit('renameStory', newName, story_id, (response) => {
        //Function for renaming the story title and any relevant HTML changes here
        console.log(response)
    })
}

//Call this function when the user renames a story
function addStory(storyName) {
    socket.emit('addStory', storyName, (response) => {
        //Function for adding a new story, place any relevant HTML changes here
        console.log(response)
    })
}

//When we open the page or login, this function runs to get our current characters stat and our current delete stat
async function onLogin () {
    const body = document.querySelector('body')
    const response = await fetch (`/api/users/${body.dataset.user_id}`)
    const userData = await response.json()
    console.log('the user data', userData)
    let numOfCharacters = userData.character_limit;
    let numOfDeletes = userData.delete_limit; 
    //TODO Code to set counters on HTML goes here! 
    console.log(`We have ${numOfCharacters} characters left to type and ${numOfDeletes} left to delete.`)
}