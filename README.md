# LeadAudit AI — AI-Powered Lead Enrichment & Audit Report System

A full-stack SaaS application that accepts lead submissions, enriches company data via web scraping, generates AI-powered personalized audit reports, produces professional PDFs, and delivers them via email — all automatically.

---

## 🏗️ Architecture

```
┌──────────────────┐     POST /api/leads     ┌──────────────────────┐
│                  │ ──────────────────────►  │                      │
│   React Client   │                          │   Express API Server │
│   (Vite + TW)    │  ◄── Poll GET /status ── │                      │
│                  │                          │   ┌────────────────┐ │
└──────────────────┘                          │   │ Lead Controller │ │
                                              │   └───────┬────────┘ │
                                              │           │          │
                               ┌──────────────┼───────────┼──────────┤
                               │    Async Pipeline        │          │
                               │                          ▼          │
                               │   ┌─────────────────────────────┐   │
                               │   │ 1. Enrichment (Cheerio)     │   │
                               │   │ 2. AI Report (OpenAI)       │   │
                               │   │ 3. PDF Generation (PDFKit)  │   │
                               │   │ 4. Email Delivery (Nodemailer)│  │
                               │   └─────────────────────────────┘   │
                               │              │                      │
                               │              ▼                      │
                               │        ┌──────────┐                 │
                               │        │ MongoDB  │                 │
                               │        │  Atlas   │                 │
                               │        └──────────┘                 │
                               └─────────────────────────────────────┘
```

## 🛠️ Tech Stack

| Layer       | Technology                      |
|-------------|--------------------------------|
| Frontend    | React 18, Tailwind CSS 3, Vite |
| Backend     | Node.js, Express.js            |
| Database    | MongoDB Atlas (Mongoose)       |
| AI          | OpenAI API (GPT-4o / 3.5)     |
| PDF         | PDFKit                         |
| Email       | Nodemailer (SMTP)              |
| Scraping    | Cheerio + Axios                |
| Animations  | Framer Motion                  |

## 📁 Project Structure

```
root/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route-level pages
│   │   ├── services/          # API client (Axios)
│   │   ├── hooks/             # Custom React hooks
│   │   └── utils/             # Validation helpers
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                    # Express backend
│   ├── config/                # DB connection
│   ├── controllers/           # Request handlers
│   ├── middleware/             # Validation, error handling
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   │   ├── enrichmentService.js
│   │   ├── aiReportService.js
│   │   ├── pdfService.js
│   │   └── emailService.js
│   ├── templates/             # Email HTML templates
│   └── server.js              # Entry point
│
├── .gitignore
├── package.json               # Root workspace scripts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB Atlas** account ([free tier](https://www.mongodb.com/cloud/atlas))
- **OpenAI API** key ([get one](https://platform.openai.com/api-keys))
- **Gmail App Password** for SMTP ([setup guide](https://support.google.com/accounts/answer/185833))

### 1. Clone the Repository

```bash
git clone <repository-url>
cd lead-audit-ai
```

### 2. Install Dependencies

```bash
# Install root dependencies (concurrently)
npm install

# Install both client and server dependencies
npm run install:all
```

### 3. Configure Environment Variables

**Server** — Create `server/.env` from the example:
```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your credentials:
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/lead-audit
OPENAI_API_KEY=sk-your-key-here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Client** — Create `client/.env` from the example:
```bash
cp client/.env.example client/.env
```

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the Application

```bash
# Start both frontend and backend concurrently
npm run dev
```

Or run them separately:
```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Health check**: http://localhost:5000/api/health

## 📡 API Endpoints

| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| POST   | `/api/leads`           | Submit a new lead               |
| GET    | `/api/leads`           | List all leads                  |
| GET    | `/api/leads/:id`       | Get lead details                |
| GET    | `/api/leads/:id/status`| Poll processing status          |
| GET    | `/api/health`          | Server health check             |

### Example: Submit a Lead

**Request:**
```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "companyName": "Acme Inc",
    "website": "https://example.com",
    "industry": "Technology"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "leadId": "6651a2b3c4d5e6f7a8b9c0d1",
    "message": "Lead submitted successfully. Processing has started."
  }
}
```

### Example: Poll Status

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "generating",
    "currentStep": 2,
    "message": "Generating AI audit report...",
    "emailStatus": "pending",
    "error": null
  }
}
```

## 🔄 Processing Pipeline

When a lead is submitted, the system runs this pipeline asynchronously:

1. **Validation** — Input sanitization and format checks
2. **Enrichment** — Scrapes the company website for metadata, headings, content, and technology signals
3. **AI Generation** — Sends enriched data to OpenAI for personalized audit report generation
4. **PDF Creation** — Generates a professional, multi-page PDF with PDFKit
5. **Email Delivery** — Sends the PDF as an attachment via SMTP
6. **Status Update** — Updates MongoDB at each stage (frontend polls for progress)

## 🔧 Environment Variables

### Server (`server/.env`)

| Variable       | Required | Description                      |
|---------------|----------|----------------------------------|
| `MONGODB_URI` | Yes      | MongoDB Atlas connection string  |
| `OPENAI_API_KEY` | Yes   | OpenAI API key                   |
| `SMTP_HOST`   | Yes      | SMTP server host                 |
| `SMTP_PORT`   | Yes      | SMTP server port                 |
| `SMTP_USER`   | Yes      | SMTP email address               |
| `SMTP_PASS`   | Yes      | SMTP password / app password     |
| `PORT`        | No       | Server port (default: 5000)      |
| `NODE_ENV`    | No       | Environment (default: development)|
| `CLIENT_URL`  | No       | Frontend URL for CORS            |

### Client (`client/.env`)

| Variable       | Required | Description                      |
|---------------|----------|----------------------------------|
| `VITE_API_URL` | No      | Backend API URL (default: /api via proxy) |

## ⚠️ Assumptions & Limitations

- **OpenAI costs**: Each report generation uses ~2000-4000 tokens. Monitor your usage.
- **SMTP rate limits**: Gmail has daily sending limits (~500/day for personal accounts).
- **Website scraping**: Some sites may block automated requests or use JavaScript rendering that Cheerio cannot parse.
- **PDF styling**: Uses PDFKit's built-in Helvetica font. Custom fonts can be added by placing .ttf files in the server directory.
- **No authentication**: This is a single-purpose tool without user auth. Add JWT/session auth for production use.

## 🔮 Future Improvements

- [ ] User authentication and dashboard
- [ ] Google Sheets logging integration
- [ ] Google Drive PDF storage
- [ ] Website screenshot capture (Puppeteer)
- [ ] Lighthouse-style performance scoring
- [ ] Report history and comparison
- [ ] Webhook integrations (Slack, Discord)
- [ ] Rate limiting and abuse prevention
- [ ] Dockerized deployment
- [ ] Unit and integration tests


