# Vercel Deployment - Visual Architecture

## 🏗️ **System Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL DEPLOYMENT                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│   Your Browser       │
│   (Frontend User)    │
└──────────────┬───────┘
               │
               │ HTTP/HTTPS
               │
     ┌─────────▼────────────────────┐
     │  Vercel Edge (Static Files)  │
     │  (/public folder)            │
     │  ✅ index.html               │
     │  ✅ style.css                │
     │  ✅ script1.js               │
     │  ✅ images/                  │
     └─────────────┬────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        │ (1) Static files    │ (2) API requests
        │ served directly     │ to /api/chat
        │                     │
        ▼                     ▼
   ┌─────────────┐    ┌──────────────────┐
   │ Browser     │    │ Vercel Serverless│
   │ displays    │    │ Function         │
   │ page        │    │ (/api/chat.js)   │
   └─────────────┘    └────────┬─────────┘
                              │
                              │ CORS enabled
                              │
                              ▼
                     ┌──────────────────┐
                     │ Google Gemini    │
                     │ API              │
                     │ generateContent  │
                     └──────────────────┘
```

---

## 📊 **Request Flow Diagram**

### User sends a message:

```
1. User types message in browser
   ↓
2. JavaScript calls getApiUrl()
   ├─ localhost? → "http://localhost:3000/api/chat"
   └─ production? → "/api/chat"
   ↓
3. fetch() sends POST request
   ├─ Content-Type: application/json
   └─ Body: { contents: [...] }
   ↓
4. Vercel routes to /api/chat.js
   ├─ Handler function receives request
   ├─ Validates GEMINI_API_KEY
   └─ Validates input data
   ↓
5. API calls Google Gemini
   ├─ Sends conversation history
   ├─ Receives AI response
   └─ Handles errors
   ↓
6. Response sent back to browser
   ├─ CORS headers included
   └─ JSON: { reply: "..." }
   ↓
7. JavaScript updates chat UI
   └─ User sees bot response
