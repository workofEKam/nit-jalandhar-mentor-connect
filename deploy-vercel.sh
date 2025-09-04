#!/bin/bash

echo "🚀 Deploying NIT Jalandhar Mentor Connect to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "Please login to Vercel if prompted..."
vercel login

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo "📝 Don't forget to:"
echo "   1. Set environment variables in Vercel dashboard"
echo "   2. Update CORS_ORIGIN with your Vercel URL"
echo "   3. Run database setup if needed"