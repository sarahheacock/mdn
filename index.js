const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const app = express();

// Add headers
app.use((req, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

//===============ROUTES====================================

// app.get('/scrape', (req, res, next) => {
//   let result = [];
//
//   const scrape = (url) => {
//     request(url, (error, response, html) => {
//       if(!error){
//         const $ = cheerio.load(html);
//
//         const div = $('body').find('div.quick-links').find('a');
//         result = div.map(function(){
//           const href = $(this).attr('href');
//           const name = $(this).text();
//
//           if(href.includes('Global_Objects') && ((name >= 'Array' && name <= 'RegExp') || (name <= 'Set' && name >= 'WeakSet'))){
//             return {
//               href: "https://developer.mozilla.org" + href,
//               name: name
//             };
//           }
//         }).get();
//       }
//     });
//   }
//
//   scrape("https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects", []);
//
//   const myFunc = () => {
//     const done = result.length > 0;
//     if(!done){
//       setTimeout(myFunc, 1500);
//     }
//     else{ //DONE!
//       req.result = result;
//       console.log(req.result);
//       next();
//     }
//   }
//
//   myFunc();
//
// }, (req, res, next) => {
//   let more = [];
//
//   const scrape = (url, n) => {
//     //console.log(url);
//     request(url, (error, response, html) => {
//       if(!error){
//         const $ = cheerio.load(html);
//
//         const div = $('body').find('div.quick-links').find('a');
//
//         let result = div.map(function(){
//           const href = $(this).attr('href');
//           const name = $(this).find('code').text();
//           //console.log(href, name);
//
//           if(href.includes('Global_Objects') && name.includes(n)){
//             //console.log(href, name);
//             return {
//               href: "https://developer.mozilla.org" + href,
//               name: name
//             };
//           }
//         }).get();
//
//         more = more.concat(result);
//       }
//     });
//   }
//
//   req.result.forEach((r) => {
//     scrape(r.href, r.name);
//   });
//
//   const myFunc = () => {
//     const done = more.length >= 384;
//
//     if(!done){
//       setTimeout(myFunc, 1500);
//     }
//     else { //DONE!
//       req.result = req.result.concat(more);
//       console.log(req.result);
//       next();
//     }
//   }
//   myFunc();
//
// }, (req, res, next) => {
//   let root = {};
//
//   req.result.forEach((obj) => {
//     const create = (word) => {
//       let letters = word.split('');
//       let current = root;
//
//       letters.forEach((letter) => {
//         if(!current.hasOwnProperty(letter)){
//           current[letter] = {};
//         }
//         current = current[letter];
//       });
//
//       if(!current.hasOwnProperty("*")){
//         current["*"] = [obj];
//       }
//       else {
//         const valid = current["*"].reduce((a, b) => {
//           return a && obj.name !== b.name;
//         }, true);
//
//         if(valid){
//           current["*"].push(obj);
//         }
//       }
//     }
//
//     const words = obj.name.split('').map((letter, i) => {
//         return obj.name.toLowerCase().slice(i);
//     });
//
//     words.forEach((word) => {
//       create(word);
//     });
//   });
//   //res.json(root);
//   fs.writeFile('output.json', JSON.stringify(root), (err) => {
//     console.log('File successfully written! - Check your project directory for the output.json file');
//     res.json({done: true});
//   });
// });
app.get('/json', (req, res, next) => {
  fs.readFile('output.json', (err, data) => {
    res.json(JSON.parse(data));
  });
});

app.get('/:word', (req, res, next) => {
  fs.readFile('output.json', (err, d) => {
    if(err){
      next(err);
    }
    let data = JSON.parse(d);
    let current = data;
    let arr = req.params.word.split('');
    let result = [];

    arr.forEach((a) => {
      if(!current.hasOwnProperty(a)){
        current = {}
      }
      else {
        current = current[a];
      }
    });

    //result = current["*"].slice(0, 3);

    let keys = Object.keys(current);

    while(result.length < 5 && keys.length > 0){
      if(keys.includes("*")){
        result = result.concat(current["*"]);
        if(keys.length > 1){
          current = current[keys[1]];
        }
        else {
          break;
        }
      }
      else {
        current = current[keys[0]];
      }

      keys = Object.keys(current);
    }
    res.json(result);
  });
});

//==================ERROR HANDLER===========================
//==========================================================
//catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

//====================START SERVER============================
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`API running on localhost:${port}`));
