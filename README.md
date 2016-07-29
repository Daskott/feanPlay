# feanPlay
feanPlay is a simple twitter-like application that uses Firebase, Express, Angular and Node.
You can see the live demo here: http://ec2-54-186-115-41.us-west-2.compute.amazonaws.com/#/

## Prerequisite Technologies
### Linux
* *Node.js* - <a href="http://nodejs.org/download/">Download</a> and Install Node.js, nodeschool has free <a href=" http://nodeschool.io/#workshoppers">node tutorials</a> to get you started. Recommend node version is node-4.x to run feanPlay.

If you're using ubuntu, this is the preferred repository to use...

```bash
$ curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
$ sudo apt-get update
$ sudo apt-get install nodejs
```

* *Git* - Get git using a package manager or <a href="http://git-scm.com/downloads">download</a> it.

### Windows
* *Node.js* - <a href="http://nodejs.org/download/">Download</a> and Install Node.js, nodeschool has free <a href=" http://nodeschool.io/#workshoppers">node tutorials</a> to get you started.
* *Git* - The easiest way to install git and then run the rest of the commands through the *git bash* application (via command prompt) is by downloading and installing <a href="http://git-scm.com/download/win">Git for Windows</a>

### OSX
* *Node.js* -  <a href="http://nodejs.org/download/">Download</a> and Install Node.js or use the packages within brew or macports.
* *git* - Get git <a href="http://git-scm.com/download/mac">from here</a>.

## Prerequisite packages

* feanPlay currently uses gulp as a build tool.
```
$ npm install -g gulp
```

Create ng/firebase.js and add your firebase credentials:
```javascript
var config = {
      apiKey: "apiKey",
      authDomain: "projectId.firebaseapp.com",
      databaseURL: "https://databaseName.firebaseio.com",
      storageBucket: "bucket.appspot.com",
    };
    firebase.initializeApp(config);
```

* In the ./feanPlay dir from terminal run:
```
$ npm install
```

## Start web server

* To start your web server, from terminal run:
```
$ gulp
```
* Access the web app on your localhost:
```
http://localhost:8080/
```
