var express = require("express"),
    app=express(),
    bodyparser=require("body-parser"),
    methodoverride=require("method-override"),
    ejs = require('ejs'),
    expresssanitizer= require("express-sanitizer");

    function convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

// PORT
var PORT = process.env.PORT || 3000;

// Write and read csv

const csv = require('csv-parser');
const fs = require('fs');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'out.csv',
    header: [
      {id: 'title', title: 'title'},
      {id: 'subtitle', title: 'subtitle'},
      {id: 'image', title: 'image'},
      {id: 'url', title: 'url'},
      {id: 'id', title: 'id'},
      {id: 'price', title: 'price'},
      {id: 'holidayTag', title: 'holidayTag'},
      {id: 'holidayType', title: 'holidayType'},
      {id: 'locationTag', title: 'locationTag'},
    ]
});
const seedData = [
  {
          "title": "Bentota Getaway",
          "subtitle": "Book 3 Nights 4 Days at Bentota at price 77 BHD(Price per person)",
          "image": "https://goholidays.gosaibitravel.com/holidays_uploads/images/holiday_1/thumbnail/big_club-bentota.jpg",
          "url": "https://goholidays.gosaibitravel.com/tours/bentota-getaway/1",
          "id": "1",
          "price": "77 BHD",
          "holidayTag": " Corporate",
          "holidayType": "Romantic",
          "locationTag": " Bentota "
      },
      {
          "title": "Serene Switzerland ",
          "subtitle": "Book 6 Nights 7 Days at Lungern at price 454 BHD(Price per person)",
          "image": "https://goholidays.gosaibitravel.com/holidays_uploads/images/holiday_88/thumbnail/16871_1_jungfraujoch.jpg",
          "url": "https://goholidays.gosaibitravel.com/tours/serene-switzerland-/88",
          "id": "88",
          "price": "454 BHD",
          "holidayTag": " NRI Specials",
          "holidayType": "Adventure",
          "locationTag": " Lungern "
      },
      {
          "title": "Austrian Alpine Glory",
          "subtitle": "Book 7 Nights 8 Days at Innsbruck at price 367 BHD(Price per person)",
          "image": "https://goholidays.gosaibitravel.com/holidays_uploads/images/holiday_32/thumbnail/Zell%20am%20see.jpg",
          "url": "https://goholidays.gosaibitravel.com/tours/austrian-alpine-glory/32",
          "id": "32",
          "price": "367 BHD",
          "holidayTag": " Signature Holidays",
          "holidayType": "xyz",
          "locationTag": " Innsbruck "
      },
      {
          "title": "Sharm El Sheikh Getaway",
          "subtitle": "Book 3 Nights 4 Days at Sharm El Sheikh at price 60 BHD(Price per person)",
          "image": "https://goholidays.gosaibitravel.com/holidays_uploads/images/holiday_10/thumbnail/Sharm%20el%20Sheikh.jpg",
          "url": "https://goholidays.gosaibitravel.com/tours/sharm-el-sheikh-getaway/10",
          "id": "10",
          "price": "60 BHD",
          "holidayTag": " Corporate",
          "holidayType": "Nature",
          "locationTag": " Sharm El Sheikh "
      },
      {
          "title": "Canadian East Coast",
          "subtitle": "Book 7 Nights 8 Days at Niagara Falls at price 522 BHD(Price per person)",
          "image": "https://goholidays.gosaibitravel.com/holidays_uploads/images/holiday_33/thumbnail/canada%201.jpg",
          "url": "https://goholidays.gosaibitravel.com/tours/canadian-east-coast/33",
          "id": "33",
          "price": "522 BHD",
          "holidayTag": " Self Drive",
          "holidayType": "Beaches",
          "locationTag": " Niagara Falls "
      },
      {
          "title": "Around The Rockies",
          "subtitle": "Book 6 Nights 7 Days at Calgary at price 583 BHD(Price per person)",
          "image": "https://goholidays.gosaibitravel.com/holidays_uploads/images/holiday_34/thumbnail/can3.jpg",
          "url": "https://goholidays.gosaibitravel.com/tours/around-the-rockies/34",
          "id": "34",
          "price": "583 BHD",
          "holidayTag": " Self Drive",
          "holidayType": "Adventure",
          "locationTag": " Calgary "
      },
      {
          "title": "Bosnia Experience",
          "subtitle": "Book 6 Nights 7 Days at Sarajevo at price 265 BHD(Price per person)",
          "image": "https://goholidays.gosaibitravel.com/holidays_uploads/images/holiday_42/thumbnail/sarjevo1.jpg",
          "url": "https://goholidays.gosaibitravel.com/tours/bosnia-experience/42",
          "id": "42",
          "price": "265 BHD",
          "holidayTag": " Signature Holidays",
          "holidayType": "Wildlife",
          "locationTag": " Sarajevo "
      },
      {
          "title": "Best Of Bali",
          "subtitle": "Book 9 Nights 10 Days at Kuta at price 585 BHD(Price per person)",
          "image": "https://goholidays.gosaibitravel.com/holidays_uploads/images/holiday_44/thumbnail/bali1.jpg",
          "url": "https://goholidays.gosaibitravel.com/tours/best-of-bali/44",
          "id": "44",
          "price": "585 BHD",
          "holidayTag": " Signature Holidays",
          "holidayType": "Nature",
          "locationTag": " Kuta "
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
      var csv = convertArrayOfObjectsToCSV({
            data: readData
        });
      res.render('home',{readData:readData,csv:csv});
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
      readData.push(req.body.data)
      console.log('Posting to csv');
      readData = JSON.stringify(readData);
      readData = JSON.parse(readData);
      var csv = convertArrayOfObjectsToCSV({
            data: readData
        });
      csvWriter
        .writeRecords(writeData)
        .then(()=> {
          console.log('Posting Completed');
          res.render('home',{readData:readData,csv:csv});
        });
    });

});

// Port

app.listen(PORT,function(req,res){
   console.log(`Starting Server on port ${PORT}`);
});
