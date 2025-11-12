# Question Paper Generator System

A full-stack MERN (MongoDB, Express, React, Node.js) application with TypeScript for creating, managing, and organizing question papers in a hierarchical structure. The system allows educators to organize questions by subjects and topics, generate unique paper codes, and track student attempts.

## 📖 What is This Project? (For Non-Technical Readers)

**Question Paper Generator System** is a web application designed to help teachers and educators create, organize, and manage question papers for exams and tests. Think of it as a digital filing cabinet that makes it easy to:

- **Organize Questions**: Just like organizing files in folders on your computer, this system lets you organize questions by subjects (like Mathematics, Science) and then by topics within each subject (like Algebra, Geometry under Mathematics).

- **Create Question Papers**: Teachers can easily create complete question papers by selecting questions from their organized collection. Each question paper gets a unique code automatically (like a serial number) so it's easy to identify and reference.

- **Track Student Performance**: The system can record when students attempt a question paper, how long they took, how many questions they answered correctly, and their overall score. This helps teachers understand student progress over time.

- **Search and Find**: Instead of searching through physical files or multiple documents, teachers can quickly search for any subject, topic, or question paper in the system.

**Who Would Use This?**
- Teachers creating test papers for their classes
- Educational institutions managing question banks
- Tutors organizing practice materials for students
- Anyone who needs to create and organize educational assessments

**The Problem It Solves:**
Creating question papers manually can be time-consuming and disorganized. Questions might be scattered across different documents, making it hard to find and reuse them. This system brings everything together in one place, making it quick and easy to create well-organized question papers while keeping track of student performance.

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **TanStack React Query** - Data fetching and state management
- **Shadcn UI** - Modern component library (Radix UI primitives)
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **dotenv** - Environment variable management

### Development Tools
- **Nodemon** - Auto-restart server during development
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 📋 Features

- **Hierarchical Organization**: Subjects → Topics → Question Papers structure
- **Question Management**: Create, edit, and organize questions with:
  - Difficulty levels (Easy, Medium, Hard)
  - Categories and time allocation
  - Multiple choice options
  - Solutions and notes
- **Unique Paper Code Generation**: Automatic generation in format `#_SUBJECT-TOPIC-PAPERID_`
- **Attempt Tracking**: Record and track student attempts with scores
- **Search Functionality**: Search across subjects, topics, and question papers
- **Modern UI**: VS Code-like sidebar interface with responsive design
- **Real-time Updates**: React Query for efficient data synchronization

## 🛠️ Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas account)

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd mern-typescript
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
MONGO_URI=mongodb://localhost:27017/question-paper-generator
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/question-paper-generator?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../question-craft-mastery
npm install
```

## 🚀 Running the Project

### Start MongoDB

**Local MongoDB:**
```bash
# Make sure MongoDB service is running
# On Windows: MongoDB should start automatically if installed as a service
# On Mac/Linux: sudo systemctl start mongod
```

**MongoDB Atlas:**
- No local setup needed, just ensure your connection string in `.env` is correct

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

### Start Frontend Development Server

Open a new terminal window:

```bash
cd question-craft-mastery
npm run dev
```

The frontend will run on `http://localhost:8080`

### Access the Application

Open your browser and navigate to:
```
http://localhost:8080
```

## 📁 Project Structure

```
mern-typescript/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection configuration
│   ├── controllers/
│   │   ├── questionPaperController.js
│   │   ├── subjectController.js
│   │   └── topicController.js
│   ├── models/
│   │   ├── QuestionPaper.js
│   │   ├── Subject.js
│   │   └── Topic.js
│   ├── routes/
│   │   ├── questionPaperRoutes.js
│   │   ├── subjectRoutes.js
│   │   ├── topicRoutes.js
│   │   ├── nestedQuestionPaperRoutes.js
│   │   └── nestedTopicRoutes.js
│   ├── utils/
│   │   └── generatePaperCode.js
│   ├── server.js              # Express server entry point
│   └── package.json
│
└── question-craft-mastery/
    ├── src/
    │   ├── components/        # React components
    │   │   ├── ui/            # Shadcn UI components
    │   │   ├── AddQuestionForm.tsx
    │   │   ├── QuestionPaperForm.tsx
    │   │   ├── QuestionPaperView.tsx
    │   │   ├── Sidebar.tsx
    │   │   ├── SubjectForm.tsx
    │   │   └── TopicForm.tsx
    │   ├── pages/             # Page components
    │   │   ├── Dashboard.tsx
    │   │   ├── AddQuestionPaper.tsx
    │   │   ├── QuestionPaperDetail.tsx
    │   │   └── Search.tsx
    │   ├── services/
    │   │   └── api.ts         # API service functions
    │   ├── types/
    │   │   └── index.ts       # TypeScript type definitions
    │   ├── App.tsx            # Main App component
    │   └── main.tsx           # React entry point
    ├── vite.config.ts
    └── package.json
```

