# JavascriptGoogleDrive

A nodejs version of google drive. This application has multiple functions including: sharing files, uploading files, downloading files.

## Installation

You need to have node and npm.
First clone this repo.

```bash
git clone https://github.com/Stephen10121/JavascriptGoogleDrive.git
```
Go to the backend folder and install all the node dependencies.

```bash
npm install
```

### Note

In the backend folder, create a .env file and add this:
```bash
ACCESS_TOKEN_SECRET="A 30 bit random key (dont add the paranthesis)"
```
Then uncomment this line:

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
