function nextPage(pageNumber) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(`page${pageNumber}`).classList.add('active');
}

function previousPage(pageNumber) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(`page${pageNumber}`).classList.add('active');
}


document.addEventListener("DOMContentLoaded", () => {
    const textarea = document.getElementById("textarea");
    const speakingMessage = document.getElementById("speakingMessage");
    const enterTextMessage = document.getElementById("enterTextMessage");
    const copyMessage = document.getElementById("copyMessage");
    const pasteMessage = document.getElementById("pasteMessage");

    speakingMessage.style.display = "none";
    enterTextMessage.style.display = "none";
    copyMessage.style.display = "none";
    pasteMessage.style.display = "none";

    // Load history from local storage
    loadHistory();

    window.speak = function() {
        const text = textarea.value.trim();
        if (text === "") {
            enterTextMessage.style.display = "block";
            setTimeout(() => {
                enterTextMessage.style.display = "none";
            }, 2000);
            return;
        }

        // Add text to history before speaking
        addToHistory(text);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => {
            speakingMessage.style.display = "block";
        };
        utterance.onend = () => {
            speakingMessage.style.display = "none";
        };
        window.speechSynthesis.speak(utterance);
    };

    window.copytext = function() {
        const text = textarea.value.trim();
        if (text === "") {
            enterTextMessage.style.display = "block";
            setTimeout(() => {
                enterTextMessage.style.display = "none";
            }, 2000);
            return;
        }

        textarea.select();
        if (document.execCommand("copy")) {
            copyMessage.style.display = "block";
            copyMessage.textContent = "Text copied to clipboard";
            setTimeout(() => {
                copyMessage.style.display = "none";
            }, 2000);
        } else {
            copyMessage.style.display = "block";
            copyMessage.textContent = "Failed to copy text";
            setTimeout(() => {
                copyMessage.style.display = "none";
            }, 2000);
        }
    };

    window.pastetext = async function() {
        try {
            const text = await navigator.clipboard.readText();
            textarea.value = text;
            pasteMessage.style.display = "block";
            pasteMessage.textContent = "Text pasted from clipboard";
            setTimeout(() => {
                pasteMessage.style.display = "none";
            }, 2000);
        } catch (err) {
            pasteMessage.style.display = "block";
            pasteMessage.textContent = "Failed to paste text";
            setTimeout(() => {
                pasteMessage.style.display = "none";
            }, 2000);
        }
    };

    window.clearHistory = function() {
        historyList.innerHTML = "";
        localStorage.removeItem("speechHistory");
    };

    function addToHistory(text) {
        const listItem = document.createElement("li");
        listItem.textContent = text;
        listItem.className = "list-group-item";
        historyList.appendChild(listItem);
        saveHistory();
    }

    function saveHistory() {
        const items = [];
        historyList.querySelectorAll("li").forEach(item => {
            items.push(item.textContent);
        });
        localStorage.setItem("speechHistory", JSON.stringify(items));
    }

    function loadHistory() {
        const history = localStorage.getItem("speechHistory");
        if (history) {
            const items = JSON.parse(history);
            items.forEach(item => {
                const listItem = document.createElement("li");
                listItem.textContent = item;
                listItem.className = "list-group-item";
                historyList.appendChild(listItem);
            });
        }
    }
});