# CodeForge 🛠️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.39.7-green)](https://supabase.io/)

A real-time collaborative code editor with integrated AI assistance, terminal support, and seamless team collaboration features.

## 🚀 Features

- **Real-time Collaboration**
  - Multi-user editing with cursor presence
  - Live collaboration status
  - Invite system with email and link sharing
  
- **Advanced Editor**
  - Monaco Editor integration
  - Multi-language support with syntax highlighting
  - Custom language icons for file types
  - File tree navigation

- **Development Tools**
  - Integrated terminal
  - Command history
  - File upload/download
  - Project templates

- **AI Assistant**
  - Context-aware code suggestions
  - Real-time code analysis
  - Natural language interactions

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| Frontend | Next.js 15.1.6, React 19.0.0, TypeScript 5 |
| Editor | Monaco Editor, Y.js |
| Real-time | Y-WebSocket, Y-Monaco |
| Terminal | XTerm.js |
| Authentication | Supabase Auth |
| Database | Supabase |
| Styling | Tailwind CSS 3.4.1 |
| Icons | Lucide React |

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/Owusu1946/CodeForge
cd codeforge
```

2. Install dependencies
```bash
npm install --legacy-peer-deps
```

3. Setup environment variables
```bash
cp .env.example .env.local
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_URL=https://your_superbase_url.supabase.co
NEXT_PUBLIC_BASE_URL=http://localhost:3000 
```

4. Start the development server
```bash
npm run dev
```
## 🏗️ Project Structure
```plaintext
codeforge/
├── src/
│ ├── app/ # Next.js app router
│ ├── components/ # React components
│ ├── contexts/ # React contexts
│ ├── lib/ # Utilities and services
│ └── types/ # TypeScript types
├── public/ # Static assets
└── tailwind.config.js # Tailwind configuration
```


## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your fork
5. Submit a pull request

## 📝 Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## 🔒 Security

For security issues, please email security@codeforge.dev instead of using the issue tracker.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Supabase](https://supabase.io/)
- [Y.js](https://yjs.dev/)
- [XTerm.js](https://xtermjs.org/)

## 📊 Version History

| Version | Date | Description |
|---------|------|-------------|
| 0.1.0 | Current | Initial release with core features |

## 🔗 Links

- [Documentation](https://docs.codeforge.dev)
- [Demo](https://demo.codeforge.dev)
- [Issue Tracker](https://github.com/yourusername/codeforge/issues)

## 💻 Development Status

Current version: 0.1.0 (Beta)

For the latest updates and roadmap, please visit our [project board](https://github.com/Owusu1946/codeforge).