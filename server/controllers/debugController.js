const pool = require('../config/db');
const os = require('os');
const process = require('process');

const startTime = Date.now();

const getDebugStats = async (req, res) => {
    try {
        // --- USERS ---
        const userCountQuery = await pool.query(
            `SELECT COUNT(*) AS count FROM core.users WHERE is_deleted = false`
        );
        const total_users = parseInt(userCountQuery.rows[0].count, 10);

        const activeSessionsQuery = await pool.query(
            `SELECT COUNT(*) AS count FROM core.sessions`
        );
        const active_sessions = parseInt(activeSessionsQuery.rows[0].count, 10);

        // --- SERVER UPTIME ---
        const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
        const server_uptime = formatUptime(uptimeSeconds);

        // --- DATABASE HEALTH ---
        let db_status = "healthy";
        try {
            await pool.query("SELECT 1");
        } catch (err) {
            db_status = "unhealthy";
        }

        // --- SYSTEM INFO ---
        const totalMemMB = os.totalmem() / 1024 / 1024;
        const freeMemMB = os.freemem() / 1024 / 1024;
        const usedMemMB = totalMemMB - freeMemMB;

        const memory = {
            used: `${usedMemMB.toFixed(2)} MB`,
            total: `${totalMemMB.toFixed(0)} MB`,
            usage_percent: `${((usedMemMB / totalMemMB) * 100).toFixed(2)}%`
        };

        const cpu = {
            load_1m: os.loadavg()[0].toFixed(2),
            load_5m: os.loadavg()[1].toFixed(2),
            load_15m: os.loadavg()[2].toFixed(2),
            cores: os.cpus().length,
            model: os.cpus()[0].model
        };

        const networkInterfaces = os.networkInterfaces();

        // --- NODE + PROCESS INFO ---
        const processMemory = process.memoryUsage();
        const nodeVersion = process.version;
        const platform = os.platform();
        const arch = os.arch();
        const processUptime = formatUptime(Math.floor(process.uptime()));

        // --- RESPONSE ---
        return res.status(200).json({
            timestamp: new Date().toISOString(),
            total_users,
            active_sessions,
            server_uptime,
            process_uptime: processUptime,
            db_status,
            memory,
            cpu,
            node: { version: nodeVersion, platform, arch },
            process_memory: {
                rss: `${(processMemory.rss / 1024 / 1024).toFixed(2)} MB`,
                heapTotal: `${(processMemory.heapTotal / 1024 / 1024).toFixed(2)} MB`,
                heapUsed: `${(processMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`,
                external: `${(processMemory.external / 1024 / 1024).toFixed(2)} MB`
            },
            network_interfaces: networkInterfaces
        });
    } catch (error) {
        console.error("Debug Stats Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Helper to make uptime human-readable
function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
}

module.exports = {
    getDebugStats,
    formatUptime
};
