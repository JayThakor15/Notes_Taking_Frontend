# 📝 NotesHive Frontend

A modern, responsive frontend for the NotesHive note-taking platform. Built with React, Vite, and Tailwind CSS.

![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=flat&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-38B2AC?style=flat&logo=tailwind-css)

## ✨ Features

### 🎨 Modern UI/UX

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Notepad Background Theme** - Realistic notepad paper effect
- **Smooth Animations** - Modern transitions and feedback
- **Custom Toast System** - Beautiful notification system
- **Dark/Light Mode** - Built-in theme toggle

### 🔐 Authentication

- **Email/Password Login & Register** - Secure authentication
- **Google OAuth** - Sign in with Google
- **Protected Routes** - Route-level authentication
- **Persistent Sessions** - Local storage token management

### 🗒️ Notes Management

- **Create, View, Update, Delete Notes** - Full CRUD for notes
- **AI Suggestions** - Generate note content with AI
- **Download as PDF** - Export notes to PDF
- **Profile Details** - User profile with profile picture

## 🛠️ Tech Stack

- **React 18+** - Modern React features
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **Material UI** - UI component library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls

## 🚀 Quick Start

### Demo User Credentials

- email: demo@noteshive.com
- password: demo123

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/YourUsername/NotesHiveFrontend.git
cd NotesHiveFrontend/Frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

```
https://noteshivee.netlify.app/
```

## 📁 Project Structure

```
Frontend/
├── public/
│   └── Logo.png              # App logo
├── src/
│   ├── components/           # Reusable components
│   ├── pages/                # Page components (Dashboard, SignIn, SignUp, etc.)
│   ├── utils/                # Utility functions
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── tailwind.config.js        # Tailwind configuration
├── vite.config.ts            # Vite configuration
└── package.json
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🌐 API Integration

The frontend connects to the NotesHive backend API:

- **Production**: `https://notes-taking-backend-5ewv.onrender.com`
- **Development**: `http://localhost:5000`

### Key API Endpoints Used

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/notes` - Fetch notes
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/ai` - AI content suggestion

## 🎨 Styling & Theming

### Tailwind CSS Configuration

- Custom color palette
- Responsive breakpoints
- Notepad background utilities
- Animation classes

### Component Library

- Material UI for consistent design
- Custom toast notifications
- Reusable UI components

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Responsive layouts for tablets
- **Desktop Enhanced** - Rich desktop experience

## 🚀 Deployment

### Netlify (Recommended)

1. **Build the project**

```bash
npm run build
```

2. **Deploy to Netlify**

- Connect your GitHub repository
- Set build command: `npm run build`
- Set publish directory: `dist`

### Manual Deployment

1. **Build for production**

```bash
npm run build
```

2. **Deploy the `dist` folder** to your hosting provider

## 🔒 Environment Variables

- Google OAuth client ID (for Google login)
- API base URL (if needed)

## 🎯 Features in Detail

### Authentication Flow

- Secure JWT token management
- Google OAuth integration
- Automatic token validation
- Redirect handling for protected routes

### Notes Management

- Create, update, view, and delete notes
- AI-powered content suggestions
- Download notes as PDF
- Notepad-style backgrounds

### User Experience

- Smooth page transitions
- Loading states for all actions
- Error handling with user feedback
- Responsive navigation
- Dark/light mode toggle

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Jay Thakor**

- LinkedIn: [Jay Thakor](https://www.linkedin.com/in/jay-thakor-39a580217/)
- GitHub: [JayThakor15](https://github.com/JayThakor15)

---

⭐ **Star this repository if you found it helpful!**

🐛 **Found a bug?** [Open an issue](https://github.com/JayThakor15/NotesHiveFrontend/issues)