## 🔌 API Endpoints

### Subjects
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:id` - Get subject by ID
- `POST /api/subjects` - Create new subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Topics
- `GET /api/topics` - Get all topics
- `GET /api/topics/:id` - Get topic by ID
- `GET /api/subjects/:subjectId/topics` - Get topics by subject
- `POST /api/subjects/:subjectId/topics` - Create topic under subject
- `PUT /api/topics/:id` - Update topic
- `DELETE /api/topics/:id` - Delete topic

### Question Papers
- `GET /api/question-papers` - Get all question papers
- `GET /api/question-papers/:id` - Get question paper by ID
- `GET /api/question-papers/code/:paperCode` - Get question paper by code
- `GET /api/topics/:topicId/question-papers` - Get question papers by topic
- `POST /api/topics/:topicId/question-papers` - Create question paper
- `PUT /api/question-papers/:id` - Update question paper
- `DELETE /api/question-papers/:id` - Delete question paper
- `POST /api/question-papers/:id/questions` - Add question to paper
- `PUT /api/question-papers/:id/questions/:questionIndex/note` - Update question note
- `POST /api/question-papers/:id/attempts` - Record attempt

## 🏗️ Build for Production

### Build Frontend

```bash
cd question-craft-mastery
npm run build
```

The production build will be in the `dist` directory.

### Start Production Server

```bash
cd backend
npm start
```

## 📝 Environment Variables

### Backend (.env)
- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)

## 🎯 Key Features Implementation

1. **Paper Code Generation**: Automatically generates unique codes like `#_MATH-ALG-001_` based on subject, topic, and sequential paper ID
2. **Hierarchical Data Model**: Three-level structure (Subject → Topic → Question Paper) with proper relationships
3. **Question Management**: Support for multiple question types with difficulty levels, categories, and time allocation
4. **Attempt Tracking**: Records student attempts with timestamps, scores, and performance metrics
5. **Responsive Design**: Modern UI with sidebar navigation similar to VS Code interface

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or your Atlas connection string is correct
- Check firewall settings if using MongoDB Atlas
- Verify credentials in the connection string

### Port Already in Use
- Change the port in backend `.env` file or frontend `vite.config.ts`
- Kill the process using the port: `npx kill-port 5000` or `npx kill-port 8080`

### CORS Errors
- Ensure backend CORS is properly configured
- Check that frontend API URL matches backend server URL

## 📄 License

ISC

## 👤 Author

[Your Name]

---

## 📄 Resume Project Details

**Project Name:** Question Paper Generator System

**Tech Stack:**
- **Frontend:** React 18, TypeScript, Vite, React Router, TanStack React Query, Shadcn UI, Tailwind CSS, React Hook Form, Zod
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Tools:** Git, ESLint, Nodemon

**Description (Technical):**
Developed a full-stack MERN application with TypeScript for creating and managing question papers in a hierarchical structure. The system features a three-level organization (Subjects → Topics → Question Papers) with automatic paper code generation, question management with difficulty levels and categories, attempt tracking for students, and a modern VS Code-like sidebar interface. Implemented RESTful APIs with Express.js, MongoDB for data persistence, and a responsive React frontend with TypeScript for type safety. Utilized React Query for efficient data fetching, Shadcn UI for modern components, and Tailwind CSS for styling.

**Description (Non-Technical/Simple):**
Built a web application that helps teachers and educators create, organize, and manage question papers for exams. The system allows users to organize questions by subjects and topics in a folder-like structure, automatically generates unique codes for each question paper, and tracks student performance including scores and completion times. The application features an intuitive interface similar to popular code editors, making it easy to navigate and manage large collections of educational content. It solves the problem of disorganized question management by providing a centralized platform where educators can quickly create well-structured question papers and monitor student progress.

**GitHub:** [Your GitHub Repository URL]

