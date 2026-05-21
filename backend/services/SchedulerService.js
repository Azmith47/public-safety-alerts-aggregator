const cron = require('node-cron');
const IngestOrchestratorService = require('./IngestOrchestratorService');
const MaintenanceService = require('./MaintenanceService');

class SchedulerService {
    constructor() {
        this.tasks = new Map();
        this.isRunning = false;
    }

    /**
     * Schedule a recurring task using cron expression.
     * name: identifier for the task
     * cronExpression: cron schedule (e.g., for every 5 minutes)
     * fn: async function to execute
     **/
    schedule(name, cronExpression, fn) {
        if (this.tasks.has(name)) {
            console.warn(`Scheduler task "${name}" already exists; skipping.`);
            return;
        }

        const task = cron.schedule(cronExpression, async () => {
            console.log(`[Scheduler] Running task: ${name}`);
            try {
                await fn();
            } catch (err) {
                console.error(`[Scheduler] Task "${name}" failed:`, err.message);
            }
        });

        this.tasks.set(name, task);
        console.log(`[Scheduler] Scheduled task "${name}" with cron "${cronExpression}"`);
    }

    /**
     * Start all scheduled tasks.
     */
    start() {
        if (this.isRunning) {
            console.warn('Scheduler is already running.');
            return;
        }

        for (const [name, task] of this.tasks) {
            task.start();
        }
        this.isRunning = true;
        console.log(`[Scheduler] Started ${this.tasks.size} tasks.`);
    }

    /**
     * Stop all scheduled tasks.
     */
    stop() {
        for (const [name, task] of this.tasks) {
            task.stop();
        }
        this.isRunning = false;
        console.log('[Scheduler] Stopped all tasks.');
    }

    /**
     * Remove a specific task.
     */
    remove(name) {
        const task = this.tasks.get(name);
        if (task) {
            task.stop();
            task.destroy();
            this.tasks.delete(name);
            console.log(`[Scheduler] Removed task "${name}".`);
        }
    }

    /**
     * Get all scheduled tasks.
     */
    getTasks() {
        return Array.from(this.tasks.keys());
    }
}

/**
 * Initialize the ingestion scheduler.
 * Run orchestrator every 5 minutes by default.
 */
function initializeIngestScheduler(schedule = '*/5 * * * *') {
    const scheduler = new SchedulerService();

    // Schedule orchestrator to autodiscover and run collectors
    scheduler.schedule('ingest', schedule, async () => {
        console.log('[Ingest] Running orchestrator...');
        const summary = await IngestOrchestratorService.autodiscoverAndRun();
        console.log('[Ingest] Orchestrator summary:', JSON.stringify(summary, null, 2));
    });

    scheduler.start();
    return scheduler;
}

function initializeMaintenanceScheduler(schedule = process.env.MAINTENANCE_CRON || '0 4 * * *') {
    const scheduler = new SchedulerService();

    scheduler.schedule('maintenance', schedule, async () => {
        console.log('[Maintenance] Running retention cleanup...');
        const summary = await MaintenanceService.cleanup();
        console.log('[Maintenance] Cleanup summary:', JSON.stringify(summary, null, 2));
    });

    scheduler.start();
    return scheduler;
}

module.exports = { SchedulerService, initializeIngestScheduler, initializeMaintenanceScheduler };
