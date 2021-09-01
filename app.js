const express = require("express");
const app = express();
const fs = require('fs');
const { getSystemErrorMap } = require("util");
const ytdl = require('ytdl-core');
const request = require('request');

app.listen(4000,console.log("working .....! "))

app.get("/video",async(req,res)=>{ 
    // var link = "https://www.youtube.com/watch?v=PDB2-17f_kc"
    var link = "https://www.youtube.com/watch?v=QdaEnEl26pM"
    let info = await ytdl.getBasicInfo(link)
    fs.writeFileSync(__dirname+"/info.json", JSON.stringify(info['player_response']['videoDetails']))
    // res.json(info)
    var title = info['player_response']['videoDetails']['title']
    title = 'video.mp4'
    title = title.replace('|', '')
    console.log(title)
    ytdl(link).pipe(fs.createWriteStream(`${title}`))

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
    
    python.stdout.on('data', function (data) {
      console.log('Pipe data from python script ...');
      dataToSend = data.toString();
     });
     // in close event we are sure that stream from child process is closed
     python.on('close', (code) => {
     console.log(`child process close all stdio with code ${code}`);
     // send data to browser
     res.send(dataToSend)
     });
    res.end();
})