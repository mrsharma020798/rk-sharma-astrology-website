/**
 * Pandit R.K. Sharma Jyotish Kendra
 * ------------------------------------------------------------
 * Simple Express backend that:
 *   1. Serves the static frontend (HTML/CSS/JS)
 *   2. Exposes POST /api/contact  -> saves enquiry to data/contacts.json
 *   3. Exposes GET  /api/contacts -> (admin) lists saved enquiries
 *
 * Run:
 *   cd backend
 *   npm install
 *   npm start
 *   -> open http://localhost:3000
 *
 * To forward enquiries to email/WhatsApp instead of (or in addition to)
 * the JSON file, plug in a service like nodemailer or Twilio inside the
 * `saveContact` function below — the comments show where.
 * ------------------------------------------------------------
 */

const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'contacts.json');
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

app.use(express.json());
app.use(express.static(FRONTEND_DIR));

// ---------- Helpers ----------
async function readContacts() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
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
  await fs.writeFile(DATA_FILE, JSON.stringify(contacts, null, 2), 'utf-8');

  // ---- Optional: send an email/WhatsApp notification here ----
  // Example with nodemailer (npm install nodemailer):
  //
  // const nodemailer = require('nodemailer');
  // const transporter = nodemailer.createTransport({ ... SMTP config ... });
  // await transporter.sendMail({
  //   from: 'website@yourdomain.com',
  //   to: 'panditji@example.com',
  //   subject: `Naya sampark: ${entry.name}`,
  //   text: JSON.stringify(entry, null, 2),
  // });
  // --------------------------------------------------------------
}

// ---------- Routes ----------
app.post('/api/contact', async (req, res) => {
  try {
    const { name, phone, service, message, lang } = req.body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Naam avashyak hai.' });
    }
    if (!phone || !/^\d{10}$/.test(String(phone).trim())) {
      return res.status(400).json({ success: false, error: 'Sahi 10 anko ka phone number dalein.' });
    }

    const entry = {
      name: name.trim(),
      phone: phone.trim(),
      service: (service || '').trim(),
      message: (message || '').trim(),
      lang: lang === 'en' ? 'en' : 'hi',
      submittedAt: new Date().toISOString(),
    };

    await saveContact(entry);
    return res.json({ success: true, message: 'Sandesh safaltapoorvak prapt hua.' });
  } catch (err) {
    console.error('Error saving contact:', err);
    return res.status(500).json({ success: false, error: 'Server error, kripya baad mein try karein.' });
  }
});

// Simple admin listing endpoint (no auth — add basic auth before deploying publicly)
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await readContacts();
    res.json({ success: true, count: contacts.length, contacts });
  } catch (err) {
    console.error('Error reading contacts:', err);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`✨ Pandit R.K. Sharma Jyotish Kendra website running at http://localhost:${PORT}`);
});
