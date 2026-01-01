# Energy Metering UI - Code Organization

> **Note**: For deployment instructions and general project information, see [README.md](./README.md)

This document focuses on code organization, architecture, and development best practices.

## Project Structure

```
energy-metering-ui/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Dashboard (home)
│   ├── billing/             # Billing PDF generation
│   ├── timeseries/          # Time series charts
│   └── anomalies/           # Anomaly data table
├── components/
│   ├── charts/              # Chart components (Recharts)
│   ├── common/              # Reusable UI components
│   ├── forms/               # Form components (NEW)
│   ├── metrics/             # Metric display components
│   └── tables/              # Table components
├── hooks/                   # Custom React hooks
│   ├── useApi.ts           # Generic API call hook
│   ├── useClients.ts       # Client fetching hook (NEW)
│   └── useWebSocket.ts     # WebSocket connection hook
├── lib/                     # Core utilities and API
│   ├── apiClient.ts        # API service layer
│   ├── constants.ts        # App-wide constants (NEW)
│   ├── types.ts            # TypeScript type definitions
│   └── utils.ts            # Utility functions (NEW)
└── ...
```

## Key Files and Their Purpose

### **lib/constants.ts**
Central location for all application constants:
- API URLs and configuration
- Pagination defaults
- Status colors and labels
- HTTP status codes
- Metric names

### **lib/utils.ts**
Reusable utility functions:
- Date formatting (`formatDate`, `formatDateTime`)
- Date helpers (`getStartOfMonth`, `getEndOfMonth`)
- Number formatting
- Filename generation
- Debounce function
- Safe JSON parsing

### **lib/apiClient.ts**
API service layer with typed functions:
- `getLatestReadings()` - Dashboard metrics
- `getTimeSeries()` - Historical data
- `downloadBillingPDF()` - PDF generation
- `getAnomalies()` - Anomaly records
- `getClients()` - Client list
- Custom `ApiError` class for error handling

### **hooks/useClients.ts**
Custom hook for client management:
- Fetches client list on mount
- Auto-selects first client (optional)
- Provides loading and error states
- Reusable across pages

## Component Categories

### Form Components (`components/forms/`)
Reusable form elements:
- **ClientSelector** - Dropdown for client selection
- **DateRangeSelector** - Start/end date inputs

### Common Components (`components/common/`)
UI elements used across pages:
- **LoadingSpinner** - Loading state indicator
- **ErrorBanner** - Error message display
- **EmptyState** - No data placeholder
- **InfoBanner** - Informational banners (info/warning/success/error)
- **ConnectionStatus** - WebSocket connection indicator

### Chart Components (`components/charts/`)
Data visualization:
- **BarChart** - Bar chart visualization
- **PieChart** - Pie chart for distributions
- **MultiLineChart** - Multiple metrics over time
- **SingleMetricChart** - Individual metric chart
- **TimeSeriesChart** - Time series data

## Best Practices

### 1. **Use Constants**
```typescript
// ❌ Bad
const pageSize = 10;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ✅ Good
import { DEFAULT_PAGE_SIZE, API_BASE_URL } from '@/lib/constants';
```

### 2. **Use Utility Functions**
```typescript
// ❌ Bad
const filename = `billing_${clientName.replace(/\s+/g, '_')}_${fromDate}_to_${toDate}.pdf`;

// ✅ Good
import { createBillingFilename } from '@/lib/utils';
const filename = createBillingFilename(clientName, fromDate, toDate);
```

### 3. **Use Custom Hooks**
```typescript
// ❌ Bad - Duplicate client fetching in every page
const [clients, setClients] = useState([]);
useEffect(() => { /* fetch clients */ }, []);

// ✅ Good - Reusable hook
import { useClients } from '@/hooks/useClients';
const { clients, selectedClient, setSelectedClient, loading } = useClients(true);
```

### 4. **Use Reusable Components**
```typescript
// ❌ Bad - Inline form elements
<select value={client} onChange={...}>
  <option>Select Client</option>
  {/* ... */}
</select>

// ✅ Good - Component
<ClientSelector
  clients={clients}
  selectedClient={selectedClient}
  onChange={setSelectedClient}
/>
```

### 5. **Consistent Error Handling**
```typescript
// ✅ Good
try {
  await apiCall();
} catch (err) {
  if (err instanceof ApiError) {
    if (err.status === 404) {
      // Handle not found
    } else {
      // Handle other errors
    }
  }
}
```

## Adding New Features

### Adding a New Page
1. Create page in `app/[pagename]/page.tsx`
2. Use existing hooks: `useClients`, `useApi`
3. Use form components: `ClientSelector`, `DateRangeSelector`
4. Use common components: `LoadingSpinner`, `ErrorBanner`, `EmptyState`
5. Add navigation link in `app/layout.tsx`

### Adding a New API Endpoint
1. Add type definition in `lib/types.ts`
2. Add API function in `lib/apiClient.ts`
3. Use typed parameters and response
4. Handle errors with `ApiError`

### Adding a New Reusable Component
1. Place in appropriate folder (`common/`, `forms/`, `charts/`)
2. Export props interface
3. Make it configurable with props
4. Document usage with JSDoc comments

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_QUERY_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_POLLING_INTERVAL=5000
```

## Maintenance Tips

1. **Keep constants updated** - Add new constants to `lib/constants.ts`
2. **Reuse utilities** - Check `lib/utils.ts` before writing new helper functions
3. **Extract common patterns** - If you write similar code 3+ times, extract it
4. **Type everything** - Use TypeScript types from `lib/types.ts`
5. **Test API changes** - Update `lib/apiClient.ts` when backend changes
6. **Document complex logic** - Add JSDoc comments for complex functions

## Testing Checklist

Before deploying:
- [ ] All pages load without errors
- [ ] Client selector works on all pages
- [ ] Date pickers work correctly
- [ ] PDF download works
- [ ] Error messages display properly
- [ ] Loading states show during API calls
- [ ] Empty states display when no data
- [ ] Console has no errors (check browser DevTools)
