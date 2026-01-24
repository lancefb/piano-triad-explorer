document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element References ---
    const staffContainer = document.querySelector('.staff-container');
    const messageText = document.getElementById('message-text');
    const connectBtn = document.getElementById('connect-btn');
    const startScreen = document.getElementById('start-screen');

    // --- Core App Logic ---
    
    function drawStaff() {
        staffContainer.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const line = document.createElement('div');
            line.classList.add('staff-line');
            staffContainer.appendChild(line);
        }
    }

    function onMIDIMessage(event) {
        const [command, note, velocity] = event.data;
        if (command === 144 && velocity > 0) {
            messageText.textContent = `Note On! MIDI Note: ${note}`;
            messageText.parentElement.style.backgroundColor = '#bbf7d0';
            setTimeout(() => {
                messageText.parentElement.style.backgroundColor = '#e2e2e2';
            }, 300);
        }
    }
    
    function onMIDISuccess(midiAccess) {
        console.log("MIDI ready!");
        // Hide the start screen and show the staff
        startScreen.style.display = 'none';
        staffContainer.style.display = 'flex'; // Use flex to match our CSS
        messageText.textContent = "MIDI keyboard connected. Play a note!";
        
        for (let input of midiAccess.inputs.values()) {
            input.onmidimessage = onMIDIMessage;
            console.log(`Attached MIDI listener to: ${input.name}`);
        }
    }

    function onMIDIFailure() {
        messageText.textContent = "Could not access your MIDI devices. Please ensure it's connected and refresh the page.";
        console.error("Could not access your MIDI devices.");
    }

    // --- App Initialization ---
    
    // 1. Draw the staff, but it will be hidden by default
    drawStaff();
    
    // 2. Add a click listener to our new connect button
    connectBtn.addEventListener('click', () => {
        // This setupMIDI function is now ONLY called when the user clicks the button
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess()
                .then(onMIDISuccess, onMIDIFailure);
        } else {
            messageText.textContent = "Web MIDI API is not supported in this browser.";
            console.error("Web MIDI API is not supported in this browser.");
        }
    });

});