 //===================================Global Variables===================================
 const body = document.querySelector('body');
 //Handlebars sets this data attribute to the user_id when one logs in.
 const user_id = body.dataset.user_id;

//Directs socket connection to server
const socket = io('http://localhost:3001') || io('https://narratorium.herokuapp.com');

//===================================Socket Functions===================================
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

//Call this function when a user makes a submission
function onSubmit(submissionText, position, story_id) {
    socket.emit('submission', submissionText, position, user_id, story_id, (response) => {
        if (response === true) {
           //Code to decrement character counter by submissionText.length 
        } else {
            console.log(response);
        }
    })
}

//Call this function when a user deletes a word
function onDelete(word_id) {
    socket.emit('deletion', word_id, user_id, (response) => {
        if (response === true) {
            //Code to decrement frontend delete counter by 1 
        } else {
            console.log(response);
        }
    })
}

//Call this function when the user navigates to a story
function viewStory(story_id) {
    socket.emit('viewStory', story_id)
}

//Call this function when the user renames a story
function renameStory(newName, story_id) {
    socket.emit('renameStory', newName, story_id, user_id, (response) => {
        //TODO Function for renaming the story title and any relevant HTML changes here
        console.log(response)
    })
}

//Call this function when the user adds a story
function addStory(storyName) {
    socket.emit('addStory', storyName, (response) => {
        //TODO Function for adding a new story, place any relevant HTML changes here
        console.log(response)
    })
}

//When this function is called (whenever someone navigates to the homepage), this function gets info from database and updates the limits for that user; 
async function onOpen () {
    //Ensures that if the user is not logged in, the code to update limits and fetch data is not run
    if (user_id === undefined) {
        return;
    }
    const response = await fetch (`/api/users/${user_id}`)
    const userData = await response.json()
    let currentDate = new Date(Date.now()).toISOString();
    let currentDay = currentDate[8] + currentDate[9] 
    if(`${userData.last_logged_in[8]}${userData.last_logged_in[9]}` < currentDay) {
        socket.emit('newDayDetection', (response)=>{
            let numOfCharacters = response [0];
            let numOfDeletes = response[1];
            updateLimits(numOfCharacters, numOfDeletes)
        })
    } else {
        let numOfCharacters = userData.character_limit;
        let numOfDeletes = userData.delete_limit; 
        console.log(`We have ${numOfCharacters} characters left to type and ${numOfDeletes} left to delete.`)
        updateLimits(numOfCharacters, numOfDeletes)
    }
}

//===================================Regular Functions===================================
function updateLimits (charactersRemaining, deletesRemaining) {
    //TODO Code to set counters on HTML goes here! 
    let characterCounter
    let deleteCounter
    characterCounter.textContent = charactersRemaining;
    deleteCounter.textContent = deletesRemaining;
}

//===================================On Page Load===================================
onOpen()