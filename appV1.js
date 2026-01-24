// Wait for the entire webpage to load before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element References ---
    // Get a reference to the important elements on our page
    const staffContainer = document.querySelector('.staff-container');
    const messageText = document.getElementById('message-text');

    // --- Core App Logic ---
    
    // Function to draw the musical staff
    function drawStaff() {
        staffContainer.innerHTML = ''; // Clear any existing content
        for (let i = 0; i < 5; i++) {
            const line = document.createElement('div');
            line.classList.add('staff-line');
            staffContainer.appendChild(line);
        }
        console.log("Staff drawn.");
    }

    // Function to handle incoming MIDI messages
    function onMIDIMessage(event) {
        // event.data is an array of numbers [command, note, velocity]
        const [command, note, velocity] = event.data;
        
        // We only care about "note on" messages (command 144) where velocity > 0
        if (command === 144 && velocity > 0) {
            messageText.textContent = `Note On! MIDI Note: ${note}`;
            console.log(`MIDI Note On: ${note}, Velocity: ${velocity}`);
            
            // Turn the message box green for a moment to show feedback
            messageText.parentElement.style.backgroundColor = '#bbf7d0'; // A light green color
            setTimeout(() => {
                messageText.parentElement.style.backgroundColor = '#e2e2e2'; // Reset to original color
            }, 300); // Reset after 300 milliseconds
        }
    }

    // Function to set up MIDI access
    function setupMIDI() {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess()
                .then(onMIDISuccess, onMIDIFailure);
        } else {
            messageText.textContent = "Web MIDI API is not supported in this browser.";
            console.error("Web MIDI API is not supported in this browser.");
        }
    }

    // Success callback for requestMIDIAccess
    function onMIDISuccess(midiAccess) {
        console.log("MIDI ready!");
        messageText.textContent = "MIDI keyboard connected. Play a note!";
        
        // Get all MIDI inputs and attach our message handler
        for (let input of midiAccess.inputs.values()) {
            input.onmidimessage = onMIDIMessage;
            console.log(`Attached MIDI listener to: ${input.name}`);
        }
    }

    // Failure callback for requestMIDIAccess
    function onMIDIFailure() {
        messageText.textContent = "Could not access your MIDI devices.";
        console.error("Could not access your MIDI devices.");
    }

    // --- App Initialization ---
    
    // 1. Draw the visual staff on the screen
    drawStaff();
    
    // 2. Set up MIDI access to listen to the keyboard
    setupMIDI();

});