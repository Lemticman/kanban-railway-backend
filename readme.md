# 🚂 Kanban Task Manager - Railway Edition

A full-stack Kanban task management application built with Express.js, PostgreSQL, and deployed on Railway.

## 🚀 Features

- **JWT Authentication** - Secure user login and sessions
- **Real-time Task Management** - Create, update, delete, and move tasks
- **Drag & Drop Interface** - Intuitive task board with drag-and-drop
- **Role-based Permissions** - Admin, Manager, and User roles
- **PostgreSQL Database** - Persistent data storage
- **Railway Deployment** - Cloud-hosted and scalable
- **Responsive Design** - Works on desktop and mobile

## 🛠️ Quick Start

### 1. Prerequisites

- Node.js 16+ installed
- Railway account ([railway.app](https://railway.app))
- Git installed

### 2. Deploy to Railway

#### Option A: Deploy from GitHub (Recommended)

1. **Fork this repository** to your GitHub account
2. **Go to Railway** and create new project
3. **Connect your GitHub repo** and deploy
4. **Add PostgreSQL database** to your project
5. **Set environment variables** (see below)

#### Option B: Deploy with Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway init

# Deploy
railway up
```

### 3. Environment Variables

Set these in your Railway project:

```env
DATABASE_URL=your_railway_postgresql_url
JWT_SECRET=your_secure_random_string
NODE_ENV=production
FRONTEND_URL=*
```

### 4. Initialize Database

```bash
# Using Railway CLI
railway run npm run setup

# Or via Railway dashboard
# Go to your service → Deployments → Add build command: npm run setup
```

### 5. Get Your API URL

1. Go to your backend service in Railway
2. Settings → Networking → Generate Domain
3. Copy the URL (e.g., `https://your-app.railway.app`)

## 🔧 Local Development

1. **Clone the repository**:
```bash
git clone <your-repo-url>
cd kanban-railway-backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create environment file**:
```bash
cp .env.example .env
# Edit .env with your Railway PostgreSQL URL
```

4. **Set up database**:
```bash
npm run setup
```

5. **Start development server**:
```bash
npm run dev
```

Server will be running at `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users
- `GET /api/users/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Business Units
- `GET /api/business-units` - Get all business units

### Health Check
- `GET /health` - API health status

## 👥 Demo Accounts

| Username | Password | Role | Access Level |
|----------|----------|------|-------------|
| admin | admin123 | Admin | Full system access |
| john | user123 | User | Assigned tasks only |
| jane | user123 | Business Manager | Department tasks |
| mike | user123 | User | Assigned tasks only |

## 📁 Project Structure

```
kanban-railway-backend/
├── server.js          # Main Express.js server
├── setup-db.js        # Database initialization script
├── package.json        # Dependencies and scripts
├── Dockerfile          # Docker configuration
├── railway.toml        # Railway deployment config
├── .env.example        # Environment variables template
└── README.md           # This file
```

## 🔐 Security Features

- **JWT Authentication** with 24-hour expiration
- **Password Hashing** using bcryptjs
- **Rate Limiting** (100 requests per 15 minutes)
- **CORS Protection** with configurable origins
- **SQL Injection Protection** via parameterized queries
- **Helmet.js** for security headers

## 📊 Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `password_hash`
- `name`
- `role` (admin, business-manager, user)
- `business_unit`
- `is_active`
- `created_at`, `updated_at`

### Tasks Table
- `id` (Primary Key)
- `title`
- `description`
- `status` (todo, inprogress, review, done)
- `priority` (low, medium, high)
- `assignee_id` (Foreign Key)
- `created_by_id` (Foreign Key)
- `due_date`
- `completed_at`
- `created_at`, `updated_at`

### Business Units Table
- `id` (Primary Key)
- `name` (Unique)
- `description`
- `created_at`, `updated_at`

## 🚀 Deployment Checklist

- [ ] Railway account created
- [ ] PostgreSQL database provisioned
- [ ] Environment variables configured
- [ ] Backend deployed and running
- [ ] Database initialized with demo data
- [ ] API health check responds successfully
- [ ] Frontend connected to backend API

## 🛠️ Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Verify `DATABASE_URL` is correctly set
   - Ensure PostgreSQL service is running
   - Check network connectivity

2. **Authentication Errors**
   - Verify `JWT_SECRET` is set
   - Check token expiration (24h default)
   - Ensure correct username/password

3. **CORS Issues**
   - Set `FRONTEND_URL` environment variable
   - For development, use `FRONTEND_URL=*`

4. **API Not Responding**
   - Check Railway logs: `railway logs`
   - Verify service is running on correct PORT
   - Test health endpoint: `/health`

### Useful Commands:

```bash
# View Railway logs
railway logs --follow

# Connect to Railway database
railway connect

# Run database setup
railway run npm run setup

# Check service status
railway status
```

## 🌐 Frontend Integration

Use the provided `index.html` file to connect to your Railway API:

1. Open the frontend HTML file
2. Enter your Railway API URL (e.g., `https://your-app.railway.app`)
3. Login with demo credentials
4. Start managing tasks!

## 📈 Performance & Scaling

- **Connection Pooling**: Configured for optimal database performance
- **Database Indexes**: Added for frequently queried columns
- **Auto-scaling**: Railway automatically scales based on demand
- **Health Checks**: Built-in monitoring and restart policies

## 🔄 Development Workflow

1. **Make Changes**: Edit code locally
2. **Test Locally**: `npm run dev`
3. **Commit & Push**: Git workflow
4. **Auto-Deploy**: Railway automatically deploys from GitHub

## 📝 License

MIT License - feel free to use this project for your own applications!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **PostgreSQL Docs**: [postgresql.org/docs](https://www.postgresql.org/docs/)
- **Express.js Docs**: [expressjs.com](https://expressjs.com/)

---

## 🎉 You're All Set!

Your Railway-powered Kanban board is ready for production use! 

**Next Steps:**
1. Deploy to Railway ✅
2. Set up your database ✅
3. Connect your frontend ✅
4. Start managing tasks! 🚀

Happy task managing! 📋✨