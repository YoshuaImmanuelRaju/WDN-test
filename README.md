# Water Distribution Portal

A comprehensive web application for managing water distribution networks with real-time monitoring, simulation capabilities, and leak detection.

## Features

### Core Features

- **Network Management**: Upload, visualize, and manage water distribution networks
- **Interactive Visualization**: React Flow-based network visualization with node and pipe details
- **Real-time Alerts**: Monitor leak detection alerts with acknowledgment workflow
- **Cluster Management**: Organize networks into demand clusters
- **Role-based Access**: User and Admin roles with appropriate permissions
- **Authentication**: Secure authentication system using Supabase Auth

### Technical Highlights

- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **State Management**: Zustand for global state, React Query for server state
- **Database**: PostgreSQL (Supabase) with comprehensive schema
- **Real-time Updates**: Supabase Realtime for live data synchronization
- **Network Visualization**: React Flow for interactive network graphs
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DashboardLayout.tsx
│   ├── NetworkVisualization.tsx
│   └── ProtectedRoute.tsx
├── pages/               # Page components
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── NetworksPage.tsx
│   ├── NetworkDetailPage.tsx
│   ├── UploadNetworkPage.tsx
│   ├── AlertsPage.tsx
│   ├── ClustersPage.tsx
│   └── AdminPage.tsx
├── stores/              # Zustand state stores
│   ├── authStore.ts
│   ├── networkStore.ts
│   └── alertStore.ts
├── lib/                 # Utilities and configuration
│   ├── supabase.ts
│   ├── queryClient.ts
│   └── utils.ts
├── types/               # TypeScript type definitions
│   └── index.ts
└── App.tsx              # Main application component
```

## Database Schema

### Tables

- **profiles**: User profiles with role-based access
- **networks**: Water distribution network metadata
- **nodes**: Network nodes (junctions, tanks, reservoirs)
- **pipes**: Connections between nodes
- **clusters**: Demand management clusters
- **simulations**: Simulation job tracking
- **simulation_results**: Detailed simulation outputs
- **leak_alerts**: Leak detection alerts
- **algorithms**: Algorithm registry for simulations
- **audit_logs**: System audit trail

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:
- Users can only access their own data
- Admins have elevated permissions
- Proper data isolation between users

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (database already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Usage

### Creating an Account

1. Navigate to `/register`
2. Fill in your details (first name, last name, email, password)
3. Your account will be created with the "user" role by default

### Uploading a Network

1. Go to Networks > Upload Network
2. Select a JSON or INP file (sample file available at `public/sample-network.json`)
3. Provide a name and optional description
4. Click "Upload Network"

The system supports:
- **JSON format**: Custom format with nodes and pipes arrays
- **INP format**: EPANET input files (processing TBD)

### Visualizing Networks

1. Navigate to a network detail page
2. View the interactive network visualization with:
   - Color-coded nodes by pressure levels
   - Animated pipes showing flow direction
   - Click nodes/pipes to view details
   - Zoom, pan, and minimap controls

### Managing Alerts

1. Navigate to Alerts page
2. View all leak detection alerts
3. Filter by status (all, new, acknowledged, resolved)
4. Acknowledge or resolve alerts as needed

### Admin Features

Admins can access:
- User management
- Algorithm management
- Key management for cluster access
- System monitoring and audit logs

## Sample Data

A sample network file is included at `public/sample-network.json` with:
- 7 nodes (5 junctions, 1 tank, 1 reservoir)
- 7 pipes connecting the nodes
- Realistic hydraulic parameters

## Technology Stack

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side routing
- **Zustand**: Global state management
- **React Query**: Server state management
- **React Flow**: Network visualization
- **Lucide React**: Icon library

### Backend
- **Supabase**: Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Storage for network files

## Future Enhancements

- EPANET simulation integration
- Advanced leak detection algorithms
- Demand forecasting
- Cluster optimization
- Export functionality (CSV, PDF)
- Batch operations
- Advanced analytics and reporting
- Mobile app

## Security

- Row Level Security (RLS) on all tables
- Secure authentication with Supabase Auth
- Role-based access control
- Audit logging for compliance
- Input validation and sanitization

## Performance

- Optimized React Flow rendering
- Lazy loading of routes
- React Query caching
- Database indexes on frequently queried columns
- Efficient state management with Zustand

## Contributing

This is a complete application template. Contributions are welcome for:
- Additional file format parsers
- Enhanced visualization modes
- New algorithm implementations
- Performance optimizations
- UI/UX improvements

## License

MIT License - feel free to use this for your projects!
