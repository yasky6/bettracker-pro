# 🚀 AWS Deployment Steps - BetTracker Pro

## ✅ GitHub Deployment Complete!
Your code has been successfully pushed to: https://github.com/yasky6/bettracker-pro.git

## 🎯 Next Steps: AWS Deployment

### Option 1: AWS Amplify (Recommended - Easiest)

#### Step 1: Access AWS Amplify
1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Search for "Amplify" in the services
3. Click "AWS Amplify"

#### Step 2: Create New App
1. Click "New app" → "Host web app"
2. Choose "GitHub" as your source
3. You'll be prompted to authorize AWS to access your GitHub
4. Select repository: `yasky6/bettracker-pro`
5. Select branch: `main`
6. Click "Next"

#### Step 3: Configure Build Settings
Amplify will auto-detect Next.js. Use this build configuration:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
        - npx prisma generate
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

#### Step 4: Set Up Database (Choose One)

**Option A: Supabase (Recommended - Free tier available)**
1. Go to [Supabase](https://supabase.com)
2. Create account and new project
3. Go to Settings → Database
4. Copy the connection string
5. It will look like: `postgresql://postgres:[password]@[host]:5432/postgres`

**Option B: AWS RDS**
1. Go to AWS RDS in your console
2. Create database → PostgreSQL
3. Choose "Free tier" template
4. Set database name: `bettracker`
5. Set username: `postgres`
6. Set password (remember this!)
7. Wait for creation (5-10 minutes)
8. Get connection string from RDS dashboard

#### Step 5: Configure Environment Variables in Amplify
In Amplify Console → Environment variables, add:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:5432/database_name

# NextAuth (IMPORTANT: Update these!)
NEXTAUTH_URL=https://your-amplify-domain.amplifyapp.com
NEXTAUTH_SECRET=your-super-secret-key-here-make-it-long-and-random

# Google OAuth (Optional - for Google login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe (Optional - for payments)
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

**🔑 Generate NEXTAUTH_SECRET:**
Run this command locally to generate a secure secret:
```bash
openssl rand -base64 32
```

#### Step 6: Deploy!
1. Click "Save and deploy"
2. Wait for build to complete (5-10 minutes)
3. Your app will be live at: `https://[random-id].amplifyapp.com`

#### Step 7: Run Database Migrations
After first deployment, you need to set up the database:

1. In Amplify Console, go to "Backend environments"
2. Open the terminal/console
3. Run these commands:
```bash
npx prisma migrate deploy
npx prisma db seed
```

### Option 2: Vercel (Alternative - Also Great)

#### Quick Vercel Deployment:
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Import your repository: `yasky6/bettracker-pro`
4. Add the same environment variables as above
5. Deploy!

### Option 3: AWS EC2 (Advanced)

If you prefer full control, you can deploy on EC2:

1. Launch EC2 instance (Ubuntu 22.04)
2. Install Node.js, PostgreSQL, and PM2
3. Clone your repository
4. Set up environment variables
5. Run the application with PM2

## 🗄️ Database Setup Commands

Once your database is ready, run these commands to set up the schema:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations to create tables
npx prisma migrate deploy

# (Optional) Seed with sample data
npx prisma db seed
```

## 🔧 Environment Variables Explained

### Required Variables:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_URL`: Your deployed app URL
- `NEXTAUTH_SECRET`: Random secret key for JWT signing

### Optional Variables:
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: For Google OAuth login
- `STRIPE_*`: For payment processing (upgrade feature)

## 🚨 Important Security Notes

1. **Never commit .env files to Git** (already configured in .gitignore)
2. **Use different secrets for production** than development
3. **Enable HTTPS only** in production
4. **Set up proper CORS policies**
5. **Use AWS Secrets Manager** for sensitive data in production

## 📊 Post-Deployment Checklist

After deployment:
- [ ] Test user registration and login
- [ ] Test bet creation and management
- [ ] Verify PWA installation works
- [ ] Test offline functionality
- [ ] Check analytics and insights
- [ ] Verify all API endpoints work
- [ ] Test responsive design on mobile
- [ ] Set up monitoring and alerts

## 🎉 You're Ready!

Once deployed, your sports betting tracker will be:
- ✅ Live on the internet
- ✅ Accessible from any device
- ✅ Installable as a PWA
- ✅ Backed by a real database
- ✅ Secure with authentication
- ✅ Professional and scalable

## 🆘 Need Help?

If you encounter any issues:
1. Check the deployment logs in AWS Amplify console
2. Verify all environment variables are set correctly
3. Ensure database connection string is valid
4. Check that all required secrets are generated

Your application is now production-ready and can handle real users! 🚀
