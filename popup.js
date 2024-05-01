document.addEventListener('DOMContentLoaded', function(){

toCreateOption();
const add_btn = document.getElementById("add");
const update_btn = document.getElementById('update');
const delete_btn = document.getElementById("delete");
const textClientName = document.getElementById('textClientName');
const textClientUsername = document.getElementById("textClientUsername");
const textClientPassword = document.getElementById("textClientPassword");
const clientNameAlert = document.getElementById('clientNameAlert');
const usernameAlert = document.getElementById('usernameAlert');
const passwordAlert = document.getElementById('passwordAlert');
const btnPasteUser = document.getElementById('btnPasteUser');
let isValid = true;


add_btn.addEventListener('click', (event) => {
    event.preventDefault();
    ValidationForm(event);

});

//form Validation
function ValidationForm(event) {

    //validate  client Username
    if (textClientName.value === "") {
        clientNameAlert.textContent = "Client name is required";
        isValid = false;
        console.log("Client name is empty")
    } else {
        clientNameAlert.textContent = "";
        console.log(textClientName.value);
    }

    //Validate Client Username

    if (textClientUsername.value === "") {
        usernameAlert.textContent = "PAN is Required"
        isValid = false;
        console.log("username is empty");
    } else {
        usernameAlert.textContent = "";
        console.log(textClientUsername.value);
    }

    //Validate Client Password

    if (textClientPassword.value === "") {
        passwordAlert.textContent = "Password is Required";
        isValid = false;
        console.log('Password is empty')
    } else {
        textClientPassword.textContent = "";
        console.log(textClientPassword.value);
    }

    if (!isValid) {
        event.preventDefault();
    } else {
        storeData(textClientName.value, textClientUsername.value, textClientPassword.value);
        textClientName.value = "";
        textClientUsername.value = "";
        textClientPassword.value = "";
    }

    return isValid;
}

//Store data into the chrome Extension local data storage
function storeData(clientName, username, password) {
    //write function here to store data in chrome.localstorage

    const data = {
        clientName: clientName,
        username: username,
        password: password
    }
    //Store data in chrome local storage
    chrome.storage.local.get('clientData', function (result) {
        if (chrome.runtime.lastError) {
            console.log('Error Retriving data :', chrome.runtime.lastError);
        } else {
            let clientData = result.clientData || []; // if no data Exist yet
            clientData.push(data); //Push new data into Array;

            //Store the new Data in chrome.storage.local
            chrome.storage.local.set({ 'clientData': clientData }, function () {
                if (chrome.runtime.lastError) {
                    console.error('Error storing data : ', chrome.runtime.lastError);
                }
                else {
                    console.log('Data Stored successfully for client', clientName);
                    console.log(result);
                }
            })
        }
    });

    chrome.storage.local.get('clientData',function(result){
        console.log('Data in the storage is : ', result);
    });
}

function toCreateOption(){
    chrome.storage.local.get('clientData' ,function(results){
        let clientDataNew  = results.clientData || [];
        let select  = document.getElementById('form-select');
        clientDataNew.forEach(function(client){
            let clientOption = document.createElement('option');
            clientOption.setAttribute('value' , client.username);
            clientOption.textContent = client.clientName;
            select.appendChild(clientOption);
        })
        console.log(clientDataNew);
        
    });
}


btnPasteUser.addEventListener('click', ()=>{
    //get Selected option from the Select
    let selectElement = document.getElementById('form-select');
    let selectOption = selectElement.options[selectElement.selectedIndex].value;
    console.log("This is selected option",selectOption);
    chrome.storage.local.get('clientData', function(result){
        //fetch data from the chrome local Storage and store it into the client List var
        let clientList  = result.clientData || [];
        console.log("This is list of clients",clientList);
        //find data from an array and stored it into selecteduservar 
        let selecteduser  = clientList.find((user)=> user.username === selectOption);
        
        // console.log(selecteduser.clientName); //clientName , username , password
        // console.log(msg.param.username);
        if(selectOption == -1){
            usernameAlert.textContent = "Please select a client";
            setTimeout(() => {
                usernameAlert.textContent = "";
            }, 500);
        }else {

            let clientObj = {
                username : selecteduser.username,
                password : selecteduser.password
            }
            
            console.log(clientObj);
            setTimeout(() => {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, clientObj);
                    console.log('Message is been send', clientObj)
                });
            }, 1000);
            
        }

    });
});

function pastePassword(){
    
}



});