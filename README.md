# Markdeck

A modern, feature-rich Markdown editor with live preview and PDF export.

![Version](https://img.shields.io/badge/version-1.0.0-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Core
- **Live Preview** - See your formatted document as you type
- **PDF Export** - Download your markdown as a professional PDF
- **File Upload** - Import existing `.md`, `.markdown`, or `.txt` files
- **HTML Copy** - Copy the rendered HTML to clipboard

### Quick Wins
- 🖱️ **Drag & Drop** - Drag files directly onto the editor
- 💾 **Auto-save** - Your work is automatically saved to localStorage
- ⌨️ **Keyboard Shortcuts** - Boost productivity with shortcuts
- 📥 **Download .md** - Export your raw markdown
- 🔤 **Custom Filename** - Set your own PDF filename
- 🖥️ **Fullscreen Mode** - Distraction-free writing

### Theming
- 🌙 **Dark/Light Mode** - Toggle between themes
- 💜 **Modern Purple Theme** - Beautiful gradient design
- 🎨 **Lucide Icons** - Clean, consistent iconography

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + B` | **Bold** |
| `Ctrl + I` | *Italic* |
| `Ctrl + K` | [Link](url) |
| `Ctrl + \`` | `Code` |
| `Ctrl + S` | Save as .md |

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite** - Build tool & dev server
- **marked.js** - Markdown parsing
- **Puppeteer** - PDF generation (headless Chrome)
- **Lucide React** - Icons

## 📁 Project Structure

```
markdeck/
├── public/
│   └── icon___1.png      # Favicon
├── src/
│   ├── components/       # React components
│   ├── hooks/            # Custom hooks
│   ├── styles/           # CSS files
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/markdeck.git

# Navigate to project directory
cd markdeck

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎨 Customization

- **Colors** - Edit CSS variables in `src/index.css`
- **Components** - Modify components in `src/components/`
- **Logic** - Business logic is in `src/hooks/`

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

---

Made with 💜 using React + Vite
