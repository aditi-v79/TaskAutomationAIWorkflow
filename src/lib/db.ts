import Database from 'better-sqlite3';
import { join } from 'path';
import type { Workflow, WorkflowExecution } from '../types/workflow';

const DB_PATH = join(process.cwd(), 'data', 'workflow.db');

class DatabaseConnection {
  private static instance: Database.Database | null = null;

  static getInstance(): Database.Database {
    if (!this.instance) {
      this.instance = new Database(DB_PATH, {
        verbose: console.log,
        fileMustExist: true
      });
      
      // Enable WAL mode and set pragmas for better performance
      this.instance.pragma('journal_mode = WAL');
      this.instance.pragma('synchronous = NORMAL');
      this.instance.pragma('foreign_keys = ON');
    }
    return this.instance;
  }

  static closeConnection() {
    if (this.instance) {
      this.instance.close();
      this.instance = null;
    }
  }
}

export const workflowDb = {
  getAll: () => {
    const db = DatabaseConnection.getInstance();
    return db.prepare(`
      SELECT 
        w.*,
        json_group_array(DISTINCT e.id) as execution_ids
      FROM workflows w
      LEFT JOIN executions e ON w.id = e.workflow_id
      GROUP BY w.id
      ORDER BY w.created_at DESC
    `).all();
  },

  getById: (id: string) => {
    const db = DatabaseConnection.getInstance();
    return db.prepare(`
      SELECT 
        w.*,
        json_group_array(DISTINCT e.id) as execution_ids
      FROM workflows w
      LEFT JOIN executions e ON w.id = e.workflow_id
      WHERE w.id = ?
      GROUP BY w.id
    `).get(id);
  },

  create: (workflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at'>) => {
    const db = DatabaseConnection.getInstance();
    const id = crypto.randomUUID();

    const stmt = db.prepare(`
      INSERT INTO workflows (id, name, description, tasks, connections, status)
      VALUES (@id, @name, @description, @tasks, @connections, @status)
    `);

    db.transaction(() => {
      stmt.run({
        id,
        ...workflow,
        tasks: JSON.stringify(workflow.tasks),
        connections: JSON.stringify(workflow.connections)
      });
    })();

    return workflowDb.getById(id);
  },

  update: (id: string, workflow: Partial<Workflow>) => {
    const db = DatabaseConnection.getInstance();
    const sets = Object.keys(workflow)
      .map(key => `${key} = @${key}`)
      .join(', ');

    const stmt = db.prepare(`
      UPDATE workflows 
      SET ${sets}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = @id
    `);

    db.transaction(() => {
      stmt.run({ id, ...workflow });
    })();

    return workflowDb.getById(id);
  }
};

export const executionDb = {
  create: (execution: Omit<WorkflowExecution, 'id' | 'started_at' | 'completed_at'>) => {
    const db = DatabaseConnection.getInstance();
    const id = crypto.randomUUID();

    const stmt = db.prepare(`
      INSERT INTO executions (id, workflow_id, status, logs)
      VALUES (@id, @workflow_id, @status, @logs)
    `);

    db.transaction(() => {
      stmt.run({
        id,
        ...execution,
        logs: JSON.stringify(execution.logs)
      });
    })();

    return id;
  },

  updateStatus: (id: string, status: WorkflowExecution['status'], logs?: any[]) => {
    const db = DatabaseConnection.getInstance();
    
    const stmt = db.prepare(`
      UPDATE executions 
      SET 
        status = ?,
        logs = CASE WHEN ? IS NOT NULL THEN ? ELSE logs END,
        completed_at = CASE WHEN ? IN ('completed', 'failed') THEN CURRENT_TIMESTAMP ELSE NULL END
      WHERE id = ?
    `);

    db.transaction(() => {
      stmt.run(
        status,
        logs ? JSON.stringify(logs) : null,
        logs ? JSON.stringify(logs) : null,
        status,
        id
      );
    })();
  }
};

// Ensure connection is closed when the application exits
process.on('exit', () => {
  DatabaseConnection.closeConnection();
});