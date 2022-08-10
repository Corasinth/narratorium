# NARRATORIUM 

## Description 
Narratorium is a collabrative story-telling website designed to allow anyone on the site to contribute to a single story. User contributions are limited by day, but otherwise the content of the story is determined entirely by the consensus of all users, even if that consensus is a chaotic string of words competing for space and existence. 

The site is build on a websocket connection using Socket.io and is capable of updating in real time as users make changes. Upon making a change to the story, the server database and the client-side for every other user is updated.

The site can be accessed [here](https://narratorium.herokuapp.com/).
* Username - guest@tryme.com
* Password - literati

# 
# [![A video thumbnail shows the homepage of the NARRATORIUM application with a play button overlaying the view.](./public/images/demo_video.png)](https://user-images.githubusercontent.com/102924713/183820514-704c1e23-6693-48f4-ab18-77de0a7ed6d3.mp4)

## Table of Contents

* [Usage](#usage)
* [Features](#features)
* [Contribution](#contributing)
* [Credits](#credits)
* [Installation](#installation)
* [License](#license)
***
## Usage 

To use the site visit the live link above. Anyone can view the story, but making changes requires signing up. Once logged in, double click a word to insert text after that word, or to delete the selected word. 

Character and delete limits reset every day; if you believe the limits should have reset try refreshing the page. The reset is independant of time zones.

***
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
***
## Contributing

To contribute, send in a pull request! 
***
## Credits
***
## Installation
Browser:
* Runs in the browser
* Deployed Link: [https://narratorium.herokuapp.com/](https://narratorium.herokuapp.com/)

Clone:

Download and install [Node.js](https://nodejs.org/en/download/)
Clone the repository
```bash
git@github.com:Corasinth/narratorium.git
```
Run npm install to install the npm dependencies from the [package.json](./package.json)
```bash
npm install
```
Create the development database
* Go to the directory of schema.sql

* Open a MySQL shell and enter this command
```
source schema.sql
```
Seed the database with test data (optional)

* Open a terminal and enter this command 
```
npm run seed
```
Invoke the application to start the server
* In the terminal enter this command
```
npm run watch
```
***
## [License](./LICENSE)
This website uses the open-source MIT License.
***
## Badges
![badmath](https://img.shields.io/github/languages/top/nielsenjared/badmath)
--- 
