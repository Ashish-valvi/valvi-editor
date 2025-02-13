document.addEventListener('DOMContentLoaded', () => {
    // Get the text editor element
    const editor = document.getElementById('editor');

    // Define normal key mappings for Marathi/Hindi characters
    const keyMap = {
        '`': '़', '1': '१', '2': '२', '3': '३', '4': '४', '5': '५', '6': '६', '7': '७', '8': '८', '9': '९', '0': '०',
        '-': 'ञ', '=': 'ृ',
        'q': 'ु', 'w': 'ू', 'e': 'म', 'r': 'त', 't': 'ज', 'y': 'ल', 'u': 'न', 'i': 'प', 'o': 'व', 'p': 'च',
        '[': 'ख्', ']': ',','\\':'ृ' ,
        'a': 'ं', 's': 'े', 'd': 'क', 'f': 'ि', 'g': 'ह', 'h': 'ी', 'j': 'र', 'k': 'ा', 'l': 'स', ';': 'य', "'": "श्",
        'z': '्र', 'x': 'ग', 'c': 'ब', 'v': 'अ', 'b': 'इ', 'n': 'छ', 'm': 'उ', ',': 'ए', '.': 'ण्', '/': 'ध्'
    };

    // Define shift key mappings for special characters
    const shiftKeyMap = {
        '`': 'ङ', '1': '|', '2': '/', '3': ':', '4': 'ऱ्', '5': '-', '6': '"', '7': "'", '8': 'द्य', '9': 'त्र', '0': 'ऋ',
        '-': 'ञ', '=': '्',
        'q': 'फ', 'w': 'ध', 'e': 'म्', 'r': 'त्', 't': 'ज्', 'y': 'ल्', 'u': 'न्', 'i': 'प्', 'o': 'व्', 'p': 'च्',
        '[': 'क्ष्', ']': 'द्य','\\':'्',
        'a': '', 's': 'ै', 'd': 'क्', 'f': 'थ्', 'g': 'ळ', 'h': 'भ्', 'j': 'श्र', 'k': 'ज्ञ', 'l': 'स्', ';': 'य्', "'":'ष्',
        'z': '्', 
        'x': 'ग्', 'c': 'ब्', 'v': 'ट', 'b': 'ठ', 'n': 'ण', 'm': 'ड', ',': 'ढ', '.': 'झ', '/': 'घ्'
    };

    // Add event listener to capture keypresses
    editor.addEventListener('keydown', (event) => {
        // Allow navigation and essential keys like Ctrl+C, Ctrl+V, Enter, Arrow Keys, Tab
        if (event.ctrlKey || ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', 'Tab'].includes(event.key)) {
            return; // Do nothing for these keys
        }

        // Ignore Shift key when pressed alone
        if (event.key === 'Shift') {
            return;
        }

        // Prevent default typing behavior in the text editor
        event.preventDefault();

        // Get cursor position and current text
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        let text = editor.value;

        // Handle Space key: Prevent breaking words like "पूर्वी", "सर्वे"
        if (event.key === ' ') {  
            if (start > 1 && text[start - 1] === '्' && text[start - 2] !== ' ') {
                // If previous character is "्" and not preceded by space, adjust cursor position
                editor.value = text.slice(0, start - 1) + ' ' + text.slice(end);
                editor.selectionStart = editor.selectionEnd = start;
            } else {
                // Insert space normally
                editor.value = text.slice(0, start) + ' ' + text.slice(end);
                editor.selectionStart = editor.selectionEnd = start + 1;
            }
            return;
        }

        // Handle Backspace: Remove previous character correctly
        if (event.key === 'Backspace') {
            if (start > 0) {
                editor.value = text.slice(0, start - 1) + text.slice(end);
                editor.selectionStart = editor.selectionEnd = start - 1;
            }
            return;
        }

        let output = '';
        let key = event.key.toLowerCase();

        // Handle "र्" (Rafar) merging before consonant when Shift+Z is pressed
        if (event.shiftKey && key === 'z') {
            if (start > 1) {
                let lastChar = text[start - 1];
                let beforeLastChar = text[start - 2];

                if (lastChar === '्') {
                    // If there's already a halant before the last character, apply "र्" before it
                    editor.value = text.slice(0, start - 2) + 'र्' + beforeLastChar + text.slice(end);
                    editor.selectionStart = editor.selectionEnd = start - 1;
                    return;
                } else {
                    // Otherwise, apply "र्" before the last consonant
                    editor.value = text.slice(0, start - 1) + 'र्' + lastChar + text.slice(end);
                    editor.selectionStart = editor.selectionEnd = start;
                    return;
                }
            }
        }

        // Handle conversion of "अ" to "आ" when pressing 'k'
        // Handle "k" (ा) input after a halant (्) to remove the halant instead of adding "ा"
if (key === 'k') {
    if (start > 0) {
        let lastChar = text[start - 1];

        // If last character is a halant "्", just remove it
        if (lastChar === '्') {
            editor.value = text.slice(0, start - 1) + text.slice(end);
            editor.selectionStart = editor.selectionEnd = start - 1;
            return;
        }
    }
}

// Handle "k" (ा) input after a halant (्) or अ
if (key === 'k') {
    if (start > 0) {
        let lastChar = text[start - 1];

        // If last character is a halant "्", remove it (for half-letters)
        if (lastChar === '्') {
            editor.value = text.slice(0, start - 1) + text.slice(end);
            editor.selectionStart = editor.selectionEnd = start - 1;
            return;
        }

        // If last character is "अ", replace "अ" with "आ"
        if (lastChar === 'अ') {
            editor.value = text.slice(0, start - 1) + 'आ' + text.slice(end);
            editor.selectionStart = editor.selectionEnd = start;
            return;
        }
    }
}


        // Check if Shift key is pressed and apply shiftKeyMap
        if (event.shiftKey && shiftKeyMap[key]) {
            output = shiftKeyMap[key];
        } else if (keyMap[key]) {
            output = keyMap[key]; // Use normal key mapping
        } else {
            output = event.key; // Default character
        }

        // Insert the transformed character at cursor position
        editor.value = text.slice(0, start) + output + text.slice(end);
        editor.selectionStart = editor.selectionEnd = start + output.length;
    });
});

