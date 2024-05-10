//To Fetch all data from the chrome local Stroage
console.log('Background script is loaded');
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'exportData') {
        chrome.storage.local.get('clientData', (data) => {
            const downloadData = data.clientData || [];
            let result = 'Client name, Username, Password\r\n';
            for (let i = 0; i < downloadData.length; i++) {
                result += `${downloadData[i].clientName} , ${downloadData[i].username} , ${downloadData[i].password}\r\n`;
            }
            //Sending data to the popup.Js
            chrome.runtime.sendMessage({ action: 'downloadCSV', csvContent: result });
        });
    }
});

