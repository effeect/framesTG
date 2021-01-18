//Thanks to Daniel Shiffman 
//Twit Node Package
var Twit = require('twit');
var config = require('./config.js')
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

//Establish connection
var T = new Twit(config);

const dir = path.join(__dirname,"allpics");

//Start once
tweeter();

//The interval will trigger every hour
setInterval(tweeter,  1000 * 60 * 60);

function tweeter() {
    //Thanks to https://gist.github.com/rliebig/2363107#file-image-rotator-js
    let fileChoice = Math.floor(Math.random() * 19520);
    let formattedString = `pic (${fileChoice}).jpg`
    let time = new Date();
    //Note : the encoding is REQUIRED
    let picture = fs.readFileSync(path.join(dir,formattedString), { encoding: 'base64' })

    T.post('media/upload',{ media : picture },function(error,data,response){
        var mediaIdStr = data.media_id_string;
        var params = {status: "", media_ids: [mediaIdStr]}
        T.post("statuses/update",params,tweeted);
    });


    function tweeted(err, data, response){
        if (err) { console.log(err); } 
        else { console.log(`A tweet has been posted at ${time.GetHours()} | Link :${data.text}`); }
    }
}