const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config()

// console.log(process.env.mysql_user);
// console.log(process.env.mysql_pass);


const pool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'christopher1410',
    database: 'table_of_board'
}).promise()

async function getAllData() {
    const [result] = await pool.query("SELECT * FROM board")
    return result;
}
async function getAllDataofBoard(boardNUM) {
    const [result] = await pool.query('SELECT * FROM board WHERE board_number = ?', [boardNUM]);
    return result;
}
async function getAllLastData() {
    const result = [];
    const promises = [];

    for (let i = 1; i <= 5; i++) {
        promises.push(getLastData(i));
    }

    const data = await Promise.all(promises);
    for (let i = 0; i < data.length; i++) {
        const jsonData = JSON.stringify(data[i][0]);
        if (jsonData == undefined) {
            continue;
        }
        else {
            const jsonObject = JSON.parse(jsonData);
            result.push(jsonObject);
        }
    }

    return result;
}
async function getLastData(boardNUM) {
    const [result] = await pool.query(
        'SELECT board_number, lat, lng, time FROM board WHERE board_number = ? ORDER BY time DESC LIMIT 1',
        [boardNUM]
    );
    return result;
}
async function getData(boardNUM) {
    const [result] = await pool.query('SELECT * FROM board WHERE board_number = ?', [boardNUM])
    return result
}
async function createData(boardNUM, lat, lng) {
    await pool.query('INSERT INTO board (board_number, lat, lng) VALUES (?, ?, ?)', [boardNUM, lat, lng])
    const [result] = await getData(boardNUM);
    return result;
}

async function changeData(boardNUM, lat, lng) {
    const [result] = await getData(boardNUM);
    await pool.query('UPDATE board SET lat=?, lng=? WHERE board_number=?', [lat, lng, boardNUM]);
    const [updatedResult] = await getData(boardNUM);
    // console.log(updatedResult);
    return updatedResult;
}

// async function getLastData(boardNUM) {
//     const [result] = await pool.query(
//         'SELECT board_number, lat, lng, time FROM board WHERE board_number = ? ORDER BY time DESC LIMIT 1',
//         [boardNUM]
//     );
//     return result;
// }
async function usage(number) {
    const data = await getAllDataofBoard(number);
    console.log(data);
    // for (let i = 0; i < 5; i++) {
    //     const index = data[i];
    //     console.log(index.lat);
    //     console.log(index.lng);
    //     console.log(index.board_number);
    // }
}
module.exports = { getAllData, getData, createData, changeData, getLastData, getAllLastData, getAllDataofBoard };
// usage(5);
// const data = await createData('board13', -7.257472, 112.752090)
// console.log(data)