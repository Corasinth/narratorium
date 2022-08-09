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

const quillContainer = document.getElementById('quillContainer')
//===================================Socket Functions===================================
socket.on('connect', () => {
    console.log(`Connected with socket id ${socket.id}`)
})

socket.on('displayStory', (data) => {
    let render = []
    for (let i = 0; i < data.submissions.length; i++) {
        let createSubmit = `<span id=${data.submissions[i].position} class="edit">${data.submissions[i].submission} </span>`
        render.push(createSubmit)
    }

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
        if (response.status[0] === true) {
            setCharLimit(response[1])
        } else if (response.status[0] === false) {
            alert("You've run out of characters to type! Please try again tomorrow.")
        } else {
            console.log(response);
        }
    })
}

//Call this function when a user deletes a word
function onDelete(position, story_id) {
    //deletes html element with id of position
    socket.emit('deletion', position, user_id, story_id, (response) => {
        if (response.status[0] === true) {
            setDeleteLimit(response.status[1]);
        } else if (response.status[0] === false) {
            alert("You've run out of deletes! Please try again tomorrow");
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
        if (response.status === true) {
            setCharLimit(0);
            setDelLimit(0);
        } else if (response.status === 'fail') {
            alert("Sorry, you need 100 characters and 10 deletes unused to rename a story. Please try again tomorrow.")
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
        socket.emit('newDayDetection', currentDate, (response) => {
            let numOfCharacters = response[0];
            let numOfDeletes = response[1];
            setCharLimit(numOfCharacters);
            setDelLimit(numOfDeletes);
        })
    } else {
        let numOfCharacters = userData.character_limit;
        let numOfDeletes = userData.delete_limit;
        console.log(`We have ${numOfCharacters} characters left to type and ${numOfDeletes} left to delete.`)
        setCharLimit(numOfCharacters);
        setDelLimit(numOfDeletes);
    }
}

//===================================Regular Functions===================================
function setCharLimit(charactersRemaining) {
    //TODO Code to set counters on HTML goes here! 
    // let characterCounter
    // characterCounter.textContent = charactersRemaining;
}

function setDelLimit(deletesRemaining) {
    //TODO Code to set counters on HTML goes here! 
    // let deleteCounter
    // characterCounter.textContent = deletesRemaining;
}

function renderStoryToHomepage(render) {
    document.getElementById('story').innerHTML = render.join(' ')
    editEventListener()
}

// Assigns a position to each word
function editSubmits(elementId = 1) {
    let editorDataAttribute = document.querySelector("#editor-container")
    editorDataAttribute.setAttribute("data-position", elementId)
}

document.getElementById('quillContainer').style.display = 'none';
document.getElementById('editBtns').style.display = 'none';
// creates an instance of Quill editor
function newQuill() {
    quill = new Quill('#editor-container', {
        theme: 'snow'
    });
}
newQuill()

// Transforms/submits user input into Quill editor for db submission and page rendering  
function createSubmits() {
    let submissions = '';
    if (!quill.getContents()) { console.log('no quill contents') }
    const contents = quill.getContents();
    submissions = contentFunc(contents)
    const position = document.getElementById('editor-container').getAttribute('data-position')

    onSubmit(submissions, position, 1)
};

// helper parses Quill editor content into a string
function contentFunc(object) {
    let objectStr = '';
    for (let i = 0; i < object.ops.length; i++) {
        objectStr += object.ops[i].insert
    };
    return objectStr
}

function loginToEdit() {
    if (!user_id) {
        console.log('You are not logged in!')
        document.getElementById('quillContainer').setAttribute('style', 'display:none;')
        quill.setText('Login or Get Started to narrate\n')
        document.getElementById('submit').disabled = true;
        document.getElementById('delete').disabled = true;
    } 
}

//===================================Event Listeners===================================

let editWord = 0;
// double click any word to edit
function editEventListener() {
    const edits = Array.from(document.getElementsByClassName('edit'))
    edits.forEach(edit => {
        edit.addEventListener('dblclick', function red(e) {
            e.stopImmediatePropagation
            loginToEdit()
            document.getElementById('quillContainer').setAttribute('style', 'display:block;')
            editWord = 0
            const elementId = e.target.id
            editWord += elementId
            editSubmits(elementId)
            document.getElementById('editBtns').style.display = 'block';
        })
    })
}

// submit quill content
const submitBtn = document.getElementById('submit')
submitBtn.addEventListener('click', function (e) {
    e.stopImmediatePropagation()
    document.getElementById('quillContainer').setAttribute('style', 'display:none;')
    document.getElementById('editBtns').style.display = 'none';
    createSubmits()
})

// delete button
const deleteBtn = document.getElementById('delete')
deleteBtn.addEventListener('click', () => {
    const elementId = editWord
    onDelete(elementId, 1)
})

// begins story 
const beginStory = document.getElementById('beginStory')
beginStory.addEventListener('click', () => {
    document.getElementById('quillContainer').setAttribute('style', 'display:block;')
    document.getElementById('editBtns').style.display = 'block';
})

//===================================On Page Load===================================
onOpen()
viewStory(1)

function adminDelete(story_id) {
    console.log('admin')
    for (let i =0; i<500; i++) {
        onDelete(i, story_id)
    }
}

