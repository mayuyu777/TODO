const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const session = require("express-session");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = express();
const saltRounds = 10;
const bcrypt = require("bcrypt");
app.set("view engine", "ejs");
app.use(express.static("./public"));

const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "pastebin",
    multipleStatements: true
});

function generateUUID() {
    let generate = "";
    const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 32;
    for (var i = 0; i < length; i++) {
        generate += char.charAt(Math.floor(Math.random() * char.length));
    }
    checkExists(generate);
    return generate;
}

function checkExists(code) {
    connection.query("SELECT * FROM accounts WHERE uuid = '" + code + "'", (err, response) => {
        if (err) throw err;
        if (response.length > 0) {
            return code;
        } else {
            generateUUID();
        }
    })
}

app.use(session({
    secret: "Ch43y0Vn6Num84W4N",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', urlencodedParser, (req, res) => {
    let user = req.body;
    let salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(user.password, salt);

    var query = "INSERT INTO accounts(uuid, username, password, created) VALUES ('" + generateUUID() + "', '" + user.username + "', '" + hash + "', NOW())";
    connection.query(query, (err) => {
        if (err) throw err;
        console.log("User created");
        res.redirect('/');
    });
});

app.post('/login', urlencodedParser, (req, res) => {
    let user = req.body;
    connection.query("SELECT * FROM accounts WHERE username = '" + user.username + "'", (err, result) => {
        if (result.length > 0) {
            if (bcrypt.compareSync(user.password, result[0]['password'])) {
                req.session.user_id = result[0]['id'];
                req.session.user = result[0]['username'];
                req.session.user_uuid = result[0]['uuid'];
                console.log(req.session);
                res.redirect('/notes');
            } else {
                console.log("Wrong account credentials");
                res.redirect('/');
            }
        }
    });
});

app.get('/notes', (req, res) => {
    let session = req.session;
    if (session.user) {
        connection.query("SELECT * FROM textfiles WHERE account_uuid ='" + session.user_uuid + "'AND status = 'OPEN';", (err, result) => {
            res.render('notes', { data: result, user: session.user });
        })
    }
});

app.get('/notescontent', (req, res) => {
    let session = req.session;
    connection.query("SELECT * FROM textfiles WHERE uuid = '" + req.query.uuid + "'", (err, result) =>{
        if(result[0]['account_uuid'] == session.user_uuid){
            connection.query("SELECT * FROM textfiles WHERE uuid = '" + req.query.uuid + "'; SELECT * FROM votes WHERE textfile_uuid = '" + req.query.uuid + "' AND vote_type = 'upvote'; SELECT * FROM votes WHERE textfile_uuid = '" + req.query.uuid + "' AND vote_type = 'downvote'", (err, result) => {
                res.render('notescontent', { data: result[0], upvotes: result[1].length, downvotes : result[2].length, user: session.user, user_uuid: session.user_uuid });
            });
        } else {
            res.send("Note unavailable");
        }
    });
    
    
});

app.get('/archivednotes', (req, res) =>{
    let session = req.session;
    if (session.user) {
        connection.query("SELECT * FROM textfiles WHERE account_uuid ='" + session.user_uuid + "'AND status = 'ARCHIVED'", (err, result) => {
            res.render('archivednotes', { data: result, user: session.user });
        })
    }
});

app.get('/noteslist', (req, res)=>{
    res.redirect('/notes')
});

app.post('/addnotes', urlencodedParser, (req, res) => {
    let note = req.body;
    let session = req.session;
    var query = "INSERT INTO textfiles(uuid, account_uuid, title, content, status, created) VALUES ('" + generateUUID() + "', '" + session.user_uuid + "', '" + note.title + "', '" + note.content + "', 'OPEN', NOW())";
    connection.query(query, (err, result) => {
        if (err) throw err;
        res.redirect('/notes');
    });
});

app.post('/update', urlencodedParser, (req, res) => {
    if(req.session.user){
        req.session.note_uuid = req.query.uuid;
        connection.query("SELECT * FROM textfiles WHERE uuid = '" + req.session.note_uuid + "'", (err, result)=>{
            res.render('updatenotes', {data: result, note_uuid: req.session.note_uuid, user: req.session.user, user_uuid: req.session.user_uuid});
        });
    }
});

app.post('/updatenote', urlencodedParser, (req, res)=>{
    let note = req.body;
    var query = "UPDATE textfiles SET title = '" + note.title + "', content = '" + note.content + "', updated = NOW() WHERE uuid = '" + note.uuid + "'";
    connection.query(query, (err)=>{
        if(err) throw err;
        res.redirect('/notescontent?uuid='+ note.uuid);
    });
});

app.post('/upvote', urlencodedParser, (req, res)=>{
    connection.query("SELECT * FROM votes WHERE account_id =" + req.session.user_id + " AND textfile_uuid = '" + req.query.uuid + "'", (err, result) =>{
        result = JSON.parse(JSON.stringify(result));
        if(result.length > 0 && result[0]['vote_type'] == 'downvote'){
            connection.query("UPDATE votes SET vote_type = 'upvote' WHERE account_id =" + req.session.user_id + " AND textfile_uuid = '" + req.query.uuid + "'", (err)=>{
                if(err) throw err;
            })
        } else if(result.length == 0){
            connection.query("INSERT INTO votes (account_id, textfile_uuid, vote_type) VALUES (" + req.session.user_id + ", '" + req.query.uuid + "', 'upvote')", (err)=>{
                if(err) throw err;
            })
        }
        res.redirect('/notescontent?uuid=' + req.query.uuid);
    })
});

app.post('/downvote', urlencodedParser, (req, res)=>{
    connection.query("SELECT * FROM votes WHERE account_id =" + req.session.user_id + " AND textfile_uuid = '" + req.query.uuid + "'", (err, result) =>{
        result = JSON.parse(JSON.stringify(result));
        if(result.length > 0 && result[0]['vote_type'] == 'upvote'){
            connection.query("UPDATE votes SET vote_type = 'downvote' WHERE account_id =" + req.session.user_id + " AND textfile_uuid = '" + req.query.uuid + "'", (err)=>{
                if(err) throw err;
            })
        } else if(result.length == 0){
            connection.query("INSERT INTO votes (account_id, textfile_uuid, vote_type) VALUES (" + req.session.user_id + ", '" + req.query.uuid + "', 'downvote')", (err)=>{
                if(err) throw err;
            })
        }
        res.redirect('/notescontent?uuid='+req.query.uuid);
    })
});

app.post('/pin', urlencodedParser, (req, res) =>{
    var query;
    if(req.body.pin == 1){
        query = "UPDATE textfiles SET isPinned = 0 WHERE uuid = '" + req.query.uuid + "'";
    } else {
        query = "UPDATE textfiles SET isPinned = 1 WHERE uuid = '" + req.query.uuid + "'";
    }
    connection.query(query, (err)=>{
        if(err) throw err;
        res.redirect('/notes');
    });
});

app.post('/archive', urlencodedParser, (req, res)=>{
    var query;
    if(req.body.status == "archived"){
        query = "UPDATE textfiles SET status = 'OPEN' WHERE uuid ='" + req.query.uuid + "'";
    } else {
        query = "UPDATE textfiles SET status = 'ARCHIVED' WHERE uuid ='" + req.query.uuid + "'";
    }
    connection.query(query, (err, result)=>{
        if(err) throw err;
        res.redirect('/notes');
    });
});

app.post('/delete', urlencodedParser, (req, res)=>{
    connection.query("UPDATE textfiles SET status = 'DELETED', deleted = NOW() WHERE uuid ='" + req.query.uuid + "'", (err, result)=>{
        if(err) throw err;
        res.redirect('/notes');
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie();
    res.redirect('/');
});

app.listen(3000);