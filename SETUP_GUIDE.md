# CareSupport Dashboard - Setup & Installation Guide

## Project Structure

```
src/
├── layouts/
│   └── MainLayout.tsx              # Main layout wrapper with fixed navbar & sidebar
├── components/
│   ├── Navbar.tsx                  # Top navigation bar
│   └── Sidebar.tsx                 # Left navigation sidebar
├── pages/
│   ├── Home.tsx
│   ├── Verification.tsx
│   ├── Workers.tsx
│   ├── Clients.tsx
│   ├── Jobs.tsx
│   ├── Bookings.tsx
│   ├── Budget.tsx
│   ├── RolesPermission.tsx
│   ├── Rewards.tsx
│   └── Subscription.tsx
├── routes/
│   └── AppRoutes.tsx               # Centralized routing configuration
├── constants/
│   └── colors.ts                   # Color palette & design constants
├── App.tsx                         # Main app component with theme
└── main.tsx                        # Entry point with BrowserRouter
```

## Installation Steps

### 1. Install Dependencies

```bash
npm install react-router-dom
```

All other dependencies (React, MUI, Emotion) are already installed.

### 2. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

## Features Implemented

### ✅ Layout Structure
- **Reusable MainLayout** component that wraps all pages
- Fixed Navbar at the top (height: 64px by default)
- Fixed Sidebar on the left with expand/collapse functionality
- Scrollable main content area

### ✅ Navbar (Top Bar)
- MUI AppBar with modern styling
- Logo with gradient background
- Search bar with Material Design
- Action buttons: "Ask AI", "Export Data", "New Booking"
- Notification badge showing unread count
- Profile avatar dropdown area
- Responsive design (hides buttons on mobile)
- Hamburger menu to toggle sidebar

### ✅ Sidebar (Left Navigation)
- MUI Drawer component (permanent variant)
- Smooth expand/collapse animation
- 10 menu items with icons:
  - Home
  - Verification Queue
  - Workers
  - Clients
  - Jobs
  - Bookings
  - Budget
  - Roles & Permission
  - Rewards
  - Subscription
- Active item highlighting with color change and left border
- Icons change color on hover/active state
- Responsive icons-only mode when collapsed

### ✅ Routing & Navigation
- React Router v6 implementation
- NavLink-based routing for active state persistence
- 10 routes configured:
  - `/` → Home
  - `/verification` → Verification Queue
  - `/workers` → Workers
  - `/clients` → Clients
  - `/jobs` → Jobs
  - `/bookings` → Bookings
  - `/budget` → Budget
  - `/roles-permission` → Roles & Permission
  - `/rewards` → Rewards
  - `/subscription` → Subscription

### ✅ UI/UX Features
- MUI theme with custom colors (#ff6b4a primary, #1a1a2e secondary)
- Smooth transitions and animations
- Responsive design for mobile/tablet/desktop
- Clean typography with proper hierarchy
- Material Design principles throughout

## Component APIs

### MainLayout
```tsx
interface MainLayoutProps {
  children: React.ReactNode;
}
```
Wraps all pages with fixed Navbar and Sidebar.

### Navbar
```tsx
interface NavbarProps {
  onSidebarToggle: () => void;
}
```
Displays top navigation with actions and profile.

### Sidebar
```tsx
interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  drawerWidth: number;
  collapsedDrawerWidth: number;
}
```
Renders navigation menu with expand/collapse functionality.

## Customization Guide

### Change Primary Color
Edit `src/App.tsx` theme palette:
```tsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#your-color-here',
    },
  },
});
```

### Add New Menu Items
Edit `src/components/Sidebar.tsx` - modify the `menuItems` array:
```tsx
const menuItems: MenuItemType[] = [
  { label: 'New Item', icon: <YourIcon />, path: '/new-path' },
  // ...
];
```

Then create:
1. New page in `src/pages/NewItem.tsx`
2. New route in `src/routes/AppRoutes.tsx`

### Customize Navbar Actions
Edit `src/components/Navbar.tsx` - modify buttons in the right section:
```tsx
<Button
  variant="contained"
  startIcon={<YourIcon />}
  onClick={yourHandler}
>
  Your Button
</Button>
```

### Adjust Drawer Widths
Edit `src/layouts/MainLayout.tsx`:
```tsx
const DRAWER_WIDTH = 280;        // Expanded width
const COLLAPSED_DRAWER_WIDTH = 80; // Collapsed width
```

## Styling & Theme

### Using MUI Components
All components use Material-UI's `sx` prop for styling:
```tsx
<Box sx={{ 
  display: 'flex', 
  gap: 2,
  backgroundColor: theme.palette.background.default,
}}>
```

### Color Palette
- Primary: `#ff6b4a` (Orange-Red)
- Secondary: `#1a1a2e` (Dark Blue)
- Background: `#f5f5f5` (Light Gray)
- Text Primary: Uses MUI default
- Text Secondary: Uses MUI default

## Responsive Behavior

The dashboard is fully responsive:
- **Desktop (1200px+)**: Full navbar with all buttons, expanded sidebar default
- **Tablet (600px-1200px)**: Compact navbar, collapsible sidebar
- **Mobile (<600px)**: Minimal navbar, sidebar toggle button, search hidden

## Performance Considerations

1. **Lazy Loading**: Consider lazy-loading pages with React.lazy() for larger apps
2. **Memoization**: Use React.memo() for Navbar and Sidebar if they re-render frequently
3. **State Management**: For complex state, consider Redux, Zustand, or Context API
4. **Code Splitting**: Vite automatically handles code splitting for routes

## Known Limitations & Future Enhancements

1. Sidebar state is local to MainLayout (use Context API for global state)
2. No profile dropdown implemented (can add with Menu component)
3. Search functionality is UI-only (needs backend integration)
4. Notification badge is hardcoded (integrate with real notifications)
5. Consider adding breadcrumbs for better navigation
6. Add dark mode toggle in navbar

## Troubleshooting

### Routing not working?
- Ensure `react-router-dom` is installed: `npm install react-router-dom`
- Verify `<BrowserRouter>` wraps `<App />` in `main.tsx`
- Check that routes match exactly in `AppRoutes.tsx`

### Navbar/Sidebar disappearing?
- Check z-index values in MUI theme
- Ensure MainLayout is wrapping all routed components
- Verify AppBar and Drawer have `position="fixed"`

### Styling issues?
- Clear node_modules and reinstall: `npm install`
- Rebuild TypeScript: `npm run build`
- Check for CSS conflicts in `App.css` and `index.css`

## Next Steps

1. **Add page content** for each section
2. **Integrate backend API** for data fetching
3. **Add authentication** and role-based access control
4. **Implement state management** for global data
5. **Add error boundaries** for better error handling
6. **Set up logging** and monitoring
7. **Optimize performance** with code splitting and lazy loading
