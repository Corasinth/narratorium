//===================================Global Variables===================================
const body = document.querySelector('body');
//Handlebars sets this data attribute to the user_id when one logs in.
const user_id = body.dataset.user_id;

//Directs socket connection to server
let url
if (window.location.hostname === 'localhost') {
    url = 'http://localhost:3001'
} else {
    url = 'https://narratorium.herokuapp.com' 
}

const socket = io(url) 
let quill;
//===================================Socket Functions===================================
socket.on('connect', () => {
    console.log(`Connected with socket id ${socket.id}`)
})

socket.on('displayStory', (data) => {
    let render = []
    for (let i = 0; i < data.submissions.length; i++) {
        let createSubmit = `<span id=${data.submissions[i].position} class="edit">${data.submissions[i].submission} </span>`
        console.log(createSubmit)
        render.push(createSubmit)
    }
    console.log(render)

    data.submissions.length == 0
        ? beginStory.setAttribute('style', 'display: block')
        : beginStory.setAttribute('style', 'display: none')

    renderStoryToHomepage(render)
})

//test function
socket.on("test", (data) => {
    console.table(data)
})

//Call this function when a user makes a submission
function onSubmit(submissionText, position, story_id) {
    socket.emit('submission', submissionText, position, user_id, story_id, (response) => {
        if (response === true) {
            updateLimits(submissionText.length, 0)
        } else {
            console.log(response);
        }
    })
}

//Call this function when a user deletes a word
function onDelete(position, story_id) {
    //deletes html element with id of position
    socket.emit('deletion', position, user_id, story_id, (response) => {
        if (response === true) {
            updateLimits(0, 1)
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
        if (response === true) {
            setLimits(0, 0)
            console.log(response)
        } else {
            console.log(response)
        }
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
async function onOpen() {
    //Ensures that if the user is not logged in, the code to update limits and fetch data is not run
    if (user_id === '') {
        return;
    }
    const response = await fetch(`/api/users/${user_id}`)
    const userData = await response.json()
    let currentDate = new Date(Date.now()).toISOString();
    let currentDay = currentDate[8] + currentDate[9]
    if (userData.last_logged_in === null || `${userData.last_logged_in[8]}${userData.last_logged_in[9]}` < currentDay) {
        // socket.emit('newDayDetection', currentDate, (response) => {
        //     let numOfCharacters = response[0];
        //     let numOfDeletes = response[1];
        //     setLimits(numOfCharacters, numOfDeletes)
        // })
    } else {
        let numOfCharacters = userData.character_limit;
        let numOfDeletes = userData.delete_limit;
        console.log(`We have ${numOfCharacters} characters left to type and ${numOfDeletes} left to delete.`)
        setLimits(numOfCharacters, numOfDeletes)
    }
}

//===================================Regular Functions===================================
function setLimits(charactersRemaining, deletesRemaining) {
    //TODO Code to set counters on HTML goes here! 
    // let characterCounter
    // let deleteCounter
    // characterCounter.textContent = charactersRemaining;
    // deleteCounter.textContent = deletesRemaining;
}

function updateLimits(amountToDecrementChar = 0, amountToDecrementDel = 0) {
    //TODO Code to set counters on HTML goes here! 
    // let characterCounter
    // let deleteCounter
    // characterCounter.textContent -= amountToDecrementChar;
    // deleteCounter.textContent -= amountToDecrementDel;
}

function renderStoryToHomepage(render) {
    document.getElementById('story').innerHTML = render.join(' ')
    editEventListener()
}

function editSubmits(elementId = 1) {
    console.log('edit submits')
    let editorDataAttribute = document.querySelector("#editor-container")
    editorDataAttribute.setAttribute("data-position", elementId)
}

document.getElementById('quillContainer').setAttribute('style', 'display:none;')

function newQuill() {
    quill = new Quill('#editor-container', {
        theme: 'snow'
    });
}
newQuill()

// Click submit button: grabs Quill content and transforms it into a string, saves content as individual words in the DB (local storage)
function createSubmits() {
    let submissions = '';
    if (!quill.getContents()) { console.log('no quill contents') }
    const contents = quill.getContents();
    submissions = contentFunc(contents)
    console.log(submissions)
    const position = document.getElementById('editor-container').getAttribute('data-position')
    console.log(contents)
    onSubmit(submissions, position, 1)
};

function contentFunc(object) {
    let objectStr = '';
    for (let i = 0; i < object.ops.length; i++) {
        objectStr += object.ops[i].insert
    };
    return objectStr
}

//===================================Event Listeners===================================

let editWord = 0;
function editEventListener() {
    const edits = Array.from(document.getElementsByClassName('edit'))
    edits.forEach(edit => {
        edit.addEventListener('dblclick', function red(e) {
            document.getElementById('quillContainer').setAttribute('style', 'display:block;')
            editWord = 0
            const elementId = e.target.id
            editWord += elementId
            editSubmits(elementId)
        })
    })
}

const submitBtn = document.getElementById('submit')
submitBtn.addEventListener('click', function (e) {
    e.stopImmediatePropagation()
    document.getElementById('quillContainer').setAttribute('style', 'display:none;')
    createSubmits()
})

// delete button
const deleteBtn = document.getElementById('delete')
deleteBtn.addEventListener('click', () => {
    const elementId = editWord
    onDelete(elementId, 1)
})

const beginStory = document.getElementById('beginStory')
beginStory.addEventListener('click', () => {
     document.getElementById('quillContainer').setAttribute('style', 'display:block;')
     })

//===================================On Page Load===================================
onOpen()
viewStory(1)

