//This is a web-Socket client used in browser to test the server functionality
const socket = new WebSocket("ws://localhost:4000/")

const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

const metaDataForm = document.getElementById('metaData-form');
const metaDataInput = document.getElementById('metaData-input');

const packageForm = document.getElementById('package-form');
const packageInput = document.getElementById('package-input');

//Establishing connection
socket.addEventListener('open', (event) => {
    console.log('WebSocket connection established.');
});

//Message input
messageForm.addEventListener('submit', function(e){
    e.preventDefault();
    try{
        if(messageInput.value){
            const data = {
               _event: 'client robot message',
                value: messageInput.value
            }
            socket.send(JSON.stringify(data));
            messageInput.value='';
        }
    }catch(err){
        console.log(`Error: ${err.message}`)
        throw err
    }
})

//Meta-data input
metaDataForm.addEventListener('submit', function(e){
    e.preventDefault();
    try{
        if(metaDataInput.value){
            const data = {
               _event: 'client robot metaData',
                value: metaDataInput.value
            }
            socket.send(JSON.stringify(data));
            metaDataInput.value='';
        }
    }catch(err){
        console.log(`Error: ${err.message}`)
        throw err
    }
})

// Package input
packageForm.addEventListener('submit', function(e){
    e.preventDefault();
    try{
        if(packageInput.value){
            const data = {
               _event: 'studio package metaData',
                value: packageInput.value
            }
            // console.log(`At Client socket-id: ${socket.id}`);
            socket.send(JSON.stringify(data));
            packageInput.value='';
        }
    }catch(err){
        console.log(`Error: ${err.message}`)
        throw err
    }
})

// Handling scheduler notitfications
socket.onmessage = function({data}){
    let {_event, value} = JSON.parse(data)
    if(_event == "notification"){
        console.log("received at client...", value);
    }
}



