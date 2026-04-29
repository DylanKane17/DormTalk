# 🎓 DormTalk

A modern social platform connecting high school and college students with privacy-focused features, content moderation, and community engagement tools.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?style=flat&logo=react)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=flat&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [User Types](#-user-types)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Database Setup](#-database-setup)
- [Environment Variables](#-environment-variables)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Functionality

- 🔐 **Secure Authentication** - Email/password authentication with Supabase Auth
- 👤 **User Profiles** - Customizable profiles with bio, interests, and school information
- 📝 **Posts & Comments** - Create, edit, and delete posts with threaded comments
- 💬 **Direct Messaging** - Real-time private messaging between users
- 🔍 **Search** - Search for posts and user profiles
- ⬆️⬇️ **Voting System** - Upvote/downvote posts and comments
- 🚩 **Content Moderation** - Flag inappropriate content and moderation dashboard
- 🎨 **Dark/Light Mode** - Theme toggle with persistent preferences

### User Types

- 🏫 **High School Students** - Anonymous posting and messaging options
- 🎓 **College Students** - Verified .edu email authentication

### Advanced Features

- 🛡️ **Content Filtering** - Automated inappropriate language detection
- 👮 **Admin System** - Dedicated admin dashboard for content management
- 🔄 **Password Reset** - Email-based password recovery
- 📱 **Responsive Design** - Mobile-first, fully responsive UI
- 🎯 **School Autocomplete** - Smart school selection with 4,000+ institutions

## 🛠 Tech Stack

### Frontend

- **Framework**: [Next.js 16.2.1](https://nextjs.org/) (App Router)
- **UI Library**: [React 19.2.4](https://reactjs.org/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **State Management**: React Context API

### Backend

- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage

### Development Tools

- **Linting**: ESLint 9
- **Package Manager**: npm
- **Version Control**: Git

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account ([sign up here](https://supabase.com))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/DylanKane17/DormTalk.git
   cd dorm-talk
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up the database**

   Run the SQL migrations in your Supabase SQL Editor (in order):
   - `USER_TYPES_MIGRATION.sql` - Core user types and profile setup
   - `DELETE_USER_COMPLETE_FIX.sql` - User deletion functionality
   - `FIX_PROFILE_TRIGGER.sql` - Profile creation triggers
   - `VOTING_MIGRATION.md` - Voting system setup
   - `MESSAGING_MIGRATION.md` - Messaging system setup

   See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for detailed steps.

5. **Configure admin access**

   Edit `src/app/config/admin.js` and set your admin email:

   ```javascript
   export const ADMIN_EMAIL = "your-email@example.com";
   ```

6. **Run the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 👥 User Types

### High School Students

- **Signup**: Username, email (any), password, age confirmation (16+)
- **Features**:
  - ✅ Anonymous posting
  - ✅ Anonymous messaging
  - ✅ All standard features
- **Privacy**: Username hidden when posting/messaging anonymously

### College Students

- **Signup**: Username, .edu email (verified), password, school selection
- **Features**:
  - ✅ All standard features
  - ❌ No anonymous posting
  - ❌ No anonymous messaging
- **Verification**: Email domain must match selected institution

## 🎯 Key Features

### Posts & Comments

- Create, edit, and delete posts
- Threaded comments with voting
- Anonymous posting (high school students only)
- Content moderation and flagging
- Vote counts and sorting

### Messaging System

- Direct one-on-one messaging
- Real-time message delivery
- Anonymous messaging (high school students only)
- Message history and conversations

### Search & Discovery

- Search posts by title and content
- Search users by username and school
- Advanced filtering options
- Real-time search results

### Moderation Dashboard

- View all flagged content
- Approve or hide posts
- Delete inappropriate content
- Admin-only access
- Audit trail for actions

### Voting System

- Upvote/downvote posts and comments
- Real-time vote counts
- Visual feedback for user votes
- Score calculation (upvotes - downvotes)

## 📁 Project Structure

```
dorm-talk/
├── src/
│   └── app/
│       ├── actions/           # Server actions
│       │   ├── authActions.js
│       │   ├── postActions.js
│       │   ├── commentActions.js
│       │   ├── messageActions.js
│       │   ├── voteActions.js
│       │   ├── searchActions.js
│       │   ├── moderationActions.js
│       │   └── adminActions.js
│       ├── components/        # React components
│       │   ├── Navigation.js
│       │   ├── PostCard.js
│       │   ├── CommentCard.js
│       │   ├── VoteButtons.js
│       │   ├── Button.js
│       │   ├── Input.js
│       │   └── ...
│       ├── context/          # React context
│       │   └── ThemeContext.js
│       ├── utils/            # Utility functions
│       │   ├── supabase/
│       │   │   ├── client.js
│       │   │   ├── server.js
│       │   │   ├── auth.js
│       │   │   └── crud.js
│       │   ├── moderation.js
│       │   └── adminCheck.js
│       ├── config/           # Configuration
│       │   └── admin.js
│       ├── data/             # Static data
│       │   └── schools.js
│       ├── auth/             # Auth pages
│       ├── posts/            # Post pages
│       ├── messages/         # Messaging pages
│       ├── profile/          # Profile pages
│       ├── search/           # Search page
│       ├── moderation/       # Admin dashboard
│       ├── layout.js         # Root layout
│       ├── page.js           # Home page
│       └── globals.css       # Global styles
├── public/                   # Static assets
├── .env.local               # Environment variables
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind configuration
└── next.config.mjs          # Next.js configuration
```

## 🗄 Database Setup

### Required Tables

- `profiles` - User profiles and settings
- `posts` - User posts
- `comments` - Post comments
- `messages` - Direct messages
- `conversations` - Message threads
- `votes` - Post/comment votes
- `comment_votes` - Comment-specific votes

### Key Features

- Row Level Security (RLS) policies
- Cascade delete constraints
- Automated triggers for profile creation
- Email domain validation
- Content moderation flags

See [DATABASE_MIGRATION.md](./DATABASE_MIGRATION.md) for complete schema and setup instructions.

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Change for production
```

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and anon/public key

## 📚 Documentation

Comprehensive documentation is available in the repository:

### Setup & Configuration

- [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) - Complete setup guide
- [QUICK_START.md](./QUICK_START.md) - Quick start guide
- [DATABASE_MIGRATION.md](./DATABASE_MIGRATION.md) - Database setup

### Features

- [FEATURES_DOCUMENTATION.md](./FEATURES_DOCUMENTATION.md) - All features overview
- [USER_TYPES_FEATURES.md](./USER_TYPES_FEATURES.md) - User types documentation
- [VOTING_MIGRATION.md](./VOTING_MIGRATION.md) - Voting system
- [MESSAGING_MIGRATION.md](./MESSAGING_MIGRATION.md) - Messaging system
- [CONTENT_MODERATION.md](./CONTENT_MODERATION.md) - Content filtering
- [ADMIN_SYSTEM.md](./ADMIN_SYSTEM.md) - Admin dashboard
- [PASSWORD_RESET_FEATURE.md](./PASSWORD_RESET_FEATURE.md) - Password recovery

### Troubleshooting

- [DATABASE_FIX_GUIDE.md](./DATABASE_FIX_GUIDE.md) - Database issues
- [PROFILE_CREATION_FIX.md](./PROFILE_CREATION_FIX.md) - Profile creation
- [DELETE_ACCOUNT_COMPLETE_GUIDE.md](./DELETE_ACCOUNT_COMPLETE_GUIDE.md) - Account deletion

## 🎨 UI/UX Features

- **Responsive Design** - Works on all device sizes
- **Dark Mode** - System-aware theme with manual toggle
- **Accessible** - WCAG compliant components
- **Modern UI** - Clean, intuitive interface
- **Loading States** - Smooth loading indicators
- **Error Handling** - User-friendly error messages
- **Form Validation** - Real-time input validation

## 🔒 Security Features

- **Authentication** - Secure email/password authentication
- **Authorization** - Role-based access control
- **RLS Policies** - Database-level security
- **Content Filtering** - Automated inappropriate content detection
- **Email Verification** - .edu domain validation for college students
- **CSRF Protection** - Built-in Next.js protection
- **XSS Prevention** - React's built-in XSS protection

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- Render

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## 🐛 Known Issues

- See [GitHub Issues](https://github.com/DylanKane17/DormTalk/issues) for current bugs and feature requests

## 📄 License

This project is private and proprietary. All rights reserved.

## 👨‍💻 Author

**Dylan Kane**

- GitHub: [@DylanKane17](https://github.com/DylanKane17)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

For support and questions:

- Check the [documentation](#-documentation)
- Review [troubleshooting guides](#-documentation)
- Open an [issue](https://github.com/DylanKane17/DormTalk/issues)

---

Made with ❤️ for students, by students
