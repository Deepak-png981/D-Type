document.addEventListener('DOMContentLoaded', function () {
    const textToType = document.getElementById('textToType');
    const textInput = document.getElementById('textInput');
    const timerEl = document.getElementById('timeElapsed');
    const speedEl = document.getElementById('speed');
    const accuracyEl = document.getElementById('accuracy');
    const resultPTag = document.getElementById('result-p-tag');
    const resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', resetTest);
    let timeStarted = false;
    let timer = null;
    let timeElapsed = 0;

    loadRandomSentence();

    textInput.addEventListener('input', function () {
        if (!timeStarted) {
            startTimer();
        }

        calculateAccuracy();
        checkCompletion();
        highlightText();
    });
    function highlightText() {
        const userInput = textInput.value;
        let highlightedText = '';
        for (let i = 0; i < textToType.textContent.length; i++) {
            let originalChar = textToType.textContent[i];
            let typedChar = userInput[i];
            if (typedChar == null) {
                highlightedText += originalChar;
            } else if (typedChar === originalChar) {
                highlightedText += `<span class="correct">${originalChar}</span>`;
            } else {
                highlightedText += `<span class="incorrect">${originalChar}</span>`;
            }
        }
        textToType.innerHTML = highlightedText;
    }

    function loadRandomSentence() {
        resultPTag.style.display = 'none';
        fetch('sentences.json')
            .then(response => response.json())
            .then(sentences => {
                const randomIndex = Math.floor(Math.random() * sentences.length);
                textToType.textContent = sentences[randomIndex];
            })
            .catch(error => console.error('Error loading sentences:', error));
    }


    function startTimer() {
        timeStarted = true;
        timer = setInterval(function () {
            timeElapsed++;
            timerEl.textContent = timeElapsed;
            updateWPM();
        }, 1000);
    }

    function updateWPM() {
        const wordsTyped = textInput.value.trim().split(/\s+/).length;
        const wpm = (wordsTyped / timeElapsed) * 60;
        speedEl.textContent = Math.round(wpm);
    }

    function calculateAccuracy() {
        const typedText = textInput.value;
        const referenceText = textToType.textContent;
        let errors = 0;

        typedText.split('').forEach((char, index) => {
            if (char !== referenceText.charAt(index)) errors++;
        });

        const accuracy = ((typedText.length - errors) / typedText.length) * 100;
        accuracyEl.textContent = Math.max(0, Math.round(accuracy));
    }

    function checkCompletion() {
        const typedText = textInput.value;
        const referenceText = textToType.textContent;

        if (typedText === referenceText) {
            clearInterval(timer);
            resultPTag.style.display = 'block';
        }
    }

    function resetTest() {
        clearInterval(timer);
        timeStarted = false;
        timeElapsed = 0;
        timerEl.textContent = 'Time: 0s';
        speedEl.textContent = 'Speed: 0 WPM';
        accuracyEl.textContent = 'Accuracy: 100%';
        textInput.value = '';
        resultPTag.style.display = 'block';
        loadRandomSentence();
    }
});
