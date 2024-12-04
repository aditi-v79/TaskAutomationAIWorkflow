import Database from 'better-sqlite3';
import Redis from 'ioredis';
import { mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'data');
const dbPath = join(dataDir, 'workflow.db');

async function setupDatabase() {
  // Ensure data directory exists
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }

  // Initialize SQLite database
  const db = new Database(dbPath);

  try {
    // Enable WAL mode for better concurrency
    db.pragma('journal_mode = WAL');
    
    // Create tables with transactions
    db.transaction(() => {
      // Workflows table
      db.exec(`
        CREATE TABLE IF NOT EXISTS workflows (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          tasks JSON NOT NULL,
          connections JSON,
          status TEXT DEFAULT 'idle',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_workflows_status ON workflows(status);
        CREATE INDEX IF NOT EXISTS idx_workflows_created_at ON workflows(created_at);
      `);

      // Executions table
      db.exec(`
        CREATE TABLE IF NOT EXISTS executions (
          id TEXT PRIMARY KEY,
          workflow_id TEXT NOT NULL,
          status TEXT DEFAULT 'running',
          logs JSON,
          started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          completed_at DATETIME,
          FOREIGN KEY (workflow_id) REFERENCES workflows(id)
        );

        CREATE INDEX IF NOT EXISTS idx_executions_workflow ON executions(workflow_id);
        CREATE INDEX IF NOT EXISTS idx_executions_status ON executions(status);
        CREATE INDEX IF NOT EXISTS idx_executions_started_at ON executions(started_at);
      `);
    })();

    console.log('✅ Database setup successful');
    return true;
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    return false;
  } finally {
    db.close();
  }
}

async function setupRedis() {
  const redis = new Redis({
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 3) {
        return null; // Stop retrying
      }
      return Math.min(times * 200, 1000); // Exponential backoff
    }
  });

  try {
    await redis.ping();
    console.log('✅ Redis connection successful');
    return true;
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    return false;
  } finally {
    redis.disconnect();
  }
}

// Run setup
async function main() {
  try {
    const dbSuccess = await setupDatabase();
    const redisSuccess = await setupRedis();

    if (dbSuccess && redisSuccess) {
      console.log('📁 Setup completed successfully');
      console.log('   Database location:', dbPath);
      process.exit(0);
    } else {
      console.error('❌ Setup failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

main();