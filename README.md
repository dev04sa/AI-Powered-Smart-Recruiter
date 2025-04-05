

# 🤖 Multi-Agent AI Recruitment System

An AI-powered, full-stack solution to automate resume screening, match candidates to job descriptions, and schedule interviews — eliminating manual effort and increasing recruitment efficiency.  

![Banner](https://img.shields.io/badge/Built%20With-Python%20%7C%20Next.js%20%7C%20NLP%20%7C%20SQLite-blue?style=for-the-badge)

---

## 📌 Table of Contents
- [🔍 Problem Statement](#-problem-statement)
- [💡 Proposed Solution](#-proposed-solution)
- [⚙️ Features](#️-features)
- [🧠 Tech Stack](#-tech-stack)
- [🔄 Project Flow](#-project-flow)
- [🧪 How to Run](#-how-to-run)
- [📊 Output Examples](#-output-examples)
- [✅ Conclusion](#-conclusion)
- [📸 Screenshots / Diagrams](#-screenshots--diagrams)

---

## 🔍 Problem Statement

Recruiters spend hours manually screening resumes against job descriptions, which leads to inefficiencies, errors, and delays. This project aims to automate the **end-to-end recruitment process** using AI agents.

---

## 💡 Proposed Solution

We built a **multi-agentic AI system** that:

1. 📝 Reads and **summarizes job descriptions** (JDs).
2. 📄 Extracts **key details from resumes**.
3. 🤝 Matches resumes to JDs using **AI similarity algorithms**.
4. ✅ **Shortlists candidates** based on match score.
5. 📧 Sends **personalized interview invitations** to selected candidates.

This creates a seamless recruitment pipeline that’s fast, scalable, and intelligent.

---

## ⚙️ Features

✨ **NLP-based Resume & JD Parsing**  
✨ **AI-driven Candidate-JD Matching**  
✨ **TF-IDF + Cosine Similarity Scoring**  
✨ **Shortlist Candidates by Match %**  
✨ **SQLite for Long-Term Memory**  
✨ **Automated Email Scheduling**  
✨ **Next.js Frontend Integration**

---

## 🧠 Tech Stack

| Layer            | Technology / Tool               | Purpose                                      |
|------------------|----------------------------------|----------------------------------------------|
| 🖥️ Frontend      | `Next.js`, `React`              | Resume/Job Upload Interface & Output Display |
| ⚙️ Backend       | `Python`, `FastAPI / Flask`     | Core logic for matching & processing         |
| 🧠 NLP           | `SpaCy`, `TF-IDF`, `Cosine Similarity` | Text extraction & similarity scoring   |
| 📄 Resume Parsing| `pdfplumber`                    | Extract structured data from PDF resumes     |
| 🗃️ Database      | `SQLite`                        | Store JDs, resumes, and match results        |
| 📬 Email         | `smtplib`, `email.mime`         | Send automated interview emails              |
| 📊 Data Handling | `pandas`                        | Process and structure job/resume data        |

---

## 🔄 Project Flow

```
1. Upload JD (CSV) and Resume (PDF) via Next.js interface
2. Backend parses JD using NLP (extracts skills, experience, etc.)
3. Resume is read and processed using pdfplumber + NLP
4. Resume and JD are vectorized using TF-IDF
5. Cosine similarity is used to calculate match score
6. If match score ≥ 80%, candidate is shortlisted
7. Interview email is sent automatically
8. All data stored in SQLite DB
```

---

## 🧪 How to Run

### 🐍 Backend (Python)
```bash
git clone https://github.com/your-repo/multiagent-recruitment.git
cd backend
pip install -r requirements.txt
python app.py
```

### 🌐 Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

### 🔍 Upload Files
- Job Descriptions (CSV)
- Candidate Resumes (PDF)

---

## 📊 Output Examples

✅ **Match Score:**  
- Candidate A → JD X: 92% ✅  
- Candidate B → JD Y: 76% ❌  

✅ **Email Sent:**  
> “Hi [Candidate], you’ve been shortlisted for the [Job Title] role. Please select your preferred interview slot...”

✅ **SQLite Entry:**  
```sql
| Candidate     | Job Title     | Match Score | Shortlisted |
|---------------|---------------|-------------|-------------|
| John Doe      | Backend Dev   | 91%         | Yes         |
| Jane Smith    | Data Analyst  | 68%         | No          |
```

---

## ✅ Conclusion

This system **automates the recruitment pipeline** by eliminating manual resume screening. It improves:
- 🔹 **Efficiency**: Reduces hours of manual work.
- 🔹 **Accuracy**: AI ensures precise job-candidate alignment.
- 🔹 **Scalability**: Can process thousands of resumes in seconds.
- 🔹 **Engagement**: Automated follow-ups keep the hiring process smooth.

It’s a smart, scalable solution that brings AI to real-world HR workflows.

---

## 📸 Screenshots / Diagrams

- ✅ Flow Diagram  
- ✅ Architecture Design  
- ✅ Screenshot of Uploaded Resume  
- ✅ Match Results View  
*(Add images here when hosted or uploaded)*

---

Made with ❤️ by us
🛠️ Contributions welcome!
