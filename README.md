# ClientFlow - CRM for Freelancers

ClientFlow is a professional SaaS web application designed for freelancers and web developers to manage their clients, projects, invoices, and tasks.

## Features

- **Client Management**: Track clients, their contact information, and status
- **Project Management**: Manage projects with status tracking, priorities, and progress
- **Task Management**: Organize tasks with priorities, due dates, and completion tracking
- **Invoice Management**: Create and manage invoices with payment tracking
- **Dashboard Analytics**: Visualize business metrics with charts and statistics
- **Dark/Light Mode**: Toggle between themes with preference persistence
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **JWT Authentication**: Secure authentication with token-based access

## Tech Stack

### Frontend
- Next.js 14 with App Router
- React 18 with TypeScript
- Material UI (MUI) v5
- Framer Motion for animations
- Recharts for data visualization
- Axios for API calls

### Backend
- Django 5.x
- Django REST Framework
- SimpleJWT for authentication
- PostgreSQL database
- django-cors-headers for CORS
- django-filter for filtering

## Project Structure

```
clientflow/
├── src/
│   ├── app/
│   │   ├── api/           # API client configuration
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React contexts (Auth, Theme)
│   │   ├── dashboard/     # Dashboard page
│   │   ├── clients/       # Clients management page
│   │   ├── projects/      # Projects management page
│   │   ├── tasks/         # Tasks management page
│   │   ├── invoices/      # Invoices management page
│   │   ├── settings/      # Settings page
│   │   ├── login/         # Login page
│   │   ├── register/      # Register page
│   │   ├── layout.tsx     # Root layout
│   │   ├── providers.tsx  # Theme and auth providers
│   │   └── theme.ts       # MUI theme configuration
│   └── ...
├── clientflow_api/        # Django backend
│   ├── accounts/          # User authentication
│   ├── clients/           # Client management
│   ├── projects/          # Project management
│   ├── tasks/             # Task management
│   ├── invoices/          # Invoice management
│   ├── activity/          # Activity logging
│   └── clientflow_api/    # Django settings
├── requirements.txt       # Python dependencies
└── package.json         # Node.js dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL 14+

### Frontend Setup

1. Install dependencies:
```bash
cd clientflow
npm install
```

2. Create environment file `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Create and activate virtual environment:
```bash
cd clientflow_api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r ../requirements.txt
```

3. Create environment file `.env`:
```
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=clientflow_db
DB_USER=clientflow_user
DB_PASSWORD=your-password-here
DB_HOST=localhost
DB_PORT=5432
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

4. Create PostgreSQL database:
```bash
createdb clientflow_db
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Create superuser:
```bash
python manage.py createsuperuser
```

7. Run the development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login (get JWT tokens)
- `POST /api/auth/refresh/` - Refresh access token

### Users
- `GET /api/users/me/` - Get current user profile
- `PATCH /api/users/me/` - Update user profile

### Clients
- `GET /api/clients/` - List clients
- `POST /api/clients/` - Create client
- `GET /api/clients/stats/` - Get client statistics
- `PATCH /api/clients/{id}/` - Update client
- `DELETE /api/clients/{id}/` - Delete client

### Projects
- `GET /api/projects/` - List projects
- `POST /api/projects/` - Create project
- `GET /api/projects/stats/` - Get project statistics
- `PATCH /api/projects/{id}/` - Update project

### Tasks
- `GET /api/tasks/` - List tasks
- `POST /api/tasks/` - Create task
- `GET /api/tasks/stats/` - Get task statistics
- `PATCH /api/tasks/{id}/` - Update task
- `POST /api/tasks/{id}/complete/` - Mark task complete

### Invoices
- `GET /api/invoices/` - List invoices
- `POST /api/invoices/` - Create invoice
- `GET /api/invoices/stats/` - Get invoice statistics
- `POST /api/invoices/{id}/send/` - Send invoice
- `POST /api/invoices/{id}/mark_paid/` - Mark as paid

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn clientflow_api.wsgi:application`
5. Add PostgreSQL database
6. Set environment variables
7. Deploy

## License

MIT License
