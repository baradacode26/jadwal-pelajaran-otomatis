# Frontend Setup

## Prerequisites

- Node.js >= 18
- npm atau yarn

## Installation

```bash
cd frontend
npm install
```

## Environment Setup

```bash
cp .env.example .env
```

Edit `.env` dengan konfigurasi API backend.

## Development

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Testing

```bash
npm run test
npm run test:ui
```

## Linting & Formatting

```bash
npm run lint
npm run format
```

## Project Structure

```
src/
├── components/      # Reusable React components
├── pages/          # Page components
├── features/       # Feature modules
├── hooks/          # Custom React hooks
├── services/       # API client
├── store/          # Zustand state management
├── types/          # TypeScript types
├── utils/          # Utility functions
├── styles/         # Global styles
└── App.tsx         # Root component
```

## Component Organization

Components dibagi menjadi:

- **Presentational Components**: UI-only, no business logic
- **Container Components**: Logic + presentational
- **Layout Components**: Page layouts
- **Feature Components**: Feature-specific components

## State Management

Menggunakan Zustand untuk state management:

```typescript
// Create store
const useAuthStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

## API Client

API client menggunakan axios + React Query:

```typescript
const { data, isLoading, error } = useQuery(
  ['schedules'],
  () => apiClient.get('/schedules')
);
```

## Styling

Menggunakan Tailwind CSS dengan ShadcN UI components.

## Icons

Menggunakan Lucide React icons.

## Charts

Menggunakan Recharts untuk visualisasi data.

## Calendar

Menggunakan React Big Calendar untuk tampilan jadwal.
