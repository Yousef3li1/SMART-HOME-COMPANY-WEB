const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const fs = require('fs');
const { query } = require('express');
const app = express();

const port = 3306;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

app.listen(8888, () => {
  console.log('Server listening on port 8888');
});





const con = mysql.createConnection({
  host: 'cai.aast.edu',
  port: '3306',
  user: 'web_30',
  password: '7244',
  database: 'web_30'
});


app.post('/signup', (req, res) => {
  const { id, name , email , password , passwordc } = req.body;
  const strong = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  if (id == '' || name == '' || password == '' || email == '') {
    return res.end('fill all requirements');
  }
  if (password.length < 8 && !strong) {
    return res.end('password not meet requirements');
  }
  if (id.length < 8 || password.length < 8) {
    return res.end('id not meet requirements');
  }
  if (name.length < 8) {
    return res.end('Name not meet requirements');
  }

  const query = 'SELECT * FROM users WHERE email = ? OR id = ?';
  con.query(query, [email, id], (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.send('Email or id already in use');
      return;
    }

    if (password !== passwordc) {
      res.send('Password and Confirmation not match');
      return;
    }

    const token = jwt.sign({ id, name, email , password}, 'secret_key', {
      expiresIn: '10s'
    });

    const query = 'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)';
    con.query(query, [id, name, email, password], error => {
      res.cookie('token', token, {
        maxAge: 10000,
        expressOnly: true
      });
      res.redirect('/login.html');
    });
  });
});



app.post('/userlogin', (req, res) => {
  const { email, password } = req.body;

  if (email == '' || password == '') {
    return res.end('fill all requirements');
  }

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  con.query(query, [email, password], (error, results) => {
    if (results.length > 0) {
      const token = jwt.sign({ email: results.email, name: results.name }, 'secret_key', {
        expiresIn: '10s'
      });
      res.cookie('token', token, {
        maxAge: 10000,
        httpOnly: true
      });
      res.redirect('/afterlogin.html');

    } 
    if (results.length == 0) {
      res.send('Email or password is incorrect');
    }
  });
});


app.post('/signout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login.html');

});



app.post('/buy', (req, res) => {
     res.redirect('credit.html')
    });




app.post('/credit', (req, res) => {
  const { cardnumber, expirationdate, cvv, nameoncard, billingaddress, city, state, zipcode, country } = req.body;
  const query1 = `INSERT INTO credit_cards (cardnumber, expirationdate, cvv, nameoncard, billingaddress, city, state, zipcode, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  if (cardnumber == '' || expirationdate == '' || cvv == '' || nameoncard == ''||billingaddress == '' || city == '' || state == '' || zipcode == ''|| country == ''){
    res.send('Fill all requirments');
    return; 
  }
  if(cardnumber.length != 16){
    res.send("cardnumber is not meet requirement");
    return; 
  }
  if(cvv.length != 3){
    res.send("cvv is not meet requirement");
    return; 
  }
  if(expirationdate.length != 5){
    res.send("expirationdate is not meet requirement");
    return; 
    }
  if(zipcode < 5){
    res.send("zipcode is not meet requirement");
    return; 
  }

  con.query(query1, [cardnumber, expirationdate, cvv, nameoncard, billingaddress, city, state, zipcode, country], (error, results) => {
    if (error) {  
      console.error(error);
      res.send('Error saving credit card information');
      return;
    }
    
  });
  res.send('Credit card information saved successfully');
  res.redirect('afterlogen')
});

app.post('/contact', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  const query = 'INSERT INTO contact (name, email, message) VALUES (?, ?, ?)';
  con.query(query, [name, email, message], function(error , results) {
  });
  res.redirect('Home.HTML')
});






 







 



