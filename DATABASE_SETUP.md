# Database & Authentication Setup Guide

## Overview
I've successfully implemented a complete database and authentication system for your sports betting tracker. Here's what has been added:

## ✅ What's Been Implemented

### 1. Database Schema (Prisma)
- **Users**: Authentication, plans, settings
- **Bets**: All betting data with proper relationships
- **Sessions/Accounts**: NextAuth.js integration
- **User Settings**: Preferences and configuration

### 2. Authentication System (NextAuth.js)
- Email/password authentication
- Google OAuth integration
- Secure session management
- Protected API routes

### 3. API Routes
- `/api/auth/[...nextauth]` - Authentication endpoints
- `/api/auth/register` - User registration
- `/api/bets` - CRUD operations for bets
- `/api/bets/[id]` - Individual bet management

### 4. Updated Components
- Main page now uses database instead of localStorage
- Login and signup pages with modern UI
- Session management throughout the app
- Error handling and loading states

### 5. Data Migration
- Utility to migrate existing localStorage data
- Automatic detection of legacy data
- Safe migration with error handling

## 🔧 Required Setup Steps

### 1. Database Setup
You need to set up a PostgreSQL database. Choose one option:

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL locally
# Then update DATABASE_URL in .env.local:
DATABASE_URL="postgresql://username:password@localhost:5432/sports_betting_tracker?schema=public"
```

#### Option B: Cloud Database (Recommended)
Use a service like:
- **Supabase** (free tier): https://supabase.com
- **PlanetScale** (free tier): https://planetscale.com
- **Railway** (free tier): https://railway.app
- **Neon** (free tier): https://neon.tech

### 2. Environment Variables
Update your `.env.local` file with real values:

```env
# Database (replace with your actual database URL)
DATABASE_URL="postgresql://username:password@host:5432/database?schema=public"

# NextAuth.js (generate a secure secret)
NEXTAUTH_URL=http://localhost:3003
NEXTAUTH_SECRET=your-super-secret-nextauth-secret-key-here-change-this-in-production

# Google OAuth (optional - get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 3. Generate NextAuth Secret
```bash
# Generate a secure secret
openssl rand -base64 32
```

### 4. Run Database Migration
```bash
# Generate Prisma client (already done)
npx prisma generate

# Create and run the database migration
npx prisma migrate dev --name init

# Optional: View your database
npx prisma studio
```

### 5. Test the System
```bash
# Start your development server
npm run dev

# Visit http://localhost:3003
# Try creating an account and adding bets
```

## 🚀 New Features Available

### For Users
- **Secure Authentication**: Email/password or Google sign-in
- **Data Persistence**: Bets saved to database, never lost
- **Cross-Device Sync**: Access your data from any device
- **Plan Management**: Free plan with upgrade options
- **Data Migration**: Existing localStorage data automatically migrated

### For Development
- **Type Safety**: Full TypeScript integration
- **API Security**: Protected routes with authentication
- **Input Validation**: Zod schemas for all data
- **Error Handling**: Comprehensive error management
- **Scalability**: Ready for production deployment

## 📊 Database Schema

### Users Table
- Authentication data
- Plan information (FREE/PRO/PREMIUM)
- User preferences

### Bets Table
- All betting information
- Linked to user accounts
- Indexed for performance

### User Settings
- Default stake amounts
- Notification preferences
- UI preferences

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **CSRF Protection**: Built-in middleware
- **Rate Limiting**: API endpoint protection
- **Input Sanitization**: All user inputs validated
- **Session Security**: Secure JWT tokens

## 🎯 Next Steps

1. **Set up your database** (choose from options above)
2. **Update environment variables** with real values
3. **Run the migration** to create tables
4. **Test user registration** and login
5. **Verify bet creation** and data persistence

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your DATABASE_URL format
   - Ensure database server is running
   - Verify credentials

2. **NextAuth Error**
   - Ensure NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches your domain

3. **Migration Fails**
   - Check database permissions
   - Ensure database exists
   - Try `npx prisma db push` for development

### Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Check the server logs
3. Verify environment variables
4. Test database connection with `npx prisma studio`

## 🎉 Benefits Achieved

- **Data Safety**: No more lost bets from browser clearing
- **User Management**: Proper authentication and user accounts
- **Scalability**: Ready for thousands of users
- **Professional**: Production-ready authentication system
- **Performance**: Optimized database queries with indexing

Your sports betting tracker is now enterprise-ready with proper user management and data persistence!
