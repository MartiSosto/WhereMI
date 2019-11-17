var Andriy = "geoloc:";

var titolo, scopo, lingua, categoria, descrizione, audience, dettagli;

// Controllo sullo slider
var slider = document.getElementById("dettagli");
var output = document.getElementById("num_dettagli");
output.innerHTML = slider.value;
slider.oninput = function () {
    output.innerHTML = this.value;
}


function printVal() {
    console.log("Titolo: " + titolo);
    console.log("Descrizione: " + descrizione);
    console.log("Scopo: " + scopo);
    console.log("Lingua: " + lingua);
    console.log("Categoria: " + categoria);
    console.log("Audience: " + audience);
    console.log("Dettagli: " + dettagli);

    Andriy = Andriy + scopo + ":" + lingua + ":" + categoria + "[:A+" + audience + "][:P+" + dettagli + "]";
    console.log(Andriy);
    return false;
}

function formchk() {
    if ((titolo != "") && (descrizione != "")) {
        console.log("non lo so mica");
        titolo = document.getElementById("titolo").value;
        descrizione = document.getElementById("descrizione").value;
        scopo = document.getElementById("scopo").value;
        lingua = document.getElementById("lingua").value;
        categoria = document.getElementById("categoria").value;
        audience = document.getElementById("audience").value;
        dettagli = document.getElementById("dettagli").value;

        printVal();
        return false;
    } else {
        console.log("Ci sono dei valori vuoti che vanno riempiti")
    }

}

function showAudio(show) { //mostra o nasconde il tag audio
    var audio = document.getElementById('aud2');
    if (show == true) {
        audio.style.visibility = 'visible';
    } else {
        audio.style.visibility = 'hidden';
    }

}

function toggleRegistra(registra) { // cambia tasto registra
    document.getElementById("btnStart").innerHTML = registra ? "Registra" : "Stop";
}



let constraintObj = {
    audio: true,
    video: false
};
// width: 1280, height: 720  -- preference only
// facingMode: {exact: "user"}
// facingMode: "environment"

//handle older browsers that might implement getUserMedia in some way
if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
    navigator.mediaDevices.getUserMedia = function (constraintObj) {
        let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }
        return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraintObj, resolve, reject);
        });
    }
} else {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            devices.forEach(device => {
                console.log(device.kind.toUpperCase(), device.label);
                //, device.deviceId
            })
        })
        .catch(err => {
            console.log(err.name, err.message);
        })
}
navigator.mediaDevices.getUserMedia(constraintObj)
    .then(function (mediaStreamObj) {
        //connect the media stream to the first audio element
        let audio = document.querySelector('audio');
        if ("srcObject" in audio) {
            audio.srcObject = mediaStreamObj;
        } else {
            //old version
            audio.src = window.URL.createObjectURL(mediaStreamObj);
        }



        //add listeners for saving audio/audio
        let start = document.getElementById('btnStart');
        let vidSave = document.getElementById('aud2');
        let mediaRecorder = new MediaRecorder(mediaStreamObj);
        let chunks = [];
        var started = false;


        start.addEventListener('click', (ev) => {
            if (started == false) {
                mediaRecorder.start();
                started = true;
                toggleRegistra(false);
                showAudio(false);

            } else {
                mediaRecorder.stop();
                started = false;
                toggleRegistra(true);
                showAudio(true);
            }

        })
        mediaRecorder.ondataavailable = function (ev) {
            chunks.push(ev.data); //salvo dati ricevuti in array
            console.log(ev.data);
        }
        mediaRecorder.onstop = (ev) => {
            let blob = new Blob(chunks, {
                'type': 'audio/mp4;'
            }); //passo l'array all'oggetto blob che li salva nella variabile
            chunks = [];
            let audioURL = window.URL.createObjectURL(blob);
            vidSave.src = audioURL;
        }
    })



///////////AUDIO DA PC////////

const recorder = document.getElementById('recorder');
const player = document.getElementById('player'); //non c'è

recorder.addEventListener('change', function (e) {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);

    // Do something with the audio file.
    player.src = url;
});









///////////////CARICAMENTO YOUTUBE////////////////



//const API_KEY = "AIzaSyARgIB-2zTsZcy7IoYDUWlXu0a7yQDOj9s";
//const CLIENT_ID = "840091091157-fitfqdv3e84ivdh1fj0on6s1ganlu1eo.apps.googleusercontent.com";

/* work online
const API_KEY = "AIzaSyBcTEce_U3Ho-Ua4SiUmOvo0tPDzWkuBd4";
const CLIENT_ID = "899661843536-gl9bsjpnqbjkcddj1e8167o6e6anpmrd.apps.googleusercontent.com";
 */

//CODICI funzionanti per upload YT + backup per esaurimento quote (error 403 - youtube.quota)
const API_KEY = "AIzaSyAisQVJRCJqUAW-wICyJbshSxg_jPL-Y-A";
const CLIENT_ID = "600073852662-s43ta0ecr4b2i384uovdegtujmche6v6.apps.googleusercontent.com";


// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/people/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var utenteButton = document.getElementById('buttonLogin');
var update = document.getElementById('update');

/*function f() {
  alert("fai login");

}*/
/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        //alert("Sign-in successful");
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
        if (utenteButton) {
            utenteButton.onclick = handleAuthClick;
        }
    }, function (err) {
        console.error("Error loading GAPI client for API", err);
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';

        //Elementi statici presenti solo nel editor
        if (utenteButton || update) {
            utenteButton.style.display = 'none';
            update.disabled = false;
        }
        //document.getElementById("update").display = 'initial';
        //document.getElementById("update").disabled = false;
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        if (utenteButton || update) {
            utenteButton.style.display = 'none';
            update.disabled = true;
        }

    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
        alert("Sei già loggato");
        if (utenteButton || update) {
            utenteButton.style.display = 'none';
            update.disabled = false;
        }
    } else {
        gapi.auth2.getAuthInstance().signIn();
    }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/*
  // user profile data
  function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var name = progile.getName();
    // console.log('ID: ' + profile.getId());
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail());
  }
*/

window.uploadToYoutube = async function (urlClip, titolo, metadati, descrizioneClip) {
    //Ottieni clip video da URL (hosted cloudinary.com)
    let response = await fetch(urlClip);
    var rawData = await response.blob();
    rawData.type = 'video/mp4';

    console.log("Preparo invio dati a Youtube (API)", rawData);
    uploadRawFile(rawData, titolo, metadati, descrizioneClip);
    return true;
}

async function uploadRawFile(videoclip, titolo, metadatiClip, descrizioneClip) {
    var token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
    var params = {
        snippet: {
            categoryId: 27,
            title: titolo,
            description: metadatiClip + "%%%" + descrizioneClip,
            tags: [metadatiClip]
        },
        status: {
            privacyStatus: 'public',
            embeddable: true
        }
    };

    //Building request
    var request = new FormData();
    var metadatiYoutube = new Blob([JSON.stringify(params)], {
        type: 'application/json'
    });
    request.append('video', metadatiYoutube);
    request.append('mediaBody', videoclip);

    var okUpload;
    //Upload via API youtube (POST)
    $.ajax({
            method: 'POST',
            url: 'https://www.googleapis.com/upload/youtube/v3/videos?access_token=' + encodeURIComponent(token) +
                '&part=snippet,status',
            data: request,
            cache: false,
            contentType: false,
            processData: false,
        })
        .done(function (response) {
            console.log("Caricamento completato! YouTube:", response)
            return true;
        })
        .fail(function (response) {
            var errors = response.responseJSON.error.errors[0];
            console.log("Errore API per Upload YT!", errors);
            return false;
        });
}