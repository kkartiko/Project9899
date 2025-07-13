# Security Tools Hub

A comprehensive web application featuring various cybersecurity assessment tools built with Next.js and TypeScript.

## 🛡️ Features

### Current Tools
- **Security Assessor** - Comprehensive security assessment and vulnerability scanning tool
- **Password Game** - Interactive password strength game inspired by neal.fun
- **Phishing Email Assessor** - Analyze and detect phishing attempts in emails
- **Secure Website Assessor** - Evaluate website security and identify vulnerabilities

### Planned Features
- More security assessment tools coming soon
- Backend integration for actual tool functionality
- User authentication and progress tracking
- Advanced security analytics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd security-tools
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
security-tools/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Home page with tool cards
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   └── ...
├── public/                   # Static assets
└── package.json
```

## 🎨 Design Features

- **Modern UI**: Clean, professional design with gradient backgrounds
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Accessible**: Full keyboard navigation and screen reader support
- **Interactive**: Smooth hover effects and transitions
- **Dark Theme**: Optimized for security-focused applications

## 🔧 Development

### Adding New Tools

To add a new security tool:

1. Add the tool to the `securityTools` array in `src/app/page.tsx`
2. Create the tool's page in `src/app/tools/[tool-name]/page.tsx`
3. Implement the tool's functionality
4. Update the navigation and routing

### Styling

The project uses TailwindCSS for styling. All components are styled using utility classes for consistency and maintainability.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or support, please open an issue on GitHub.

---

Built with ❤️ using Next.js and TailwindCSS
