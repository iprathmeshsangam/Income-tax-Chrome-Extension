console.log('content script is loaded');
// alert("Hello from content script");

chrome.runtime.onMessage.addListener(function (message) {
    console.log('Message Rec is : ', message);
    if (location.href === "https://eportal.incometax.gov.in/iec/foservices/#/login") {
        //Check if the input element 
        let eUser = document.getElementById('panAdhaarUserId');
        if (eUser) {
            //Focus on the input Field.
            eUser.focus();
            eUser.value = `${message.username}`;
            eUser.dispatchEvent(new Event('change'));
            let event = new Event('input', { bubbles: true });
            eUser.dispatchEvent(event);
            // console.log('Username pasted')
            // Simulate clicking on the Submit Button
            let SubmitBtn = document.querySelector('button.large-button-primary');

            if (SubmitBtn && !SubmitBtn.disabled) {
                SubmitBtn.click();
                console.log("Button is clicked");
                setTimeout(checkCheckboxAndInputPassword, 1000);

                function checkCheckboxAndInputPassword() {
                    let ePass = document.getElementById('loginPasswordField');
                    if (location.href === 'https://eportal.incometax.gov.in/iec/foservices/#/login/password') {
                        // Check if the checkbox is checked
                        let checkBox = document.getElementById('passwordCheckBox-input');
                        if (checkBox.getAttribute('aria-checked') === 'false') {
                            checkBox.setAttribute('aria-checked', 'true');
                            checkBox.click();
                            ePass.dispatchEvent(new Event('input', { bubbles: true }));
                            // Check if password input field is available
                            if (ePass) {
                                // Focus on the password input field
                                ePass.focus();
                                // Input the password value
                                ePass.value = `${message.password}`;
                                ePass.dispatchEvent(new Event('change'));
                                ePass.dispatchEvent(new Event('input', { bubbles: true }));
                                console.log('Password pasted');
                                // Simulate clicking on the Submit Button
                                let SubmitBtn = document.querySelector('button.large-button-primary');
                                if (SubmitBtn && !SubmitBtn.disabled) {
                                    setInterval(()=>{
                                        SubmitBtn.click();
                                    },1000)
                                    
                                    // console.log("Button is clicked for Password");
                                    SubmitBtn.click();  
                                };
                            } else {
                                // console.log('Password input field not found');
                            }
                        } else {
                            // console.log("Checkbox not checked yet");
                            // setTimeout(checkCheckboxAndInputPassword, 1000);
                        }
                    }
                }
            };
        }
        else {
            // console.log('Submit button not found');
        }
    }
    else {
        // console.log('Input Element Not found');
    }
}
);

