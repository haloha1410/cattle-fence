const express = require('express');
const app = express();
const path = require('path');
const { getAllData, getData, createData, changeData, getLastData, getAllLastData, getAllDataofBoard } = require('./database.js');

function getIntValueFromString(str) {
    const matches = str.match(/\d+/);
    return matches ? parseInt(matches[0], 10) : null;
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use((req, res, next) => {
//     // Log the incoming request method and URL
//     console.log(`Received ${req.method} request at ${req.url}`);
//     res.status(200).send('Hello! This is a response from the server.');
//     // Call the next middleware function
//     next();
// });

app.get("/send", async (req, res) => {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const lastSegment = req.url.substring(req.url.lastIndexOf('/board') + 1);
    const num = getIntValueFromString(lastSegment);

    if (req.query.data == "") {
        console.log("No data sent");
        res.send("No data sent");
    }
    else {
        const newdata = await createData(num, lat, lng);
        console.log(newdata);
        res.render('index', { lat: lat, lng: lng, board_number: num });
    }
})

app.get('/api/data', async (req, res) => {
    const data = await getAllLastData();
    // console.log(data);
    res.json(data);
});

app.get('/prev-path-of-board', async (req, res) => {
    res.render('index', { board_number: req.query.bn });
})

app.get('/previous-path', async (req, res) => { //http://localhost:3000/prev-path-of-board?bn=5
    const data = await getAllDataofBoard(req.query.bn);
    res.json(data);
})




app.listen(3000)