```

---

## 🔀 **URL Routing (vercel.json)**

```
                     Incoming Request
                            │
                    ┌───────┴────────┐
                    │                │
        /api/chat   │      /*        │ (anything else)
                    │                │
                    ▼                ▼
        ┌─────────────────┐  ┌───────────────┐
        │ /api/chat.js    │  │ /index.html   │
        │ (serverless)    │  │ (SPA routing) │
        └─────────────────┘  └───────────────┘
                │                     │
                │ Returns JSON        │ Returns HTML
                │ { reply: "..." }    │
                └─────────────────────┘
```

---

## 📁 **File Organization**

```
ai-chatbot/
│
├─ 🔧 CONFIGURATION FILES
│  ├─ vercel.json        ← Vercel deployment config
│  ├─ package.json       ← Dependencies & scripts
│  ├─ .env.example       ← Environment template
│  └─ .gitignore         ← Git ignore rules
│
├─ 🌐 FRONTEND (Public / Static)
│  └─ public/
│     ├─ index.html      ← Main page
│     ├─ style.css       ← Styling
│     ├─ script1.js      ← Dynamic API URL ⭐
│     └─ images/
│        ├─ chatbot.png
│        └─ 1538298822.svg
│
├─ 🔗 API (Serverless)
│  └─ api/
│     └─ chat.js         ← Vercel function handler ⭐
│
├─ 💻 LOCAL DEV (Optional)
│  └─ backend/
│     └─ server.js       ← Express dev server
│
└─ 📚 DOCUMENTATION
   ├─ README.md                   ← Main guide
   ├─ DEPLOYMENT_CHECKLIST.md     ← Checklist
   └─ DEPLOYMENT_SUMMARY.md       ← This file
```

---

## 🚀 **Deployment Process**

### Step 1: Local Setup

```
$ npm install
   │
   └─ Installs: express, cors, dotenv, node-fetch

$ cp .env.example .env
   │
   └─ Create local environment file

[Edit .env and add GEMINI_API_KEY]
   │
   └─ Copy your API key

$ npm run dev
   │
   └─ Starts http://localhost:3000
```

### Step 2: Test Locally

```
Browser opens localhost:3000
   ├─ Loads /public/index.html (static)
   ├─ Loads /public/style.css (static)
   ├─ Runs /public/script1.js (static)
   │
   └─ When user sends message:
      ├─ script1.js detects localhost
      ├─ Calls http://localhost:3000/api/chat
      ├─ backend/server.js handles request
      ├─ Calls Google Gemini API
      └─ Returns response to browser
```

### Step 3: Push to GitHub

```
$ git add .
$ git commit -m "Fix Vercel deployment issues"
$ git push origin main

Files sent to GitHub:
├─ /api/chat.js      ✅
├─ /public/*         ✅
├─ /backend/server.js ✅
├─ vercel.json       ✅
└─ All other files   ✅

Note: .env NOT committed (in .gitignore)
```

### Step 4: Deploy to Vercel

```
At vercel.com:
├─ Connect GitHub repo
├─ Select project
├─ Add environment variable:
│  └─ GEMINI_API_KEY = [your key]
└─ Deploy

Vercel builds project:
├─ Installs dependencies (package.json)
├─ Creates serverless functions (/api)
├─ Deploys static files (/public)
└─ Assigns URL (e.g., chatbot.vercel.app)
```

### Step 5: Production Live

```
Browser opens https://chatbot.vercel.app
   ├─ Loads /public/index.html (Vercel static)
   ├─ Loads /public/style.css (Vercel static)
   ├─ Runs /public/script1.js (Vercel static)
   │
   └─ When user sends message:
      ├─ script1.js detects production domain
      ├─ Calls /api/chat (relative path)
      ├─ Vercel routes to /api/chat.js
      ├─ Serverless function handles request
      ├─ Calls Google Gemini API
      └─ Returns response to browser
```

---

## 🔑 **Key Features**

### ✨ Dynamic API Detection

```javascript
// script1.js
const getApiUrl = () => {
  // Checks current domain
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    // Local: absolute URL
    return "http://localhost:3000/api/chat";
  }
  // Production: relative URL (works on Vercel)
  return "/api/chat";
};
```

### ✨ Serverless Function Handler

```javascript
// api/chat.js
export default async function handler(req, res) {
  // Standard Vercel format
  // req = incoming request
  // res = response object
  // Vercel automatically handles routing
  // No app.listen() needed
}
```

### ✨ Static File Serving

```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🔍 **What Gets Deployed Where**

| Folder     | Purpose               | Deployed As          | URL                  |
| ---------- | --------------------- | -------------------- | -------------------- |
| `/public`  | Frontend static files | Static Assets        | `*.vercel.app/`      |
| `/api`     | Backend logic         | Serverless Functions | `*.vercel.app/api/*` |
| `/backend` | Local dev server      | NOT deployed         | localhost:3000       |
| `Root`     | Config files          | Read during build    | N/A                  |

---

## 📞 **Support Decision Tree**

```
Issue: Frontend can't reach API
│
├─ Is it localhost?
│  └─ No CORS needed, localhost:3000/api/chat
│
├─ Is it production?
│  ├─ Check GEMINI_API_KEY in Vercel dashboard
│  ├─ Check /api/chat.js is present
│  ├─ Check vercel.json rewrites
│  └─ Check browser console for errors

Issue: Images not loading
│
├─ Check files are in /public/images/
├─ Check paths in HTML (./images/chatbot.png)
├─ Verify images are committed to git
└─ Refresh browser cache (Ctrl+Shift+R)

Issue: Chatbot not responding
│
├─ Check GEMINI_API_KEY is valid
├─ Check browser console for fetch errors
├─ Check Vercel deployment logs
├─ Verify API endpoint is /api/chat
└─ Check network tab in DevTools
```

---

## 🎯 **Success Criteria**

✅ **Deployment Complete When:**

- [ ] GitHub repository connected to Vercel
- [ ] GEMINI_API_KEY added to Vercel environment
- [ ] Vercel deployment shows "Ready"
- [ ] Production URL accessible (no 404)
- [ ] index.html loads (page visible)
- [ ] CSS loads (page styled)
- [ ] JavaScript runs (no console errors)
- [ ] Message sends (API responds)
- [ ] Images display (if any)
- [ ] Bot responds with text (API working)

---

## 📈 **Performance Notes**

```
Local Development:
├─ Server: Node.js Express (full server)
├─ Speed: Very fast (always running)
└─ Cost: Free (your machine)

Vercel Production:
├─ Server: Serverless Functions (cold start)
├─ Speed: Fast after cold start
├─ Cost: Free tier sufficient (generous limits)
└─ Scaling: Automatic (unlimited concurrent)
```

---

## 🔐 **Security Summary**

```
API Key Protection:
├─ Not hardcoded ✅
├─ Not in git ✅
├─ In environment variables ✅
├─ Hidden from browser ✅
└─ Only used server-side ✅

Request Validation:
├─ Method check (POST only) ✅
├─ Input validation ✅
├─ CORS headers ✅
├─ Error handling ✅
└─ Timeout protection ✅
```

---

**Ready to Deploy?** → Follow the Quick Start in DEPLOYMENT_SUMMARY.md
