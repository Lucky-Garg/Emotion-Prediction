# 🧠 Emotion Prediction

A **NLP-based Emotion Prediction System** that analyzes text and predicts the underlying emotion using a trained **BiGRU deep learning model**.

The application provides a **FastAPI REST API** along with a simple web interface where users can enter text and receive the predicted emotion, confidence score, and probability distribution across all supported emotions.

> **Supported emotions:** 😢 Sadness · 😄 Joy · ❤️ Love · 😠 Anger · 😨 Fear · 😲 Surprise

---

## ✨ Features

* 🧠 **Deep Learning-based emotion classification**
* 📝 Text preprocessing and normalization
* 🔤 Tokenization using a trained tokenizer
* 📏 Sequence padding and truncation
* 🔄 **BiGRU-based text classification**
* 📊 Confidence score for the predicted emotion
* 📈 Probability distribution for all emotion classes
* ⚡ FastAPI REST API
* 🩺 Health-check endpoint
* 🌐 Built-in web interface
* 🔐 CORS support for frontend/API integration
* 🚀 Modern Python dependency management using `uv`

---

## 🏗️ System Architecture

```text
                    User Input
                        │
                        ▼
              ┌──────────────────┐
              │   FastAPI Server  │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Text Preprocessing│
              │                  │
              │ • Lowercase      │
              │ • Remove apostrophe│
              │ • Remove symbols │
              │ • Remove spaces  │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │     Tokenizer    │
              │ Text → Integers  │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Sequence Padding │
              │   Max Length=50  │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │   BiGRU Model     │
              │   Deep Learning   │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Emotion Probabilities│
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Predicted Emotion│
              │ + Confidence     │
              └──────────────────┘
```

---

## 🔄 How It Works

### 1. User enters text

Example:

```text
I am extremely happy today!
```

### 2. Text preprocessing

The input is normalized before being passed to the model.

The preprocessing pipeline:

```text
Raw Text
   ↓
Convert to lowercase
   ↓
Remove apostrophes
   ↓
Remove special characters
   ↓
Remove extra whitespace
   ↓
Cleaned text
```

For example:

```text
"I CAN'T believe this is amazing!!!"
```

becomes approximately:

```text
"i cant believe this is amazing"
```

### 3. Tokenization

The trained tokenizer converts words into numerical token IDs.

```text
"i feel happy"

        ↓

[12, 45, 87]
```

The same tokenizer used during model training is loaded from:

```text
Artifacts/tokenizer.pkl
```

### 4. Sequence Padding

The tokenized sequence is padded/truncated to a fixed maximum length of **50 tokens**.

```text
[12, 45, 87]
        ↓
[12, 45, 87, 0, 0, 0, ...]
```

This ensures that every input has the same shape before being passed to the neural network.

### 5. BiGRU Prediction

The processed sequence is passed to the trained **Bidirectional GRU (BiGRU)** model.

The model produces probabilities for six emotion classes:

```text
sadness
joy
love
anger
fear
surprise
```

### 6. Final Prediction

The emotion with the highest probability is selected as the predicted emotion.

The API also returns the probability distribution for every emotion.

---

## 🧩 Technology Stack

| Category            | Technologies                     |
| ------------------- | -------------------------------- |
| Language            | Python                           |
| NLP                 | Text Preprocessing, Tokenization |
| Machine Learning    | TensorFlow, Keras                |
| Deep Learning       | BiGRU                            |
| Numerical Computing | NumPy                            |
| Backend             | FastAPI                          |
| API Server          | Uvicorn                          |
| Validation          | Pydantic                         |
| Frontend            | HTML, CSS, JavaScript            |
| Package Management  | uv                               |
| Version Control     | Git, GitHub                      |

---

## 📁 Project Structure

```text
Emotion-Prediction/
│
├── Artifacts/
│   ├── BiGRU_Model.keras
│   └── tokenizer.pkl
│
├── src/
│   └── emotion_prediction/
│       └── __init__.py
│
├── static/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── main.py
├── pyproject.toml
├── uv.lock
├── .python-version
├── .gitignore
└── README.md
```

### Important files

**`main.py`**

Contains the FastAPI application, model loading, preprocessing pipeline, API endpoints, and prediction logic.

**`Artifacts/BiGRU_Model.keras`**

Trained BiGRU emotion classification model.

**`Artifacts/tokenizer.pkl`**

Tokenizer saved during model development and reused during inference.

**`static/`**

Contains the frontend interface for interacting with the emotion prediction system.

**`pyproject.toml`**

Defines the project's Python dependencies and configuration.

**`uv.lock`**

Locks dependency versions to make the environment reproducible.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

* Python installed
* Git installed
* `uv` installed

You can verify Python:

```bash
python --version
```

and uv:

```bash
uv --version
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/Lucky-Garg/Emotion-Prediction.git
```

Move into the project directory:

```bash
cd Emotion-Prediction
```

---

## 2. Install Dependencies

This project uses **uv** for dependency management.

Create/synchronize the project environment:

```bash
uv sync
```

This installs the dependencies specified by the project configuration and lock file.

---

