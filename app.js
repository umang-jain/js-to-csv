var express = require("express"),
    app=express(),
    bodyparser=require("body-parser"),
    methodoverride=require("method-override"),
    expresssanitizer= require("express-sanitizer");

var PORT = process.env.PORT || 3000;

const csv = require('csv-parser');
const fs = require('fs');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'out.csv',
    header: [
      {id: 'Name', title: 'Name'},
      {id: 'Surname', title: 'Surname'},
      {id: 'Age', title: 'Age'},
    ]
});
const seedData = [
  {
    Name: 'John',
    Surname: 'Snow',
    Age: 26
  }, {
    Name: 'Clair',
    Surname: 'White',
    Age: 33
  }, {
    Name: 'Fancy',
    Surname: 'Brown',
    Age: 78
  }
];
csvWriter
  .writeRecords(seedData)
  .then(()=> {
    console.log('Seed data written');
  });

app.use(expresssanitizer());
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(methodoverride("_method"));

// Routes

app.get("/",function(req,res){
  var readData=[];
  fs.createReadStream('out.csv')
    .pipe(csv())
    .on('data', (row) => {
      readData.push(row)
    })
    .on('end', () => {
      console.log('Loading homepage');
      readData = JSON.stringify(readData);
      readData = JSON.parse(readData);
      res.render('home',{readData:readData});
    });
});


app.get("/newblock",function(req,res){
   res.render("create");
});

app.post("/",function(req,res){
  req.body.data.Name=req.sanitize(req.body.data.Name);
  req.body.data.Surname=req.sanitize(req.body.data.Surname);
  var writeData = [];
  writeData.push(req.body.data)
  var readData=[];

  fs.createReadStream('out.csv')
    .pipe(csv())
    .on('data', (row) => {
      readData.push(row)
    })
    .on('end', () => {
      console.log(readData);
      readData.push(req.body.data)
      console.log(readData);
      console.log('Posting to csv');
      readData = JSON.stringify(readData);
      readData = JSON.parse(readData);
      console.log(`After PArsing ${readData}`);
      csvWriter
        .writeRecords(writeData)
        .then(()=> {
          console.log('Posting Completed');
          res.render('home',{readData:readData});
        });
    });

});

// Port

app.listen(PORT,function(req,res){
   console.log(`Starting Server on port ${PORT}`);
});
