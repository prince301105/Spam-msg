/* =====================================================
   SMS SHIELD
   Rule-Based NLP Spam Detection
   GitHub Pages Version

   Same rule-based logic as SLA 2
   No Machine Learning
   ===================================================== */


/* ================= SPAM KEYWORDS ================= */

const SPAM_KEYWORDS = new Set([
    "free",
    "win",
    "won",
    "winner",
    "prize",
    "claim",
    "congratulations",
    "urgent",
    "offer",
    "cash",
    "reward",
    "lottery",
    "click",
    "subscribe",
    "limited",
    "discount"
]);


/* ================= STOP WORDS ================= */

const STOP_WORDS = new Set([
    "a",
    "an",
    "the",
    "is",
    "are",
    "am",
    "was",
    "were",
    "you",
    "your",
    "have",
    "has",
    "had",
    "to",
    "of",
    "in",
    "on",
    "at",
    "and",
    "or",
    "for",
    "with",
    "this",
    "that",
    "it",
    "be",
    "from",
    "we",
    "they"
]);


/* =====================================================
   TEXT PREPROCESSING
   ===================================================== */

function preprocessText(message) {

    // 1. Convert to lowercase
    let text = message.toLowerCase();


    // 2. Remove punctuation and special symbols
    text = text.replace(/[^\w\s]/g, " ");


    // 3. Remove numbers
    text = text.replace(/\d+/g, " ");


    // 4. Tokenization
    let tokens = text
        .split(/\s+/)
        .filter(word => word.length > 0);


    // 5. Remove stop words
    tokens = tokens.filter(
        word => !STOP_WORDS.has(word)
    );


    return tokens;
}


/* =====================================================
   KEYWORD DETECTION
   ===================================================== */

function detectKeywords(tokens) {

    const detectedKeywords = [];

    for (const word of tokens) {

        if (SPAM_KEYWORDS.has(word)) {

            detectedKeywords.push(word);

        }
    }

    return detectedKeywords;
}


/* =====================================================
   PATTERN DETECTION
   ===================================================== */

function detectPatterns(message) {

    const patterns = [];

    const lowerMessage = message.toLowerCase();


    // URL detection
    if (
        /https?:\/\/|www\./.test(lowerMessage)
    ) {

        patterns.push("Suspicious URL");

    }


    // Click here detection
    if (
        lowerMessage.includes("click here")
    ) {

        patterns.push("Click here");

    }


    // Urgent language
    const urgentWords = [
        "urgent",
        "immediately",
        "act now"
    ];


    for (const word of urgentWords) {

        if (lowerMessage.includes(word)) {

            patterns.push("Urgent language");

            break;

        }
    }


    // Currency symbols
    if (
        message.includes("₹") ||
        message.includes("$")
    ) {

        patterns.push("Currency symbol");

    }


    // Multiple exclamation marks
    if (
        message.includes("!!")
    ) {

        patterns.push("Multiple exclamation marks");

    }


    return patterns;
}


/* =====================================================
   CALCULATE SPAM SCORE
   ===================================================== */

function calculateScore(keywords, patterns) {

    let score = 0;


    // Each spam keyword = +1
    score += keywords.length * 1;


    // Each suspicious pattern
    for (const pattern of patterns) {

        if (pattern === "Suspicious URL") {

            score += 2;

        }

        else if (pattern === "Click here") {

            score += 2;

        }

        else {

            score += 1;

        }
    }


    return score;
}


/* =====================================================
   CLASSIFICATION
   ===================================================== */

function classifyMessage(score) {

    if (score >= 2) {

        return "SPAM";

    }

    else {

        return "NOT SPAM";

    }
}


/* =====================================================
   DISPLAY HELPERS
   ===================================================== */

function displayTags(container, items, className) {

    container.innerHTML = "";


    if (items.length === 0) {

        const empty = document.createElement("span");

        empty.className = "empty-text";

        empty.textContent = "None";

        container.appendChild(empty);

        return;
    }


    items.forEach(item => {

        const tag = document.createElement("span");

        tag.className = className;

        tag.textContent = item;

        container.appendChild(tag);

    });
}


/* =====================================================
   ANALYZE SMS
   ===================================================== */

function analyzeSMS() {

    const messageInput =
        document.getElementById("message");

    const message =
        messageInput.value;


    const errorBox =
        document.getElementById("errorBox");

    const resultSection =
        document.getElementById("resultSection");


    /* ---------- EMPTY MESSAGE ---------- */

    if (!message.trim()) {

        errorBox.classList.remove("hidden");

        resultSection.classList.add("hidden");

        return;
    }


    errorBox.classList.add("hidden");


    /* ---------- NLP PREPROCESSING ---------- */

    const tokens =
        preprocessText(message);


    /* ---------- KEYWORDS ---------- */

    const keywords =
        detectKeywords(tokens);


    /* ---------- PATTERNS ---------- */

    const patterns =
        detectPatterns(message);


    /* ---------- SCORE ---------- */

    const score =
        calculateScore(
            keywords,
            patterns
        );


    /* ---------- CLASSIFICATION ---------- */

    const result =
        classifyMessage(score);


    /* =================================================
       DISPLAY RESULT
       ================================================= */

    document.getElementById(
        "classification"
    ).textContent = result;


    document.getElementById(
        "spamScore"
    ).textContent = score;


    document.getElementById(
        "keywordCount"
    ).textContent = keywords.length;


    /* ---------- TOKENS ---------- */

    displayTags(
        document.getElementById("tokens"),
        tokens,
        "tag"
    );


    /* ---------- KEYWORDS ---------- */

    displayTags(
        document.getElementById("keywords"),
        keywords,
        "tag"
    );


    /* ---------- PATTERNS ---------- */

    displayTags(
        document.getElementById("patterns"),
        patterns,
        "pattern-tag"
    );


    /* =================================================
       RESULT BADGE
       ================================================= */

    const resultBadge =
        document.getElementById("resultBadge");


    resultBadge.textContent = result;

    resultBadge.classList.remove("normal");


    if (result === "NOT SPAM") {

        resultBadge.classList.add("normal");

    }


    /* =================================================
       RESULT MESSAGE
       ================================================= */

    const resultMessage =
        document.getElementById("resultMessage");


    resultMessage.classList.remove(
        "normal-message"
    );


    if (result === "SPAM") {

        resultMessage.textContent =
            "This message contains suspicious indicators.";

    }

    else {

        resultMessage.textContent =
            "No significant spam indicators were detected.";

        resultMessage.classList.add(
            "normal-message"
        );

    }


    /* ---------- SHOW RESULTS ---------- */

    resultSection.classList.remove("hidden");


    /* ---------- SCROLL TO RESULT ---------- */

    setTimeout(() => {

        resultSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);

}


/* =====================================================
   CHARACTER COUNTER
   ===================================================== */

function updateCharacterCount() {

    const message =
        document.getElementById("message");


    const charCount =
        document.getElementById("charCount");


    charCount.textContent =
        message.value.length;
}


/* =====================================================
   EVENT LISTENERS
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const analyzeBtn =
            document.getElementById("analyzeBtn");


        const message =
            document.getElementById("message");


        analyzeBtn.addEventListener(
            "click",
            analyzeSMS
        );


        message.addEventListener(
            "input",
            updateCharacterCount
        );


        /* Enter with Ctrl + Enter */

        message.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.ctrlKey &&
                    event.key === "Enter"
                ) {

                    analyzeSMS();

                }

            }
        );

    }
);
