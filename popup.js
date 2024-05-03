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


//add Button
add_btn.addEventListener('click', (event) => {
    event.preventDefault();
    ValidationForm(event);
});

//delete Button
delete_btn.addEventListener('click', function(){
    // console.log("I am clicked");
    DeleteClient();
})

update_btn.addEventListener('click' , function(){
    console.log("I am clicked");
    UpdateClient();
})

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

    if (textClientUsername.value === "" || /[^a-zA-Z0-9]/.test(textClientUsername.value)) {
        usernameAlert.textContent = "Username is Required Cannot be Symbol";
        isValid = false;
        console.log("Invalid username format");
    } else {
        usernameAlert.textContent = "";
        console.log("Valid username format:", textClientUsername.value);
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
                    location.reload();
                    
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

        //Clear the Existing Option

        clientDataNew.forEach(function(client){
            let clientOption = document.createElement('option');
            clientOption.setAttribute('value' , client.username);
            clientOption.textContent = client.clientName;
            select.appendChild(clientOption);
            
            //Adding Listener for when an Option is selected
            select.addEventListener('change', function(){
                let selectClientUsername = select.value;
                let selectedClient  = clientDataNew.find(client => client.username === selectClientUsername);
                if(selectedClient){
                    textClientName.disabled = true;
                    document.getElementById('textClientName').value = selectedClient.clientName;
                    document.getElementById('textClientUsername').value = selectedClient.username;
                    document.getElementById('textClientPassword').value = selectedClient.password;
                    add_btn.setAttribute('disabled' ,'true');
                    update_btn.removeAttribute('disabled');
                    delete_btn.removeAttribute('disabled');
                }
                else{
                    textClientName.disabled = false;
                    add_btn.removeAttribute('disabled');
                    update_btn.setAttribute('disabled','true');
                    delete_btn.setAttribute('disabled',' true');
                    document.getElementById('textClientName').value = "";
                    document.getElementById('textClientUsername').value = "";
                    document.getElementById('textClientPassword').value = "";
                }
            })
            
        });
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

//Update Client
function UpdateClient(){
    chrome.storage.local.get('clientData', function(data){
        let NewClientData = data.clientData || [];
        let UpSelect = document.getElementById('form-select');
        console.log("This is Update file data", NewClientData);
        let UpdateSelected = UpSelect.value;
        console.log(UpdateSelected);
        //Finding Data by Index
        let selectedUser = NewClientData.find(client => client.username === UpdateSelected);
        console.log(selectedUser);

        if(selectedUser){
            //Take Data from the User
            selectedUser.username = textClientUsername.value;
            selectedUser.password = textClientPassword.value;

            //Update data in chrome Local Storage
            chrome.storage.local.set({'clientData' : NewClientData} , function(){
                console.log("user Info Updated successfully");
                UpSelect.value = "";
                usernameAlert.setAttribute('class' , 'green');
                usernameAlert.textContent = "Data Updated";

                setTimeout(()=>{
                    location.reload();
                },1500)
                
            })
        }else{
            console.log("Selected User not Found");
            
        }
        
    });
    
}
//Delete Client
function DeleteClient(){
    chrome.storage.local.get('clientData' , function(results){
        let NewData = results.clientData || [];
        console.log("We are getting this data to delete the function", NewData);
        let delSelect = document.getElementById('form-select');
        let delSelectedOption = delSelect.value;
        console.log(delSelectedOption);
        //Find the Index of the client to Delete
        let selectedUser = NewData.findIndex(client => client.username === delSelectedOption);
        console.log("This is selected user",selectedUser);
        if(selectedUser !== -1){
            NewData.splice(selectedUser , 1);
            console.log(NewData);
        }
        chrome.storage.local.set({'clientData' : NewData} , function(){
            console.log("New Data has been Updated" ,NewData);
            usernameAlert.setAttribute('class' , 'green');
                usernameAlert.textContent = `Data Deleted`;
            setTimeout(()=>{
                location.reload();
            },1000);
        });
        delSelect.value = "";
    });
}

});