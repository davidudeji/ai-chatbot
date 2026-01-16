# AI Chatbot - Vercel Deployment Guide

This is an AI chatbot application built with Node.js/Express backend and HTML/CSS/JavaScript frontend, optimized for Vercel deployment.

## Project Structure

```
ai-chatbot/
├── api/                    # Vercel serverless functions
│   └── chat.js            # Chat API endpoint
├── public/                # Static frontend files
│   ├── index.html
│   ├── style.css
│   ├── script1.js
│   └── images/
├── backend/               # Local development server
│   └── server.js
├── vercel.json           # Vercel configuration
├── package.json
├── .env.example          # Environment variables template
└── .gitignore
```

## Prerequisites

- Node.js 16+ and npm
- Vercel account (https://vercel.com)
- Gemini API key (https://makersuite.google.com/app/apikey)

## Local Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create `.env` file:**

   ```bash
   cp .env.example .env
   ```

   Then add your Gemini API key:

   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Run development server:**

   ```bash
   npm run dev
   ```

   Server will run at `http://localhost:3000`

4. **Open in browser:**
   Navigate to `http://localhost:3000`

## Deployment to Vercel

### Option 1: Using Vercel CLI

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Deploy:**

   ```bash
   vercel
   ```

3. **Add environment variable in Vercel dashboard:**
   - Go to your project settings
   - Add `GEMINI_API_KEY` environment variable with your API key

### Option 2: Using GitHub (Recommended)

1. **Push to GitHub:**

   ```bash
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Add `GEMINI_API_KEY` environment variable
   - Deploy

## Important Notes

### Frontend API Endpoint

The frontend automatically detects whether it's running locally or in production:

- **Local:** Uses `http://localhost:3000/api/chat`
- **Production:** Uses `/api/chat` (relative path)

This is handled in `public/script1.js` by the `getApiUrl()` function.

### CORS Configuration

CORS is properly configured in the serverless function to allow requests from your domain.

### Environment Variables

In Vercel dashboard, add the following environment variable:

- `GEMINI_API_KEY`: Your Gemini API key

### Troubleshooting

**Frontend can't connect to API:**

- Check browser console for error messages
- Ensure `GEMINI_API_KEY` is set in Vercel environment variables
- Verify the API endpoint URL is correct

**Images not loading:**

- Images folder should be in `public/images/`
- Use relative paths in HTML

**Build errors:**

- Ensure `node_modules` is in `.gitignore`
- Check that all dependencies are listed in `package.json`

## Technology Stack

- **Backend:** Node.js, Express.js
- **Frontend:** HTML, CSS, JavaScript
- **API:** Google Gemini API
- **Hosting:** Vercel

## Features

- Multi-turn conversation support
- Image attachments
- Real-time responses
- Responsive UI
- Production-ready deployment
