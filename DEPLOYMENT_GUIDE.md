# 🚀 Deployment Guide - Sports Betting Tracker

## Overview
This guide will walk you through deploying your sports betting tracker to GitHub and AWS. The application is production-ready and includes all necessary configurations.

## 📋 Prerequisites Checklist

- [x] GitHub account (confirmed)
- [x] AWS account (confirmed)
- [x] Application is fully developed and tested
- [x] Git repository is already initialized
- [x] Remote origin is set to: https://github.com/yasky6/bettracker-pro.git

## 🔧 Pre-Deployment Setup

### 1. Environment Variables Setup
Before deploying, ensure your environment variables are properly configured:

**Required Environment Variables:**
```bash
# Database
DATABASE_URL="your-production-database-url"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Google OAuth (if using)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe (if using payments)
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

### 2. Create Production Environment File
Create a `.env.production` file (don't commit this to Git):
```bash
# Copy your .env.local and update URLs for production
cp .env.local .env.production
```

## 📤 GitHub Deployment

### Step 1: Commit All Changes
```bash
# Check current status
git status

# Add all files
git add .

# Commit with descriptive message
git commit -m "feat: Complete sports betting tracker with enterprise features

- Database & authentication system (PostgreSQL + NextAuth.js)
- Advanced state management (React Query + Zustand)
- Professional error handling with recovery
- PWA implementation with offline support
- Advanced analytics and AI insights
- Performance optimizations (React.memo + caching)
- Comprehensive documentation"

# Push to GitHub
git push origin main
```

### Step 2: Verify GitHub Repository
1. Visit: https://github.com/yasky6/bettracker-pro
2. Confirm all files are uploaded
3. Check that sensitive files (.env.local) are not committed

### Step 3: Set Up GitHub Actions (Optional)
Create `.github/workflows/deploy.yml` for automated deployments:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
      env:
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
        NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL }}
        NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
    
    - name: Deploy to AWS
      # Add your AWS deployment steps here
      run: echo "Deploy to AWS"
```

## ☁️ AWS Deployment Options

### Option 1: AWS Amplify (Recommended - Easiest)

#### Step 1: Set Up AWS Amplify
1. Go to AWS Console → AWS Amplify
2. Click "New app" → "Host web app"
3. Choose "GitHub" as source
4. Select your repository: `yasky6/bettracker-pro`
5. Choose branch: `main`

#### Step 2: Configure Build Settings
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

#### Step 3: Add Environment Variables
In Amplify Console → Environment variables:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

#### Step 4: Set Up Database
1. **Option A: AWS RDS PostgreSQL**
   - Go to AWS RDS
   - Create PostgreSQL database
   - Update `DATABASE_URL` in Amplify

2. **Option B: Supabase (Recommended)**
   - Go to https://supabase.com
   - Create new project
   - Get connection string
   - Update `DATABASE_URL`

### Option 2: AWS EC2 + Docker

#### Step 1: Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Step 2: Create docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - postgres
  
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=bettracker
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=your-password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Option 3: AWS Lambda + Serverless

#### Step 1: Install Serverless Framework
```bash
npm install -g serverless
npm install --save-dev serverless-nextjs-plugin
```

#### Step 2: Create serverless.yml
```yaml
service: bettracker-pro

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1

plugins:
  - serverless-nextjs-plugin

custom:
  nextjs:
    memory: 1024
    timeout: 30
```

## 🗄️ Database Setup

### Option 1: Supabase (Recommended)
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Run migrations:
```bash
npx prisma migrate deploy
npx prisma generate
```

### Option 2: AWS RDS
1. AWS Console → RDS
2. Create PostgreSQL database
3. Configure security groups
4. Update connection string
5. Run migrations

### Option 3: PlanetScale
1. Go to https://planetscale.com
2. Create database
3. Get connection string
4. Update environment variables

## 🔐 Security Checklist

### Before Deployment:
- [ ] Remove all console.log statements
- [ ] Ensure .env files are in .gitignore
- [ ] Set up proper CORS policies
- [ ] Configure CSP headers
- [ ] Set up rate limiting
- [ ] Enable HTTPS only
- [ ] Configure proper session settings

### Environment Variables Security:
- [ ] Use AWS Secrets Manager or similar
- [ ] Rotate secrets regularly
- [ ] Use different secrets for different environments
- [ ] Never commit secrets to Git

## 🚀 Deployment Commands

### Quick Deployment to GitHub:
```bash
# Ensure you're in the project directory
cd c:/sports-betting-tracker

# Check git status
git status

# Add all changes
git add .

# Commit changes
git commit -m "feat: Production-ready sports betting tracker deployment"

# Push to GitHub
git push origin main
```

### Build for Production:
```bash
# Install dependencies
npm ci

# Build the application
npm run build

# Test production build locally
npm start
```

## 📊
