require("dotenv").config();

var axios = require("axios");
var moment = require('moment');
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify2 = new Spotify(keys.spotify);
var inputOne = process.argv[2];
var inputTwo = process.argv[3];

commands(inputOne, inputTwo);
function commands(inputOne, inputTwo) {
  switch (inputOne) {
    case "Concert-This":
      getConcert(inputTwo);
      break;
    case "Spotify-This-Song":
      getSong(inputTwo);
      break;
    case "Movie-This":
      getMovie(inputTwo);
      break;
    case "Do-What-It-Says":
      getWhatever(inputTwo);
      break
    default:
      console.log("I'm sorry, That doesn't look like anything to me.")
      log(inputTwo);
      return;
  }
}

function getConcert(inputTwo) {
  axios.get("https://rest.bandsintown.com/artists/" + inputTwo + "/events?app_id=codingbootcamp")
    .then(function (response) {
      for (var i = 0; i < response.data.length; i++) {
        var datetime = response.data[i].datetime;
        datetime.split('T');

        console.log("-------------------------" +
          "\nVenue Name: " + response.data[i].venue.name +
          "\nVenue Location: " + response.data[i].venue.city +
          "\nEvent Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY") + "\n");
        contentAdded();
      }
    });
}
function getSong(trackTitle) {
  var trackTitle = inputTwo;
  if (!trackTitle) {
    trackTitle = "Misled ACxDC";
  }
  spotify2.search({
    type: 'track', query: trackTitle
  }, function (err, data) {
    if (!err) {
      var trackInfo = data.tracks.items;
      for (var i = 0; i < 5; i++) {
        if (trackInfo[i] != undefined) {
          var spotifyResults =
            "Artist: " + trackInfo[i].artists[0].name + "\n" +
            "Song: " + trackInfo[i].name + "\n" +
            "Album the song is from: " + trackInfo[i].album.name + "\n" +
            "Preview Url: " + trackInfo[i].preview_url + "\n" +
            "------------------------------ " + i + " ------------------------------" + "\n";
          console.log(spotifyResults);
          log(spotifyResults);
        }
      }
    } else {
      console.log("Error :" + err);
      return;
    }
  });
};

function getMovie(inputTwo) {
  if (!inputTwo) {
    inputTwo = "Mr. Nobody";
  }
  axios.get("http://www.omdbapi.com/?t=" + inputTwo + "&y=&plot=short&apikey=trilogy").then(function(res) {
    console.log(res)
    if (res && res.statusCode === 200) {
      var bodyOf = JSON.parse(body);
      var movieStats =
        "\n---------------------------------------------------\n" +
      "Title: " + bodyOf.Title + "n" +
        "Release Year: " + bodyOf.Year + "n" +
        "IMDB Rating: " + bodyOf.imdbRating + "\n" +
        "Rotten Tomatoes Rating: " + bodyOf.Ratings[1].Value + "\n" +
        "Country: " + bodyOf.Country + "\n" +
        "Language: " + bodyOf.Language + "\n" +
        "Plot: " + bodyOf.Plot + "\n" +
        "Actors: " + bodyOf.Actors + "\n" +
        "\n---------------------------------------------------\n";
      console.log(movieStats);
      // log(movieStats);
    }
    else {
      console.log("Error :");
      return;
    }
  }
  )};

function getWhatever(inputTwo) {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    else {
      console.log(data);
      var randomData = data.split(",");
      commands(randomData[0], randomData[1]);
    }
    console.log("test" + randomData[0] + randomData[1]);
  });
}

function log(dataToLog) {

  console.log(dataToLog);

  fs.appendFile('log.txt', dataToLog + '\n', function (err) {

    if (err) return logIt('Error logging data to file: ' + err);
  });
}
commands(inputOne, inputTwo);


/*   Debugging
1. Command: node liri.js
  Result: I'm sorry, That doesn't look like anything to me.


2. Command: node liri.js Concert-This
  Result: Error: options.uri is a required argument

3. Command: node liri.js Spotify-This-Song Misled
  Result: Error :StatusCodeError: 400 - {"error":"invalid_client","error_description":"Invalid client"}


4. Command: node liri.js Movie-This Hackers
  Result: (node:8824) UnhandledPromiseRejectionWarning: ReferenceError: err is not defined
    at d:\CWRU_BC\Repositories\LIRI-Node-App\liri.js:113:7
    at process.internalTickCallback (internal/process/next_tick.js:77:7)
(node:8824) UnhandledPromiseRejectionWarning: Unhandled promise rejection.
This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise
 which was not handled with .catch(). (rejection id: 1)
(node:8824) [DEP0018]
DeprecationWarning: Unhandled promise rejections are deprecated. In the future,
promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.

5. Command: node liri.js Do-What-It-Says Good Day
  Result: node liri.js Do-What-It-Says Good Day
spotify-this-song,"I Want it That Way"
I'm sorry, That doesn't look like anything to me.
testspotify-this-song"I Want it That Way"
6. Command: node liri.js Concert-This Migos
  Result: TypeError: inputOne is not a function
  Fix: Making a function called 'command' with inputOne and inputTwo apart of that function */