## 3. Start the FastAPI Server

Run:

```bash
uv run uvicorn main:app --reload
```

You should see something similar to:

```text
INFO:     Uvicorn running on http://127.0.0.1:8000
```

---

## 4. Open the Application

### Web Interface

Open:

```text
http://127.0.0.1:8000
```

### FastAPI Swagger Documentation

Open:

```text
http://127.0.0.1:8000/docs
```

The Swagger interface allows you to test the API directly from your browser.

---

# 🔌 API Documentation

## `GET /`

Returns the application's web interface.

```http
GET /
```

---

## `GET /health`

Checks whether the server and required model components are loaded.

```http
GET /health
```

Example response:

```json
{
  "status": "Server is running",
  "model_loaded": true
}
```

---

## `POST /predict`

Predicts the emotion expressed in the provided text.

### Request

```http
POST /predict
```

Request body:

```json
{
  "text": "I feel so happy and excited"
}
```

### Response

```json
{
  "text": "I feel so happy and excited",
  "predicted_emotion": "joy",
  "confidence": 0.91,
  "all_probabilites": {
    "sadness": 0.01,
    "joy": 0.91,
    "love": 0.02,
    "anger": 0.01,
    "fear": 0.03,
    "surprise": 0.02
  }
}
```

> The numerical confidence values above are an example. Actual values depend on the trained model's prediction.

---

# 🧪 Example Predictions

| Input                                      | Possible Prediction |
| ------------------------------------------ | ------------------- |
| `I am so happy today!`                     | 😄 Joy              |
| `I miss the people I love.`                | ❤️ Love             |
| `I am scared of what might happen.`        | 😨 Fear             |
| `This situation makes me extremely angry.` | 😠 Anger            |
| `I feel completely broken.`                | 😢 Sadness          |
| `Wow! I didn't expect that.`               | 😲 Surprise         |

---

# 🧠 Model Inference Pipeline

The prediction process implemented in the API can be summarized as:

```text
Input Text
    │
    ▼
Preprocessing
    │
    ├── Lowercase
    ├── Remove apostrophes
    ├── Remove special characters
    └── Normalize whitespace
    │
    ▼
Tokenizer
    │
    ▼
Integer Sequence
    │
    ▼
Padding / Truncation
    │
    ▼
BiGRU Neural Network
    │
    ▼
Softmax Probabilities
    │
    ├── Sadness
    ├── Joy
    ├── Love
    ├── Anger
    ├── Fear
    └── Surprise
    │
    ▼
Predicted Emotion
    +
Confidence Score
```

---

# ⚡ Application Lifecycle

The model and tokenizer are loaded **once when the FastAPI application starts**, instead of loading them for every prediction request.

```text
Server Start
     │
     ▼
Load BiGRU Model
     │
     ▼
Load Tokenizer
     │
     ▼
Server Ready
     │
     ▼
Receive Requests
     │
     ▼
Run Predictions
     │
     ▼
Server Shutdown
     │
     ▼
Clear Loaded Resources
```

This avoids repeatedly loading the model and improves the efficiency of inference requests.

---

# 🛡️ Input Validation

The API validates incoming text using Pydantic.

The `/predict` endpoint accepts:

* Minimum length: **1 character**
* Maximum length: **2000 characters**

Example:

```json
{
  "text": "I feel amazing today!"
}
```

Invalid or missing input is rejected by FastAPI's request validation.

---

# 🌐 CORS Support

The backend includes CORS middleware so that the API can communicate with frontend applications hosted on different origins.

This makes it easier to integrate the model with:

* Web applications
* React applications
* Mobile applications
* Other backend services

---

# 📌 Current Limitations

* The model currently supports six predefined emotion classes.
* Predictions are limited to the patterns learned during training.
* Very short or ambiguous text may produce less reliable predictions.
* The model is designed for English text.
* Confidence represents the model's output probability and should not be interpreted as guaranteed correctness.

---

# 🔮 Future Improvements

Potential improvements include:

* [ ] Add more emotion categories
* [ ] Improve preprocessing for emojis and slang
* [ ] Support multilingual emotion prediction
* [ ] Experiment with LSTM, Transformer and BERT-based architectures
* [ ] Add model evaluation metrics and confusion matrix
* [ ] Add batch prediction support
* [ ] Add prediction history
* [ ] Containerize the application using Docker
* [ ] Deploy the API to a cloud platform
* [ ] Add automated tests
* [ ] Add CI/CD using GitHub Actions

---

# 📚 Learning Outcomes

This project demonstrates practical experience with:

* Natural Language Processing
* Text preprocessing
* Tokenization
* Sequence padding
* Deep learning for NLP
* Recurrent Neural Networks
* Bidirectional GRU architecture
* Model inference
* REST API development
* FastAPI
* Pydantic data validation
* Application lifecycle management
* Frontend-backend integration
* Python dependency management with `uv`
* Git and GitHub

---

# 👨‍💻 Author

**Lucky Garg**

Computer Science Engineering Student

GitHub: [Lucky-Garg](https://github.com/Lucky-Garg)

---

# ⭐ If You Like This Project

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---
