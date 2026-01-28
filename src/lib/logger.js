import fs from 'fs';
import path from 'path';

/**
 * Log login attempts to a file partitioned by year.
 * Format: [ISO_DATE] | Email: ... | Status: ... | IP: ... | Location: ...
 */
export async function logLogin({ email, status, ip }) {
    try {
        const now = new Date();
        const year = now.getFullYear();
        const logDir = path.join(process.cwd(), 'logs');

        // Create logs directory if it doesn't exist
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        const logFile = path.join(logDir, `login-${year}.log`);

        // Basic IP processing (clean up IPv6 prefixing)
        let cleanIp = ip;
        if (ip === '::1' || ip === '127.0.0.1') {
            cleanIp = 'Localhost';
        } else if (ip && ip.startsWith('::ffff:')) {
            cleanIp = ip.replace('::ffff:', '');
        }

        // Geolocation lookup
        let location = 'Unknown';
        if (cleanIp !== 'Localhost') {
            try {
                const geoRes = await fetch(`http://ip-api.com/json/${cleanIp}?fields=status,country,city`);
                const geoData = await geoRes.json();
                if (geoData.status === 'success') {
                    location = `${geoData.city}, ${geoData.country}`;
                }
            } catch (err) {
                console.error('Geo lookup failed:', err);
            }
        }

        const logEntry = `[${now.toISOString()}] | Email: ${email} | Status: ${status} | IP: ${cleanIp} | Location: ${location}\n`;

        fs.appendFileSync(logFile, logEntry);
        console.log('Login logged:', logEntry.trim());
    } catch (err) {
        console.error('Logging failed:', err);
    }
}
