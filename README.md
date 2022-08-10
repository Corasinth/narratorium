# Narratorium

## Description 
Narratorium is a collabrative story-telling website designed to allow anyone on the site to contribute to a single story. User contributions are limited by day, but otherwise the content of the story is determined entirely by the consensus of all users, even if that consensus is a chaotic string of words competing for space and existence. 

The site is build on a websocket connection using Socket.io and is capable of updating in real time as users make changes. Upon making a change to the story, the server database and the client-side for every other user is updated.

The site can be accessed [here](https://narratorium.herokuapp.com/).

## Table of Contents


* [Usage](#usage)
* [Features](#features)
* [Contribution](#contribution)
* [Credits](#credits)
* [License](#license)


## Usage 

To use the site visit the live link above. Anyone can view the story, but making changes requires signing up. Once logged in, double click a word to insert text after that word, or to delete the selected word. 

Character and delete limits reset every day; if you believe the limits should have reset try refreshing the page. The reset is independant of time zones.

Below is a demonstration of the site's function and ability to dynamically update itself on changes by other users. 

## Features

character limits
delete limits
reset on new day
text box shows how many characters you're typing dynamically, but only makes changes to your limit once you submit
user id
rich text editor
dynamic story generation

in development
ability to add stories
ability to rename a story
ability to preserve formatting 

## Contributing

To contribute, send in a pull request! 

## Credits

## [License](./LICENSE)
This website uses the open-source MIT License.

--- 