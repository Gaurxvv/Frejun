# 📊 Comments Dashboard

A modern React dashboard for managing comments with search, inline editing, and responsive design.

![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1.11-38B2AC)

## ✨ Features

- **Real-time Search** - Filter by email, name, or body
- **Inline Editing** - Edit comments directly in the table
- **Data Persistence** - Changes saved to localStorage
- **Responsive Design** - Works on desktop and mobile
- **Pagination** - Navigate through large datasets

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## 🛠️ Tech Stack

- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **JSONPlaceholder API** for sample data

## 📁 Project Structure

```
src/
├── components/     # UI components (Button, Input, Table, etc.)
├── lib/utils.ts    # Utility functions
├── App.tsx         # Main component
└── App.css         # Global styles
```

## 🎯 Usage

1. **Search**: Use the search bar to filter comments
2. **Edit**: Click pencil icon to edit name/body
3. **Save**: Click checkmark to save changes
4. **Navigate**: Use pagination controls at bottom

## 📱 Mobile

- Card-based layout on mobile devices
- Touch-friendly interface
- Responsive design with Tailwind CSS

## 🚀 Deploy

```bash
npm run build
```

Deploy the `dist` folder to any static hosting service.

---

**Built with React, TypeScript, and Tailwind CSS**
