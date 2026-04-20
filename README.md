# 🏥 AI Health Assistant

![AI Health Assistant Hero](file:///home/caaqil/.gemini/antigravity/brain/1a2f1516-d165-482f-a7db-46a5ff8b5f61/hero_health_ai_1776693703452.png)

A professional, local AI-powered platform designed to help users track their health, analyze meals, and generate personalized workout plans. Built with performance and privacy in mind, utilizing **Ollama** for localized LLM execution.

---

## 🚀 Key Features

![Project Features Showcase](file:///home/caaqil/.gemini/antigravity/brain/1a2f1516-d165-482f-a7db-46a5ff8b5f61/feature_showcase_1776693742664.png)

-   **🤖 AI Health Chat**: Get instant answers to your fitness, nutrition, and wellness questions from a specialized AI assistant.
-   **🥗 Meal Analysis**: Input your meals and receive a detailed nutritional breakdown (Calories, Protein, Fat) along with expert advice.
-   **🏋️ Workout Planner**: Generate customized 7-day workout plans tailored to your specific fitness goals.
-   **📊 Health Dashboard**: Visualize your progress and manage your health data in one sleek, modern interface.
-   **🔐 Secure Profiles**: Personalized experience with secure user authentication and profile management.

---

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)

### Backend
-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/)
-   **AI Engine**: [Ollama](https://ollama.com/) (running `llama3` and `phi3`)

---

## ⚙️ Prerequisites

-   [Node.js](https://nodejs.org/) (v16.x or later)
-   [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)
-   [Ollama](https://ollama.com/) installed and running locally

---

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ai-health-assistant.git
cd ai-health-assistant
```

### 2. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    Create a `.env` file in the `backend` folder:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/health-assistant
    OLLAMA_URL=http://127.0.0.1:11434/api/generate
    AI_MODEL=llama3
    ```
4.  Start the backend server:
    ```bash
    npm start
    ```

### 3. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

### 4. AI Setup (Ollama)
Ensure Ollama is running and you have pulled the required models:
```bash
ollama pull llama3
ollama pull phi3:latest
```

---

## 📁 Project Structure

```text
├── backend/
│   ├── controllers/    # AI and Auth logic
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   └── server.js       # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Main application views
│   │   └── services/   # API communication
│   └── vite.config.js
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.
