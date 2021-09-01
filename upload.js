//  -----------------------Constant -------------------
const fs = require("fs");
const multer = require("multer");
const assert = require('assert');
const ytdl = require('ytdl-core');
const express = require("express");
const request = require('request');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
// const TOKEN_PATH = './credentials1.json';
// const TOKEN_PATH_ = 'credentials1.json';
// const OAuth2Data = require(TOKEN_PATH);
const { getSystemErrorMap } = require("util");
const uploadVideo = require('./download.js');
const app = express();

// const CLIENT_ID = OAuth2Data.web.client_id;
// const CLIENT_SECRET = OAuth2Data.web.client_secret;
// const REDIRECT_URL = OAuth2Data.web.redirect_uris[0];

// const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL );
//  --------------- Variable -------------------
// var title, description;
// var tags = [];

// var authed = false;
// var oauth2

// If modifying these scopes, delete token.json.
// const SCOPES = "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.profile";

app.set("view engine", "ejs");

var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./videos");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: Storage,
}).single("file"); //Field name and max count

// 1-Step Authentication -------------------------
  app.get("/", (req, res) => {
      res.render("success",{
              name: "Vishal",
              pic: "thumbnail.png",
              success: false,
            });
  });
// ------------------------------- 2-Step -------------------------------------------

app.post("/upload", (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.log(err);
      return res.end("Something went wrong");
    } else {        
        const videoFilePath = 'video.mp4'
        const thumbFilePath = 'thumbnail.png'
        const link = req.body.title
        console.log(link)
        var info = await ytdl.getBasicInfo(link)
        await ytdl(link).pipe(fs.createWriteStream(`${videoFilePath}`))

        var titles = info['player_response']['videoDetails']['title']
        var descriptions = info['player_response']['videoDetails']['shortDescription']
        var tagss = info['player_response']['videoDetails']['keywords']

        console.log(titles);
        console.log(descriptions);
        console.log(tagss);

        fs.writeFileSync(__dirname+"/info.json", JSON.stringify(info['player_response']['videoDetails']))

        const url = info['player_response']['videoDetails']['thumbnail']['thumbnails'][2]['url']
        const path = 'thumbnail.png'

        console.log(url)
        const download = (url, path, callback) => {
            request.head(url, (err, res, body) => {
              request(url).pipe(fs.createWriteStream(path)).on('close', callback)
            })
          }

        download(url, path, () => {
        console.log('✅ Done!')
        })
        // uploadVideo.uploadVideo(titles,descriptions,tagss);
        // sleep(1000)
        res.render("success",{
          name: "Vishal",
          pic: "thumbnail.png",
          success: false,
        });
    }
  });
});

// app.get("/logout", (req, res) => {
//   authed = false;
//   res.redirect("/");
// });

// app.get("/goolge/callback", function (req, res) {
//   const code = req.query.code;
//   if (code) {
//     // Get an access token based on our OAuth code
//     oAuth2Client.getToken(code, function (err, tokens) {
//       if (err) {
//         console.log("Error authenticating");
//         console.log(err);
//       } else {
//         console.log("Successfully authenticated");
//         console.log(tokens);
//         oAuth2Client.setCredentials(tokens);
//         authed = true;
//         res.redirect("/");
//       }
//     });
//   }
// });

app.listen(4000, () => {
  console.log("App is listening on Port 4000");
});