# Energy Metering UI

Production-ready IoT energy metering dashboard built with Next.js 14, TypeScript, and Recharts.

## 🚀 Features

- **Real-time Dashboard** - Live energy metrics monitoring with WebSocket
- **Time Series Analysis** - Historical data visualization with interactive charts
- **Billing Reports** - PDF generation for consumption summaries
- **Anomaly Detection** - Track invalid readings and anomalies
- **Responsive Design** - Works on desktop and mobile devices
- **Type-safe** - Full TypeScript integration

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Project Structure](#project-structure)
- [Deployment to Vercel](#deployment-to-vercel)
- [Development Guide](#development-guide)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Deploy in 5 Minutes

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your API URL

# 3. Test locally
npm run dev
# Open http://localhost:3000

# 4. Build for production
npm run build

# 5. Deploy to Vercel
npm i -g vercel
vercel --prod
```

---

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- Backend API running (energy-metering-api)

### Setup

```bash
# Clone repository (if needed)
git clone <your-repo-url>
cd energy-metering-ui

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your API URLs
# NEXT_PUBLIC_QUERY_API_URL=https://your-api-url.com
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Required - Backend API URL
NEXT_PUBLIC_QUERY_API_URL=https://your-api-url.com

# Optional - WebSocket URL
NEXT_PUBLIC_WS_URL=wss://your-api-url.com/ws/live

# Optional - WebSocket Configuration
NEXT_PUBLIC_WS_RECONNECT_DELAY=3000
NEXT_PUBLIC_WS_MAX_RETRIES=5

# Optional - Polling Configuration
NEXT_PUBLIC_POLLING_INTERVAL=5000
```

**Important Notes:**
- Use `https://` for production API URL (not `http://`)
- Use `wss://` for WebSocket URL (not `ws://`)
- No trailing slashes in URLs
- All variables starting with `NEXT_PUBLIC_` are exposed to the browser

---

## 💻 Development

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Lint Code

```bash
npm run lint
```

---

## 📁 Project Structure

```
energy-metering-ui/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Dashboard (home)
│   ├── layout.tsx           # Root layout with navigation
│   ├── globals.css          # Global styles
│   ├── billing/             # Billing PDF generation
│   │   └── page.tsx
│   ├── timeseries/          # Time series charts
│   │   └── page.tsx
│   └── anomalies/           # Anomaly data table
│       └── page.tsx
├── components/
│   ├── charts/              # Chart components (Recharts)
│   │   ├── BarChart.tsx
│   │   ├── PieChart.tsx
│   │   ├── SingleMetricChart.tsx
│   │   └── TimeSeriesChart.tsx
│   ├── common/              # Reusable UI components
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBanner.tsx
│   │   ├── EmptyState.tsx
│   │   ├── InfoBanner.tsx
│   │   └── ConnectionStatus.tsx
│   ├── forms/               # Form components
│   │   ├── ClientSelector.tsx
│   │   └── DateRangeSelector.tsx
│   ├── metrics/             # Metric display components
│   │   └── MetricCard.tsx
│   └── tables/              # Table components
│       └── AnomalyTable.tsx
├── hooks/                   # Custom React hooks
│   ├── useApi.ts           # Generic API call hook
│   ├── useClients.ts       # Client fetching hook
│   └── useWebSocket.ts     # WebSocket connection hook
├── lib/                     # Core utilities and API
│   ├── apiClient.ts        # API service layer
│   ├── constants.ts        # App-wide constants
│   ├── types.ts            # TypeScript type definitions
│   └── utils.ts            # Utility functions
├── public/                  # Static assets
├── .env.example            # Environment template
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

### Key Files

**`lib/constants.ts`** - Central constants (API URLs, pagination, colors)  
**`lib/utils.ts`** - Utility functions (date formatting, filename generation)  
**`lib/apiClient.ts`** - API service with typed functions  
**`hooks/useClients.ts`** - Reusable client fetching hook  
**`components/forms/*`** - Reusable form components  

---

## 🌐 Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

### Manual Deployment

#### 1. Push to Git Repository

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

#### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your Git repository
4. Vercel auto-detects Next.js ✅

#### 3. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_QUERY_API_URL` | `https://your-api.com` | Production, Preview, Development |
| `NEXT_PUBLIC_WS_URL` | `wss://your-api.com/ws/live` | Production, Preview, Development |
| `NEXT_PUBLIC_WS_RECONNECT_DELAY` | `3000` | Production, Preview, Development |
| `NEXT_PUBLIC_WS_MAX_RETRIES` | `5` | Production, Preview, Development |
| `NEXT_PUBLIC_POLLING_INTERVAL` | `5000` | Production, Preview, Development |

**Important:**
- Use `https://` (not `http://`)
- Use `wss://` (not `ws://`)
- No trailing slashes
- Backend must allow CORS from Vercel domain

#### 4. Deploy

Click "Deploy" button and wait 2-3 minutes.

#### 5. Test Deployment

- [ ] Dashboard loads without errors
- [ ] Charts display correctly
- [ ] Client selector works
- [ ] PDF download works
- [ ] No console errors

### Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Backend Requirements

Before deploying frontend, ensure:

1. **Backend API is deployed** via HTTPS
2. **CORS configured** to allow Vercel domain:
   ```python
   # FastAPI example
   allow_origins=[
       "http://localhost:3000",
       "https://your-project.vercel.app",
       "https://*.vercel.app"
   ]
   ```
3. **All endpoints tested** and working
4. **PDF endpoint** returns `Content-Type: application/pdf`

---

## 📖 Development Guide

### Code Organization

#### Constants (`lib/constants.ts`)
```typescript
import { DEFAULT_PAGE_SIZE, API_BASE_URL } from '@/lib/constants';
```

#### Utilities (`lib/utils.ts`)
```typescript
import { formatDate, createBillingFilename, getStartOfMonth } from '@/lib/utils';
```

#### Custom Hooks
```typescript
import { useClients } from '@/hooks/useClients';
const { clients, selectedClient, setSelectedClient, loading } = useClients(true);
```

#### Reusable Components
```typescript
import ClientSelector from '@/components/forms/ClientSelector';
import DateRangeSelector from '@/components/forms/DateRangeSelector';
import InfoBanner from '@/components/common/InfoBanner';
```

### Best Practices

1. **Use Constants** - Don't hardcode values
2. **Use Utilities** - Reuse common functions
3. **Use Custom Hooks** - Share logic between components
4. **Use Reusable Components** - Consistent UI
5. **Type Everything** - Leverage TypeScript

### Adding New Features

#### Adding a New Page
1. Create `app/[pagename]/page.tsx`
2. Use existing hooks: `useClients`, `useApi`
3. Use form components: `ClientSelector`, `DateRangeSelector`
4. Add navigation link in `app/layout.tsx`

#### Adding a New API Endpoint
1. Add type in `lib/types.ts`
2. Add function in `lib/apiClient.ts`
3. Handle errors with `ApiError`

---

## 🐛 Troubleshooting

### Build Errors

**Error: Module not found**
```bash
npm install <missing-package>
```

**Error: TypeScript errors**
```bash
npm run build
# Fix all errors shown
```

### API Connection Issues

**CORS Error**
- Add Vercel domain to backend CORS whitelist
- Check browser console for specific error

**404 Not Found**
- Verify `NEXT_PUBLIC_QUERY_API_URL` is correct
- Check backend API is running
- Ensure no trailing slash in URL

**Wrong Content-Type**
- Backend must return `Content-Type: application/json`
- For PDF: `Content-Type: application/pdf`

### PDF Download Not Working

1. Check Network tab in browser DevTools
2. Verify backend returns PDF with correct headers
3. Check if `format=pdf` parameter is sent
4. Review backend logs for errors

### WebSocket Issues

**Not Connecting**
- Use `wss://` for production (not `ws://`)
- Check WebSocket endpoint is accessible
- Verify backend WebSocket server is running

### Performance Issues

**Slow Loading**
- Check API response time
- Enable caching on backend
- Optimize large data sets
- Review bundle size

### Environment Variables Not Working

**Remember**: Next.js env vars are applied at **build time**

**Solution**: Redeploy after changing variables in Vercel Dashboard

```bash
# Or trigger rebuild
vercel --prod
```

---

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: React 18
- **Charts**: Recharts
- **Styling**: CSS Modules
- **Deployment**: Vercel
- **Node**: 18.x+

---

## 📊 Features Breakdown

### Dashboard
- Real-time metrics display
- Active clients count
- Readings statistics
- Validation status (valid/anomaly/invalid)
- Bar and pie charts

### Time Series
- Client selector
- Historical data visualization
- Multiple metrics: Volts, Current, Active Power, Total Import kWh
- Status indicators (valid/invalid/anomaly)
- Last 2 months data

### Billing
- Client and date range selection
- PDF generation
- Automatic download
- PDF preview in browser
- Consumption summary (not invoice)

### Anomalies
- Filterable anomaly table
- Client filter
- Date range filter
- Pagination
- Shows timestamp, metric, value, and reason

---

## 🔒 Security

- **XSS Protection**: Enabled via Next.js
- **CSRF Protection**: SameSite cookies
- **CORS**: Backend-controlled
- **HTTPS Only**: Required for production
- **Environment Variables**: Never committed to Git
- **Security Headers**: Configured in `next.config.js`

---

## 📝 License

Private - All rights reserved

---

## 👥 Support

For issues and questions:
- Check [Troubleshooting](#troubleshooting) section
- Review Vercel logs (Dashboard → Deployments → Logs)
- Contact backend team for API issues
- Check backend API documentation

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] `npm run build` successful locally
- [ ] No TypeScript errors
- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] Backend API deployed and accessible
- [ ] CORS configured on backend
- [ ] All endpoints tested
- [ ] `.env` added to `.gitignore`
- [ ] Code pushed to Git repository
- [ ] Vercel environment variables added
- [ ] Test deployment successful
- [ ] Production deployment successful
- [ ] All features work on production
- [ ] No console errors in production

---

**Happy Coding! 🚀**

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Building for Production

Build the production-ready application:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

Start the production server:

```bash
npm start
# or
yarn start
# or
pnpm start
```

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Add environment variables** in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_QUERY_API_URL` with your API domain

### Option 2: Deploy via GitHub

1. Push your code to a GitHub repository
2. Import the project in [Vercel](https://vercel.com)
3. Configure environment variables:
   - `NEXT_PUBLIC_QUERY_API_URL` = Your Query API URL
4. Deploy

## API Endpoints

The dashboard integrates with the following backend endpoints:

### REST API
- `GET /api/v1/readings/latest` - Fetch latest meter readings
- `GET /api/v1/readings/timeseries?from=&to=&metric=` - Fetch historical data
- `GET /api/v1/billing/invoice?from=&to=` - Generate billing invoice
- `GET /api/v1/billing/invoice/pdf?from=&to=` - Download invoice PDF
- `GET /api/v1/readings/anomalies` - Fetch anomaly records

### WebSocket
- `wss://<domain>/ws/live` - Real-time meter readings stream

## Page Descriptions

### Dashboard (`/`)
- Displays real-time metrics: Voltage, Current, Active Power, Total Import Energy
- Updates via WebSocket for real-time data
- Falls back to REST polling (5s interval) if WebSocket unavailable
- Shows validation status for each reading
- Displays connection status indicator

### Time Series (`/timeseries`)
- Historical data visualization with line charts
- Configurable date range and metric selection
- Toggle to show/hide invalid data points
- Data point statistics (total, valid, invalid)

### Billing (`/billing`)
- Date range selection for billing period
- Generate invoice summary with total usage and cost
- Download invoice as PDF
- View online (if backend provides URL)

### Anomalies (`/anomalies`)
- Table view of all anomalies and invalid readings
- Auto-refresh every 30 seconds
- Read-only observability interface
- Shows timestamp, metric, value, and anomaly reason

## Deployment to Vercel

### Prerequisites
- Vercel account ([sign up free](https://vercel.com/signup))
- Backend API deployed and accessible via HTTPS

### Quick Deploy

1. **Push to Git Repository** (GitHub, GitLab, or Bitbucket)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   
   In Vercel Dashboard > Project Settings > Environment Variables, add:
   
   | Variable | Value | Description |
   |----------|-------|-------------|
   | `NEXT_PUBLIC_QUERY_API_URL` | `https://your-api.com` | Backend API URL |
   | `NEXT_PUBLIC_WS_URL` | `wss://your-api.com/ws/live` | WebSocket URL (optional) |
   | `NEXT_PUBLIC_WS_RECONNECT_DELAY` | `3000` | WS reconnect delay (ms) |
   | `NEXT_PUBLIC_WS_MAX_RETRIES` | `5` | Max WS retry attempts |
   | `NEXT_PUBLIC_POLLING_INTERVAL` | `5000` | Polling interval (ms) |

   **Important**: 
   - Use `https://` for API URL (not `http://`)
   - Use `wss://` for WebSocket URL (not `ws://`)
   - Ensure backend allows CORS from your Vercel domain

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### Manual Deployment via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

### Environment Variables Setup

**For Development:**
```bash
cp .env.example .env
# Edit .env with your local API URLs
```

**For Vercel (Production):**
- Add variables in Vercel Dashboard
- Or use CLI: `vercel env add NEXT_PUBLIC_QUERY_API_URL`

### Post-Deployment Checklist

- [ ] Verify API connection (check browser console)
- [ ] Test all pages: Dashboard, Time Series, Billing, Anomalies
- [ ] Confirm PDF download works
- [ ] Check WebSocket connection (if enabled)
- [ ] Test on mobile devices
- [ ] Review Vercel logs for errors

### Troubleshooting Deployment

**Build Fails:**
```bash
# Test build locally first
npm run build
npm start
```

**API Not Connecting:**
- Check `NEXT_PUBLIC_QUERY_API_URL` has no trailing slash
- Verify CORS is enabled on backend
- Check Vercel logs: Dashboard > Deployments > [your deployment] > Logs

**Environment Variables Not Working:**
- Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after adding variables: `vercel --prod`
- Variables are applied at build time, not runtime

## Development Notes

The application implements comprehensive error handling:

- **Network Errors**: Displayed via error banners with retry functionality
- **WebSocket Disconnection**: Automatic reconnection with exponential backoff
- **Empty States**: Clear messaging when no data is available
- **Loading States**: Visual feedback during API calls

## Type Safety

All API responses and data structures are fully typed using TypeScript interfaces defined in `lib/types.ts`:

- `Reading` - Individual meter reading
- `LatestReadings` - Dashboard data structure
- `TimeSeriesResponse` - Historical data format
- `BillingInvoice` - Invoice data structure
- `AnomalyRecord` - Anomaly data format
- `WebSocketMessage` - WebSocket message format

## Development Notes

### No Mock Data
This project does **not** include hardcoded mock data. All data is fetched from the backend API.

### Code Readability
Code prioritizes clarity and maintainability:
- Explicit naming conventions
- Comments for complex logic
- Separation of concerns (components, hooks, API client)

### WebSocket Implementation
The `useWebSocket` hook provides:
- Automatic reconnection (max 5 retries)
- Connection state management
- Message parsing and error handling
- Clean-up on unmount

## Browser Support

Modern browsers with ES2015+ support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact your system administrator or backend API provider.
