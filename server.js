import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import https from 'https';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3001',
        'https://h-arshal.github.io',
        process.env.RENDER_EXTERNAL_URL,
        /\.onrender\.com$/
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// --- Keep-Alive Ping ---
// Render shuts down free web services after 15 minutes of inactivity.
// This endpoint is used by the self-ping mechanism below.
app.get('/api/ping', (req, res) => {
    res.status(200).send('pong');
});

app.post('/api/generate-pdf', async (req, res) => {
    const { html, settings, filename } = req.body;

    if (!html) {
        return res.status(400).json({ error: 'HTML content is required' });
    }

    let browser;
    try {
        browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
        });
        const page = await browser.newPage();

        // Set the content of the page
        await page.setContent(html, {
            waitUntil: 'networkidle0'
        });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: settings?.pageFormat || 'A4',
            landscape: settings?.orientation === 'landscape',
            printBackground: true,
            margin: {
                top: `${settings?.margins || 10}mm`,
                bottom: `${settings?.margins || 10}mm`,
                left: `${settings?.margins || 10}mm`,
                right: `${settings?.margins || 10}mm`
            }
        });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
            'Content-Disposition': `attachment; filename="${filename || 'document'}.pdf"`
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error('PDF Generation Error:', error);
        res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

// Catch-all route to serve index.html for client-side routing
app.use((req, res) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Backend is running. Frontend build not found in /dist. If you are developing, please use the Vite dev server (port 5173).');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Start the keep-alive interval if running on Render
    const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL;
    if (RENDER_EXTERNAL_URL) {
        console.log(`Keep-alive ping scheduled for ${RENDER_EXTERNAL_URL}/api/ping every 14 minutes.`);
        setInterval(() => {
            console.log(`Sending keep-alive ping to ${RENDER_EXTERNAL_URL}/api/ping...`);
            https.get(`${RENDER_EXTERNAL_URL}/api/ping`, (res) => {
                console.log(`Keep-alive ping successful: ${res.statusCode}`);
            }).on('error', (err) => {
                console.error('Keep-alive ping failed:', err.message);
            });
        }, 14 * 60 * 1000); // 14 minutes in milliseconds
    }
});
