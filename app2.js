require('dotenv').config()

var sdk = require("matrix-js-sdk");
var clc = require("cli-color");
const urlRegex = require('url-regex');
const { isNullOrUndefined } = require("matrix-js-sdk/lib/utils");

var myUserId = process.env.MATRIX_USERID
var myAccessToken = process.env.MATRIX_ACCESSTOKEN
var linkPreviewApiKey = process.env.LINKVIEW_APIKEY
var baseURL = process.env.MATRIX_BASEURL 
var linkPreviewUrl = "http://api.linkpreview.net/?key="+linkPreviewApiKey+"&q="


var client = sdk.createClient({
    baseUrl: baseURL,
    accessToken: myAccessToken,
    useAuthorizationHeader: false,
    userId: myUserId,
});

client.startClient();


client.once('sync', function(state, prevState, res) {
    //console.log(state); // state will be 'PREPARED' when the client is ready to use
});

client.on("Room.timeline", function(event, room, toStartOfTimeline) {

    if(room.name === 'Salon' && 
    event.event.type === 'm.room.message' && 
    event.event.content.msgtype === 'm.text' &&
    (isNullOrUndefined(event.event.content['m.relates_to']) ||  event.event.content['m.relates_to'].rel_type != 'm.replace')){
    
        console.log(event.event)
        matching_values = event.event.content.body.match(urlRegex())
        urls_found = ( matching_values == null ? [] : matching_values)
        console.log(urls_found)
        
        urls_found.forEach(url => {
            reviewData = ""
            console.log("Fetching " +linkPreviewUrl+url+"...")
            fetch(linkPreviewUrl+url).then( response => {
                
                return response.json().then( json => { 
                    console.log(json)
                })

            })
        }); 

    }
});
