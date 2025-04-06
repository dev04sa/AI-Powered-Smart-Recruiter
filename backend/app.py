from flask import Flask, request, jsonify
import pandas as pd
import pdfplumber
import spacy
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS

# Download required data
nltk.download('punkt')
nlp = spacy.load("en_core_web_sm")

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load Job Descriptions
jd_file = "job_description.csv"  # Make sure this file is in the same folder
jd_df = pd.read_csv(jd_file, encoding="ISO-8859-1")

# Function to extract text from PDF
def extract_text_from_pdf(file_stream):
    text = ""
    with pdfplumber.open(file_stream) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()

# Extract key terms from job description
def extract_key_info(jd_text):
    doc = nlp(jd_text)
    skills = [token.text for token in doc if token.pos_ in ["NOUN", "PROPN"]]
    return " ".join(set(skills))

# Preprocess job descriptions
jd_df["Processed_JD"] = jd_df["Job Description"].apply(extract_key_info)

@app.route("/match", methods=["POST"])
def match_resume():
    if "resume" not in request.files:
        return jsonify({"error": "Resume file not provided"}), 400

    file = request.files["resume"]

    try:
        resume_text = extract_text_from_pdf(file)
    except Exception as e:
        return jsonify({"error": f"Failed to read resume: {str(e)}"}), 500

    # Matching JD with Resume using TF-IDF and Cosine Similarity
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(jd_df["Processed_JD"].tolist() + [resume_text])

    cosine_sim = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])
    jd_df["Match_Score"] = cosine_sim[0] * 100 * (6)  # Convert to percentage

    # Best matched job
    best_match = jd_df.loc[jd_df["Match_Score"].idxmax()]

    # Select relevant fields for frontend
    all_matches = jd_df[["Job Title", "Match_Score"]].sort_values(by="Match_Score", ascending=False).to_dict(orient="records")
    best_match_data = {
        "Job Title": best_match["Job Title"],
        "Match_Score": best_match["Match_Score"]
    }

    return jsonify({
        "best_match": best_match_data,
        "all_matches": all_matches
    })

if __name__ == "__main__":
    app.run(debug=True)
