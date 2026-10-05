import re

# -----------------------------
# Spam Keywords
# -----------------------------
SPAM_KEYWORDS = {
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
}

# -----------------------------
# Stop Words
# -----------------------------
STOP_WORDS = {
    "a", "an", "the", "is", "are", "am", "was", "were",
    "you", "your", "have", "has", "had", "to", "of",
    "in", "on", "at", "and", "or", "for", "with",
    "this", "that", "it", "be", "from", "we", "they"
}


# -----------------------------
# Text Preprocessing
# -----------------------------
def preprocess_text(message):

    # 1. Convert to lowercase
    text = message.lower()

    # 2. Remove punctuation and special symbols
    text = re.sub(r"[^\w\s]", " ", text)

    # 3. Remove numbers
    text = re.sub(r"\d+", " ", text)

    # 4. Tokenization
    tokens = text.split()

    # 5. Remove stop words
    tokens = [word for word in tokens if word not in STOP_WORDS]

    return tokens


# -----------------------------
# Keyword Detection
# -----------------------------
def detect_keywords(tokens):

    detected_keywords = []

    for word in tokens:
        if word in SPAM_KEYWORDS:
            detected_keywords.append(word)

    return detected_keywords


# -----------------------------
# Pattern Detection
# -----------------------------
def detect_patterns(message):

    patterns = []

    # URL detection
    if re.search(r"https?://|www\.", message.lower()):
        patterns.append("Suspicious URL")

    # Click here detection
    if "click here" in message.lower():
        patterns.append("Click here")

    # Urgent language
    urgent_words = ["urgent", "immediately", "act now"]

    for word in urgent_words:
        if word in message.lower():
            patterns.append("Urgent language")
            break

    # Currency symbols
    if "₹" in message or "$" in message:
        patterns.append("Currency symbol")

    # Multiple exclamation marks
    if "!!" in message:
        patterns.append("Multiple exclamation marks")

    return patterns


# -----------------------------
# Calculate Spam Score
# -----------------------------
def calculate_score(keywords, patterns):

    score = 0

    # Each spam keyword = +1
    score += len(keywords) * 1

    # Each suspicious pattern
    for pattern in patterns:

        if pattern == "Suspicious URL":
            score += 2

        elif pattern == "Click here":
            score += 2

        else:
            score += 1

    return score


# -----------------------------
# Classification
# -----------------------------
def classify_message(score):

    if score >= 2:
        return "SPAM"
    else:
        return "NOT SPAM"