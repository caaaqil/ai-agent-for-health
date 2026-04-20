# 🏥 AI Health Assistant

<p align="center">
  <img src="docs/images/hero.png" width="800" alt="AI Health Assistant Hero">
</p>

<p align="center">
  <strong>Your Personalized, Local AI Companion for Fitness, Nutrition, and Wellness.</strong>
</p>

---

## 🚀 Key Features

<p align="center">
  <img src="docs/images/features.png" width="800" alt="Features Showcase">
</p>

-   **🤖 AI Health Chat**: Secure, local conversation about fitness, nutrition, and wellness.
-   **🥗 Meal Analysis**: Instant nutritional breakdown (Calories, Protein, Fat) with smart advice.
-   **🏋️ Workout Planner**: Goal-oriented 7-day workout plans tailored to your needs.
-   **📊 Health Dashboard**: Sleek visualization of your health data and progress.
-   **🔐 Secure Profiles**: Full control over your health data with local authentication.

---

## 🛠️ Tech Stack

<div align="center">

| Area | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **AI Engine** | Ollama (Llama 3, Phi-3) |

</div>

---

## ⚙️ Prerequisites

-   [Node.js](https://nodejs.org/) (v16.x or later)
-   [MongoDB](https://www.mongodb.com/) installed and running
-   [Ollama](https://ollama.com/) running with `llama3` and `phi3` models

---

## 🛠️ Quick Start

### 1. Repository Setup
```bash
git clone https://github.com/caaaqil/ai-agent-for-health.git
cd ai-agent-for-health
```

### 2. Backend Configuration
```bash
cd backend
npm install
```

Run server:
```bash
npm start
```

### 3. Frontend Configuration
```bash
cd ../frontend
npm install
npm run dev
```

### 4. AI Models (Ollama)
```bash
ollama pull llama3
ollama pull phi3:latest
```

---

## 📁 Project Structure

```text
├── backend/            # Express.js Server & AI Controllers
├── frontend/           # React + Tailwind Dashboard
├── docs/               # Visual assets and documentation
└── README.md           # Main documentation
```

---

## 🤝 Contributing

We welcome contributions! Please open an issue or submit a PR.

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
