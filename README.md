# JavascriptGoogleDrive

A nodejs version of google drive. This application has multiple functions including: sharing files, uploading files, downloading files.

## Installation

You need to have node and npm.
First clone this repo.

```bash
git clone https://github.com/Stephen10121/JavascriptGoogleDrive.git
```

Then create a "users.json" file in the backend folder.
Also create a "storage" folder in the backend folder.
Go to the backend folder and install all the node dependencies.

```bash
npm install
```

### Note

I have updated the database, so when creating this project, create a users.db file.
Then go to the database2.js file and uncomment this comment:

```bash
createTable().then(data=>console.log(data));
```

Then run the file using:

```bash
node database2.js
```

After you run it and there are no errors, comment that line of code and thats it.

### End Note

After all the dependencies are installed, you can start the webserver using:

```bash
npm run dev
```
