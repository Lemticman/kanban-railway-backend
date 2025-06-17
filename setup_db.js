const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function setupDatabase() {
  try {
    console.log('🔧 Setting up Railway PostgreSQL database...');

    // Create business_units table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS business_units (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        business_unit VARCHAR(50) DEFAULT 'corporate',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'inprogress', 'review', 'done')),
        priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
        assignee_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_by_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        due_date DATE,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by_id);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
    `);

    console.log('✅ Database tables created successfully');

    // Insert business units
    const businessUnits = [
      { name: 'Corporate', description: 'Corporate headquarters' },
      { name: 'Leasing', description: 'Property leasing division' },
      { name: 'Abattoir', description: 'Meat processing facility' },
      { name: 'GenMeat', description: 'General meat products' },
      { name: 'Porkland', description: 'Pork processing division' },
      { name: 'RANC', description: 'Regional agricultural network' },
      { name: 'GreenAtom', description: 'Sustainable agriculture division' }
    ];

    for (const unit of businessUnits) {
      await pool.query(
        'INSERT INTO business_units (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [unit.name, unit.description]
      );
    }

    console.log('✅ Business units inserted');

    // Hash passwords and insert demo users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const demoUsers = [
      {
        username: 'admin',
        password_hash: adminPassword,
        name: 'System Administrator',
        role: 'admin',
        business_unit: 'corporate'
      },
      {
        username: 'john',
        password_hash: userPassword,
        name: 'John Smith',
        role: 'user',
        business_unit: 'corporate'
      },
      {
        username: 'jane',
        password_hash: userPassword,
        name: 'Jane Doe',
        role: 'business-manager',
        business_unit: 'leasing'
      },
      {
        username: 'mike',
        password_hash: userPassword,
        name: 'Mike Johnson',
        role: 'user',
        business_unit: 'abattoir'
      }
    ];

    for (const user of demoUsers) {
      await pool.query(
        `INSERT INTO users (username, password_hash, name, role, business_unit) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (username) DO NOTHING`,
        [user.username, user.password_hash, user.name, user.role, user.business_unit]
      );
    }

    console.log('✅ Demo users created');

    // Insert sample tasks
    const sampleTasks = [
      {
        title: 'Welcome to Railway Kanban!',
        description: 'This is your first task. You can drag it between columns or use the buttons below.',
        status: 'todo',
        priority: 'medium',
        assignee_id: 1,
        created_by_id: 1,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        title: 'Set up Railway database',
        description: 'Connect your application to Railway PostgreSQL for persistent storage.',
        status: 'done',
        priority: 'high',
        assignee_id: 1,
        created_by_id: 1,
        completed_at: new Date().toISOString()
      },
      {
        title: 'Test drag and drop functionality',
        description: 'Make sure tasks can be moved between columns smoothly.',
        status: 'inprogress',
        priority: 'medium',
        assignee_id: 2,
        created_by_id: 1
      },
      {
        title: 'Review user permissions',
        description: 'Ensure users can only see and modify appropriate tasks.',
        status: 'review',
        priority: 'high',
        assignee_id: 3,
        created_by_id: 1
      }
    ];

    for (const task of sampleTasks) {
      await pool.query(
        `INSERT INTO tasks (title, description, status, priority, assignee_id, created_by_id, due_date, completed_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [task.title, task.description, task.status, task.priority, task.assignee_id, task.created_by_id, task.due_date || null, task.completed_at || null]
      );
    }

    console.log('✅ Sample tasks created');
    console.log('🎉 Database setup complete!');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { setupDatabase };