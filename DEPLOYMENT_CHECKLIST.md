# Vercel Deployment Checklist

## Issues Fixed for Vercel Deployment

### ✅ Backend Structure

- **Created `/api/chat.js`**: Converted to Vercel serverless function format
  - Handles POST requests only
  - Includes CORS headers for cross-origin requests
  - Handles OPTIONS requests
  - Validates environment variables
  - Error handling for API key missing

### ✅ Frontend Organization

- **Moved to `/public/` folder**:
  - `index.html` - Static homepage
  - `style.css` - Stylesheet
  - `script1.js` - Updated with dynamic API URL
  - `images/` folder - Images directory

### ✅ Dynamic API Endpoint

- **Updated `/public/script1.js`**:
  - Added `getApiUrl()` function that:
    - Returns `http://localhost:3000/api/chat` for local development
    - Returns `/api/chat` for production (works with Vercel)
  - Automatic environment detection

### ✅ Configuration Files

- **Created `vercel.json`**:

  - API route configuration
  - Static file serving
  - Rewrites for SPA routing
  - Cache headers

- **Updated `package.json`**:

  - Added proper scripts (`dev`, `build`)
  - Configured main entry point

- **Created `.env.example`**:
  - Documents required environment variables
  - Users copy to `.env` locally

### ✅ Environment & Build

- **Updated `.gitignore`**:
  - Added `.vercel/` for Vercel-specific files
  - Added `.env.local` variants
  - Includes IDE and dependency files
  - Covers build output directories

### ✅ Updated Local Development Server

- **Enhanced `/backend/server.js`**:
  - Serves static files from `/public`
  - Uses PORT from environment or defaults to 3000
  - Includes API error checking
  - Full CORS support

### ✅ Documentation

- **Created comprehensive README.md** with:
  - Project structure overview
  - Local development setup
  - Vercel deployment instructions (CLI and GitHub methods)
  - Environment variable setup
  - Troubleshooting guide

## What Was Fixed

### 1. **Hardcoded localhost URL**

- ❌ Before: `http://localhost:3000/api/chat`
- ✅ After: Dynamic URL detection via `getApiUrl()`

### 2. **Missing serverless function structure**

- ❌ Before: Express server in root
- ✅ After: Proper `/api/` folder with serverless function

### 3. **Frontend not properly served**

- ❌ Before: Mixed with backend
- ✅ After: Organized in `/public/` folder

### 4. **No environment variable handling**

- ❌ Before: Missing error checking
- ✅ After: Validates GEMINI_API_KEY at startup

### 5. **CORS issues**

- ❌ Before: Only basic CORS setup
- ✅ After: Full CORS headers including OPTIONS support

### 6. **Missing build configuration**

- ❌ Before: No vercel.json
- ✅ After: Complete Vercel configuration with rewrites

### 7. **No deployment documentation**

- ❌ Before: Missing instructions
- ✅ After: Comprehensive README with setup steps

## Deployment Steps

### For Local Development

1. Create `.env` from `.env.example`
2. Add your `GEMINI_API_KEY`
3. Run `npm install`
4. Run `npm run dev`
5. Open `http://localhost:3000`

### For Vercel Deployment

#### Option A: Vercel CLI

```bash
npm install -g vercel
vercel
# Add GEMINI_API_KEY in Vercel dashboard
```

#### Option B: GitHub Integration

1. Push to GitHub
2. Go to https://vercel.com/new
3. Import repository
4. Add `GEMINI_API_KEY` environment variable
5. Deploy

## File Structure After Fixes

```
ai-chatbot/
├── api/
│   └── chat.js                    ← Serverless function
├── backend/
│   └── server.js                  ← Local dev server
├── public/                        ← Static frontend
│   ├── index.html
│   ├── style.css
│   ├── script1.js                 ← Updated with getApiUrl()
│   ├── images/
│   │   ├── chatbot.png
│   │   └── 1538298822.svg
│   └── script.js
├── vercel.json                    ← Vercel config
├── package.json                   ← Updated scripts
├── .env.example                   ← New: env template
├── .gitignore                     ← Updated
├── README.md                      ← New: deployment guide
```

## Common Issues & Solutions

### Frontend can't reach API

- Check GEMINI_API_KEY is set in Vercel environment
- Verify `/api/chat` endpoint returns proper CORS headers
- Check browser DevTools Network tab for 404 or CORS errors

### Images not loading

- Ensure image files are in `public/images/`
- Use relative paths like `./images/chatbot.png`
- Verify images folder is not in .gitignore

### Port conflict on local development

- Change PORT environment variable: `PORT=3001 npm run dev`
- Or kill existing process using port 3000

### Build fails

- Check all dependencies in package.json
- Ensure .env is not committed (only .env.example)
- Verify no old `node_modules` exists locally

## Testing Checklist

- [ ] Local dev server runs: `npm run dev`
- [ ] Frontend loads at `http://localhost:3000`
- [ ] Chat sends messages successfully
- [ ] Image upload works
- [ ] `.env` contains GEMINI_API_KEY
- [ ] Vercel deployment completes
- [ ] Production site loads
- [ ] Production chat works with API
- [ ] Images display in production
- [ ] No console errors in production

## Next Steps

1. Add your GEMINI_API_KEY to `.env` (local) and Vercel dashboard
2. Test locally with `npm run dev`
3. Deploy to Vercel using preferred method
4. Monitor Vercel logs for any issues
5. Test production deployment thoroughly

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Google Gemini API: https://makersuite.google.com/
- Express.js: https://expressjs.com/
