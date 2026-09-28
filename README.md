# react-sample-poc-project

A standard React sample application that connects to the Library Management System API.

## Project Structure

```
src/
  ├── components/           # Reusable React components
  │   ├── Header.jsx       # App header component
  │   ├── Header.css
  │   ├── BooksList.jsx    # Books list component
  │   └── BooksList.css
  ├── utils/
  │   └── api.js           # Centralized API client
  ├── App.jsx              # Main app component
  ├── App.css
  ├── index.js             # Entry point
  └── index.css
public/
  └── index.html           # HTML template
package.json              # Dependencies
```

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment (optional):**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if your API server is running on a different URL.

3. **Start the development server:**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs tests
- `npm eject` - Ejects from create-react-app (one-way operation)

## Technologies

- **React 18** - UI library
- **React DOM 18** - React DOM renderer
- **React Router DOM 6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Material-UI (MUI)** - Comprehensive component library with pre-built UI components
- **Emotion** - CSS-in-JS library for styling (required by MUI)
- **React Hook Form** - Form handling and validation
- **Material Icons** - 1000+ icons from Material Design

## API Integration

The app connects to the backend API endpoints. Make sure the backend server is running.

## Styling with Material-UI

This project uses Material-UI for all UI components and styling. MUI provides a complete set of pre-built components that follow Material Design principles.

- MUI components are imported from `@mui/material`
- Icons are imported from `@mui/icons-material`
- Styling is done using the `sx` prop for inline styles

### Using MUI Components

```jsx
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

function MyComponent() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5">Title</Typography>
      <Button startIcon={<RefreshIcon />}>Refresh</Button>
    </Box>
  );
}
```

### Common MUI Props

- `sx` - Inline styling with sx prop
- `variant` - Component style variant (h5, body2, contained, etc.)
- `spacing` - Margin/padding (p: 2, m: 1, etc.)
- `display`, `flexDirection`, `justifyContent` - Flexbox utilities
- `color`, `bgcolor` - Color props

## Forms with React Hook Form

For form implementation, use `react-hook-form`:

```jsx
import { useForm } from 'react-hook-form';

function MyForm() {
  const { register, handleSubmit } = useForm();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
    </form>
  );
}
```

## Icons with Material Icons

Use icons from Material Design via `@mui/icons-material`:

```jsx
import { Refresh as RefreshIcon, Error as ErrorIcon } from '@mui/icons-material';

<Button startIcon={<RefreshIcon />}>Refresh</Button>
<Alert icon={<ErrorIcon />}>Error message</Alert>
```

### Quick Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | ❌ | Server health check |
| POST | `/api/v1/librarians/login` | ❌ | Librarian login |
| POST | `/api/v1/books` | ✅ | Create new book |
| GET | `/api/v1/books` | ❌ | List all books |
| GET | `/api/v1/books/{id}` | ❌ | Get book details |
| PUT | `/api/v1/books/{id}` | ✅ | Update book info |
| DELETE | `/api/v1/books/{id}` | ✅ | Delete/archive book |
| POST | `/api/v1/books/{id}/copies` | ✅ | Manage book copies/stock |
| GET | `/api/v1/books/{id}/availability` | ❌ | Check book availability |
| GET | `/api/v1/reports/summary` | ✅ | Get library summary report |

✅ = Requires authentication