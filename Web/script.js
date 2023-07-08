// Function to display an error message
function displayErrorMessage(message) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.style.color = '#FFFFFF'; // white color
}

// Function to display a success message
function displaySuccessMessage(message) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.style.color = '#FFFFFF'; // white color
}

// Function to check if the user is on Windows and using Chrome
function isWindowsChrome() {
    return navigator.userAgent.indexOf('Windows') !== -1 && navigator.userAgent.indexOf('Chrome') !== -1;
}

// Function to flash the piggy bank
async function flashPiggy() {
    const flashButton = document.getElementById('flashButton');
    flashButton.disabled = true;

    try {
        if (!isWindowsChrome()) {
            throw new Error('Oops! This feature is only supported on Windows using Chrome browser.');
        }

        const ssid = document.getElementById('ssid').value;
        const password = document.getElementById('password').value;
        const host = document.getElementById('host').value;
        const invoice = document.getElementById('invoicekey').value;

        if (ssid === '' || password === '' || host === '' || invoice === '') {
            throw new Error('Please fill in all the required fields.');
        }

        const port = await navigator.serial.requestPort();
        await port.open({
            baudRate: 115200
        });

        const writer = port.writable.getWriter();
        const sketchCode = `/* Piggy sketch code */
const char* ssid = "${ssid}";
const char* password = "${password}";
const char* host = "${host}";
const char* invoice = "${invoice}";`;
        await writer.write(new TextEncoder().encode(sketchCode));
        await writer.close();

        displaySuccessMessage('WOHOO! Piggy bank successfully updated and flashed!');

        // Initialize the board and display
        const board = new five.Board({
            port: port,
            repl: false
        });

        board.on('ready', function () {
            const display = new five.LCD({
                controller: 'PCF8574',
                rows: 2,
                cols: 16
            });

            display.clear().print('Piggy Flashed!');

            // Additional code to interact with the display or other components

            flashButton.disabled = false;
        });

    } catch (error) {
        let errorMessage = 'Oops! Sadly something went wrong. ';

        if (error.message === 'Please fill in all the required fields.') {
            errorMessage += 'Please fill in all the fields to update your piggy bank.';
        } else if (error.message === 'Oops! This feature is only supported on Windows using Chrome browser.') {
            errorMessage += 'Please use a Windows computer with the Chrome browser to update your piggy bank.';
        } else {
            errorMessage += 'Make sure your piggy bank is connected and try again later.';
        }

        displayErrorMessage(errorMessage);
        flashButton.disabled = false;
    }
}

// Attach the flashing function to the button click event
const flashButton = document.getElementById('flashButton');
flashButton.addEventListener('click', flashPiggy);
```

Please replace your existing script.js file with the updated code provided above. This version of the script.js file retrieves the values from the corresponding input fields in the flash.html file and passes them to the .ino file before flashing the piggy bank.
