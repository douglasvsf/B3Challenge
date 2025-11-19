# B3Challenge

Mocked dashboard for querying daily closing prices of B3 assets with interactive chart visualization.

## 📋 About the Project

Full-stack system developed as a technical challenge that allows querying multiple B3 assets by simulating daily closing prices. The frontend displays results in a responsive dark neon-themed line chart, while the backend provides a mocked API that generates deterministic data for demonstration purposes.

## 🛠️ Technologies

### Frontend
- **React 19** with **TypeScript**
- **Tailwind CSS** for styling
- **Recharts** for chart visualization
- **Create React App** as base

### Backend
- **Node.js** with **Express** and **TypeScript**
- **CORS** enabled for frontend communication
- **Nodemon** with **ts-node** for hot-reload in development

### Infrastructure
- **Monorepo** with npm workspaces
- **Concurrently** to run frontend and backend simultaneously

## 📦 Prerequisites

- **Node.js** (version 18 or higher)
- **npm** (usually comes with Node.js)

## 🚀 How to Run

### 1. Clone the repository

```bash
git clone https://github.com/douglasvsf/B3Challenge.git
cd B3Challenge
```

### 2. Install dependencies

At the project root, run:

```bash
npm install
```

This command will automatically install dependencies for all workspaces (`apps/web` and `apps/api`).

### 3. Run the project

#### Option 1: Run frontend and backend together (recommended)

```bash
npm run dev
```

This will start:
- **Backend API** at `http://localhost:3001`
- **Frontend React** at `http://localhost:3000` (opens automatically in browser)

#### Option 2: Run separately

**Backend only:**
```bash
npm run api
```

**Frontend only:**
```bash
npm run web
```

### 4. Access the application

Open your browser at `http://localhost:3000`

## 📁 Project Structure

```
B3Challenge/
├── apps/
│   ├── api/                 # Express Backend
│   │   ├── src/
│   │   │   ├── index.ts     # Server and API routes
│   │   │   └── types/       # TypeScript definitions
│   │   ├── tsconfig.json    # TypeScript configuration
│   │   └── package.json
│   └── web/                 # React Frontend
│       ├── public/          # Static files
│       ├── src/
│       │   ├── components/ # React Components
│       │   │   ├── ChartSkeleton.tsx
│       │   │   ├── ErrorMessage.tsx
│       │   │   ├── ExportButtons.tsx
│       │   │   ├── HistoryPanel.tsx
│       │   │   ├── IndicatorsPanel.tsx
│       │   │   ├── PageHeader.tsx
│       │   │   ├── QuoteForm.tsx
│       │   │   └── QuoteResults.tsx
│       │   ├── hooks/       # Custom hooks
│       │   │   └── useRetry.ts
│       │   ├── logic/       # Business logic
│       │   │   └── quotes.ts
│       │   ├── types/       # TypeScript definitions
│       │   │   ├── errors.ts
│       │   │   └── quotes.ts
│       │   ├── utils/       # Utilities
│       │   │   ├── export.ts
│       │   │   ├── history.ts
│       │   │   ├── indicators.ts
│       │   │   └── validation.ts
│       │   └── App.tsx      # Main component
│       └── package.json
├── package.json             # Monorepo configuration
└── README.md
```

## 🎯 Features

### Query and Visualization
- ✅ Query multiple assets simultaneously (e.g., PETR4, VALE3)
- ✅ Date range selection (start and end)
- ✅ Interactive line chart visualization with multiple series
- ✅ Dark theme with custom neon palette
- ✅ Responsive and modern interface

### Technical Indicators
- ✅ Percentage and absolute variation (with color indicators)
- ✅ Current price, highest and lowest of the period
- ✅ 7-day moving average (MA7)
- ✅ 30-day moving average (MA30) when available
- ✅ Currency and percentage formatting (pt-BR)

### Data Export
- ✅ Export chart to CSV (with UTF-8 encoding)
- ✅ Export complete data to JSON
- ✅ Automatic download with date-based filename

### Query History
- ✅ Local storage of last 10 queries
- ✅ Dropdown panel with recent queries
- ✅ Quick selection that fills form and automatically executes query
- ✅ Relative date formatting ("Now", "5 min ago", etc.)
- ✅ Individual removal or complete history cleanup

### Error Handling and Validation
- ✅ Real-time form validation
- ✅ Ticker format validation (AAAA11)
- ✅ Date range validation (minimum 1 day, maximum 365 days)
- ✅ Specific and categorized error messages
- ✅ Automatic retry on network failures (up to 3 attempts)
- ✅ Request timeout (10 seconds)
- ✅ Skeleton screens during loading
- ✅ Visual feedback in all states (loading, error, success)

### Data
- ✅ Deterministic mocked data for demonstration

## 📝 Available Scripts

At the project root:

- `npm run dev` - Starts frontend and backend simultaneously
- `npm run api` - Starts backend only
- `npm run web` - Starts frontend only
- `npm run web:build` - Generates production build of frontend

## 🔌 API Endpoints

### GET `/health`
Returns API status.

**Response:**
```json
{
  "status": "ok"
}
```

### GET `/quotes`
Queries mocked asset prices.

**Query Parameters:**
- `tickers` (required): List of tickers separated by space or comma (e.g., `PETR4 VALE3`)
- `start` (required): Start date in `YYYY-MM-DD` format
- `end` (required): End date in `YYYY-MM-DD` format

**Example:**
```
GET /quotes?tickers=PETR4%20VALE3&start=2024-01-01&end=2024-01-07
```

**Response:**
```json
{
  "tickers": ["PETR4", "VALE3"],
  "range": {
    "start": "2024-01-01",
    "end": "2024-01-07"
  },
  "series": [
    {
      "ticker": "PETR4",
      "points": [
        { "date": "2024-01-01", "close": 52.34 },
        { "date": "2024-01-02", "close": 53.12 }
      ]
    }
  ]
}
```

## 🎨 Color Palette

The project uses a dark theme with the following colors:

- **Primary**: `#00E6B0` (Neon green)
- **Secondary**: `#00B894` (Dark green)
- **Main background**: `#000000` (Black)
- **Secondary background**: `#0A0A0A` (Soft black)
- **Text**: `#E5E5E5` (Light gray)
- **Highlights**: `#1EFFD2` (Light neon green)

### Chart Colors

Chart lines use varied palettes without green, including:
- Reds and Pinks
- Oranges and Yellows
- Blues
- Purples and Violets

## 💡 Advanced Features

### Form Validation
- Real-time field validation
- Ticker format: AAAA11 (e.g., PETR4, VALE3)
- Maximum of 10 tickers per query
- Date range: minimum 1 day, maximum 365 days
- Visual feedback with colored borders on error

### Error Handling
- Error categorization (Network, Validation, API, Unknown)
- Specific and actionable messages
- Automatic retry for network errors (3 attempts with progressive delay)
- Manual retry button in error messages
- 10-second timeout on requests

### Performance
- Memoization of heavy calculations (indicators, palettes)
- Skeleton screens for better loading perception
- Lazy loading of components when applicable
- Re-render optimization with React.memo and useMemo

### Accessibility
- Error messages with `role="alert"`
- Descriptive labels on fields
- Keyboard navigation
- Adequate contrast on all elements

## 📄 License

This project was developed as a technical challenge.

## 👤 Author

Developed for B3Challenge.

---

**Note**: This project uses mocked data for demonstration purposes. Generated prices are deterministic based on ticker and date, but do not represent real B3 values.

