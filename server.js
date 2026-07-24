/**
 * Pandit R.K. Sharma Jyotish Kendra
 */

const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const PORT = process.env.PORT || 8080;

// Contacts file
const DATA_FILE = path.join(__dirname, 'data', 'contacts.json');

// Frontend folder (same folder as server.js)
const FRONTEND_DIR = __dirname;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(FRONTEND_DIR));

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

// ---------- Helpers ----------
async function readContacts() {
    try {
        const raw = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        if (err.code === 'ENOENT') return [];
        throw err;
    }
}

async function saveContact(entry) {
    const contacts = await readContacts();

    contacts.push(entry);

    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });

    await fs.writeFile(
        DATA_FILE,
        JSON.stringify(contacts, null, 2),
        'utf8'
    );
}

// ---------- Contact API ----------
app.post('/api/contact', async (req, res) => {

    try {

        const {
            name,
            phone,
            service,
            message,
            lang
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Name is required'
            });
        }

        if (!phone || !/^\d{10}$/.test(phone.trim())) {
            return res.status(400).json({
                success: false,
                error: 'Valid phone number required'
            });
        }

        await saveContact({
            name: name.trim(),
            phone: phone.trim(),
            service: (service || '').trim(),
            message: (message || '').trim(),
            lang: lang === 'en' ? 'en' : 'hi',
            submittedAt: new Date().toISOString()
        });

        res.json({
            success: true,
            message: 'Message received successfully.'
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });

    }

});

// View Contacts
app.get('/api/contacts', async (req, res) => {

    try {

        const contacts = await readContacts();

        res.json({
            success: true,
            count: contacts.length,
            contacts
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });

    }

});

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok'
    });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
