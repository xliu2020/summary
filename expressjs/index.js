
//import Express
const express = require("express");
const fs = require("fs");

let history = {
    submissions: []
};

//check if history.json file exists
if (fs.existsSync("history.json")) {

    let string = fs.readFileSync("history.json", "utf-8");
    history = JSON.parse(string);
    console.log("History file found and loaded!");

} else {

    let json = JSON.stringify(history);
    fs.writeFileSync("history.json", json, "utf-8");
    console.log("History file not found! Creating a new one.");

}

const bodyParser = require("body-parser");

const app = express();

const http = require("http").Server(app);

const port = 3000;

http.listen(port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

console.log("Express server is now running on " + port);

//Express routes
app.use("/", express.static("public_html/") );

app.post("/sayHello", (request, response) => {
    console.log("Someone said hello!");

    let winningNumber = Math.floor((Math.random() * 10) + 1);
    
    let dataFromFront = request.body;

    let inputNumber = parseInt(dataFromFront.number);

    let historyEntry = {
        number: inputNumber,
        winningNumber: winningNumber,
        timestamp: Date.now()
    };

    history.submissions.push(historyEntry);


    // Save the history object as a JSON file.
    fs.writeFileSync("history.json", JSON.stringify(history), "utf-8");

    let userWinner = false;
    let outOfRange = false;

    console.log(inputNumber, winningNumber);


    // Compare generated number and the number the user picked and see if they match.
    if (winningNumber === inputNumber) {

        userWinner = true;
    }

    // Check if the number is outside of the range of 1-10.
    if (inputNumber <= 0 || inputNumber >= 11) {

        outOfRange = true;
    }

    let responseObject = {
        results: userWinner,
        error: outOfRange
    };

    response.send(responseObject);
});

// Grabs the latest 10 entries from the history object and sends it to the front end.
app.post("/getPreviousEntries", (req, res) => {
    
    let slicedArray = history.submissions.slice(history.submissions.length - 10);
    console.log(slicedArray);

    let dataToSendBack = {
       latestEntries: slicedArray
    };

    res.send(dataToSendBack);

});