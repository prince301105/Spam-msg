from flask import Flask, render_template, request

from spam_detector import (
    preprocess_text,
    detect_keywords,
    detect_patterns,
    calculate_score,
    classify_message
)

app = Flask(__name__)


# -----------------------------
# Home Page
# -----------------------------
@app.route("/", methods=["GET", "POST"])
def home():

    result = None
    keywords = []
    patterns = []
    score = 0
    tokens = []
    message = ""

    if request.method == "POST":

        # Get SMS from frontend
        message = request.form.get("message", "")

        if message.strip():

            # NLP preprocessing
            tokens = preprocess_text(message)

            # Detect spam keywords
            keywords = detect_keywords(tokens)

            # Detect suspicious patterns
            patterns = detect_patterns(message)

            # Calculate spam score
            score = calculate_score(keywords, patterns)

            # Classify message
            result = classify_message(score)

    return render_template(
        "index.html",
        message=message,
        tokens=tokens,
        keywords=keywords,
        patterns=patterns,
        score=score,
        result=result
    )


# -----------------------------
# Run Application
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True)