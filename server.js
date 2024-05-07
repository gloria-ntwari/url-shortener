
const express = require('express');
const mysql=require('mysql');
const app = express();
const shortId = require('shortid');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'shortUrl'
  });

app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    connection.query('SELECT * FROM urlShortener ',(err,result)=>{
        if(err){
         console.log("There is the error",err.message);
      res.status(500).send("Internal error server");
        }
        res.render('index',{shortUrls:result});
    })

})


app.post('/shortUrls', (req, res) => {
    const { fullUrl } = req.body;
    const shortUrl = shortId.generate(); // Implement your logic to generate short URLs
  
    connection.query('INSERT INTO urlShortener (fullUrl, shortUrl) VALUES (?, ?)', [fullUrl, shortUrl], (err, result) => {
      if (err) {
        console.error('Error creating shortUrl:', err.message);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.redirect('/');
    });
  });


    app.get('/shorturls/:id', (req, res) => {
        const { id } = req.params;
        connection.query('SELECT * FROM urlShortener WHERE id = ?', [id], (err, results) => {
          if (err) {
            console.error('Error fetching shortUrls by userId:', err.message);
            res.status(500).send('Internal Server Error');
            return;
          }
          res.status(200).json(results);
        });
      });



app.listen(3000,()=>{
    console.log("Server running on port 3000..");
});
