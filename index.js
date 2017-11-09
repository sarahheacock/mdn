const express = require('express');
const fs = require('fs');
// const request = require('request');
// const cheerio = require('cheerio');
// const bodyParser = require('body-parser');

const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.text());
// app.use(bodyParser.json({ type: 'application/json'}));


// Add headers
app.use((req, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Methods", "GET");
  response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

//===============ROUTES====================================
//===============create tree===============================
// app.get('/scrape', (req, res, next) => {
//   let result = {
//     tree: {},
//     map: {}
//   };
//   //let urls = [];
//
//   const scrape = (url) => {
//     request(url, (error, response, html) => {
//       if(!error){
//         const $ = cheerio.load(html);
//
//         const div = $('body').find('div.quick-links').find('a');
//         div.each(function(){
//           const href = $(this).attr('href');
//           const name = $(this).text();
//
//           if(href.includes('Global_Objects') && ((name >= 'Array' && name <= 'RegExp') || (name >= 'Set' && name <= 'WeakSet'))){
//             const info = $(this).attr('title');
//
//             result['map'][name] = {
//               href: "https://developer.mozilla.org" + href,
//               info: info
//             }
//             //urls.push(href);
//           }
//         });
//       }
//     });
//   }
//
//   scrape("https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects", []);
//
//   const myFunc = () => {
//     const done = result.map.hasOwnProperty('WeakSet');
//     if(!done){
//       setTimeout(myFunc, 1500);
//     }
//     else{ //DONE!
//       req.result = result;
//       //req.urls = urls;
//
//       // res.json(req.result);
//       next();
//     }
//   }
//   myFunc();
//
// }, (req, res, next) => {
//
//   const scrape = (url, n) => {
//     //console.log(url);
//     //console.log(url);
//     request(url, (error, response, html) => {
//       if(!error){
//         const $ = cheerio.load(html);
//         const div = $('body').find('div.quick-links').find('a');
//
//         div.each(function(){
//           const href = $(this).attr('href');
//           const name = $(this).find('code').text();
//           console.log(href, name);
//
//           if(href.includes('Global_Objects') && name.includes(n)){
//             console.log(href, name);
//             const info = $(this).attr('title');
//
//             req.result.map[name] = {
//               href: "https://developer.mozilla.org" + href,
//               info: info
//             }
//           }
//         });
//
//       }
//     });
//   }
//
//   Object.keys(req.result.map).forEach((key) => {
//     scrape(req.result['map'][key]["href"], key);
//   });
//
//   const myFunc = () => {
//     const done = req.result.map.hasOwnProperty('WeakSet.prototype.has()');
//     //console.log(req.result.map)
//
//     if(!done){
//       setTimeout(myFunc, 1500);
//     }
//     else { //DONE!
//       //res.json(req.result);
//       // req.result = req.result.concat(more);
//       // console.log(req.result);
//       next();
//     }
//   }
//   myFunc();
//
// }, (req, res, next) => {
//   //let root = {};
//
//   (Object.keys(req.result.map)).forEach((name) => {
//     const create = (word) => {
//       let letters = word.split('');
//       let current = req.result.tree;
//
//       letters.forEach((letter) => {
//         if(!current.hasOwnProperty(letter)){
//           current[letter] = {};
//         }
//
//         current = current[letter];
//
//         if(!current.hasOwnProperty('*')){
//           current["*"] = [name];
//         }
//         else {
//           if(!current["*"].includes(name)){
//             current["*"].push(name);
//           }
//         }
//       });
//     }
//
//     const words = name.split('').map((letter, i) => {
//         return name.toLowerCase().slice(i);
//     });
//
//     words.forEach((word) => {
//       create(word);
//     });
//   });
//
//   // res.json(req.result);
//   fs.writeFile('output.json', JSON.stringify(req.result), (err) => {
//     console.log('File successfully written! - Check your project directory for the output.json file');
//     res.json({done: true});
//   });
// });

// =================retrieve=========================================
// app.get('/word', (req, res, next) => {
//   fs.readFile('output.json', (err, data) => {
//     res.json(JSON.parse(data));
//   });
// });

app.get('/:word', (req, res, next) => {
  fs.readFile('output.json', (err, d) => {
    if(err){
      next(err);
    }
    let data = JSON.parse(d);
    let current = data.tree;
    let arr = req.params.word.replace("%20", " ").split('');

    arr.forEach((a) => {
      if(!current.hasOwnProperty(a)){
        current = {}
      }
      else {
        current = current[a];
      }
    });

    if(current.hasOwnProperty("*")){
      let result = current["*"].map((name) => {
        return Object.assign(data["map"][name], {name: name});
      });
      res.json(result);
    }
    else {
      res.json([]);
    }

    //result = current["*"].slice(0, 3);

    // let keys = Object.keys(current);
    //
    // while(result.length < 5 && keys.length > 0){
    //   if(keys.includes("*")){
    //     result = result.concat(current["*"].slice(0, 3));
    //     if(keys.length > 1){
    //       current = current[keys[1]];
    //     }
    //     else {
    //       break;
    //     }
    //   }
    //   else {
    //     current = current[keys[0]];
    //   }
    //
    //   keys = Object.keys(current);
    // }
    // res.json(result);
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
