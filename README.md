# पंडित आर.के. शर्मा ज्योतिष केंद्र — Website

Pandit R.K. Sharma (Sirsa, Haryana — near Khatu Shyam Mandir) ke liye complete astrology website.
Phone: **7589466659**

## Structure
```
astrology-website/
├── frontend/          → HTML, CSS, JS (site design)
│   ├── index.html
│   ├── css/style.css
│   └── js/script.js
├── backend/           → Node.js + Express server
│   ├── server.js
│   ├── package.json
│   └── data/contacts.json   (contact form submissions save yahan hoti hain)
└── README.md
```

## Kaise chalayein (Run karein)

1. Node.js installed hona chahiye (v18+ recommended) — https://nodejs.org
2. Terminal kholein aur backend folder mein jaayein:
   ```bash
   cd astrology-website/backend
   npm install
   npm start
   ```
3. Browser mein kholein: **http://localhost:3000**

Backend hi frontend files serve karta hai, isliye ek hi server chalane se poori website chal jaayegi.

## Features
- Poori tarah Hindi mein, mobile-friendly, responsive design
- Hero section mein animated "kundli chakra" (zodiac wheel)
- Saari services list (Kundli, Vastu, Numerology, Palmistry, Vivah/Prem samasya, Career, Vashikaran, Kaala jaadu nivaran, Grah dosh puja)
- Contact form → backend API (`POST /api/contact`) mein save hota hai `backend/data/contacts.json`
- WhatsApp direct message button
- Google Maps embed (Khatu Shyam Mandir, Sirsa ke location par)
- Click-to-call phone number

## Enquiries dekhna (Admin)
Server chalne ke baad browser mein kholein: `http://localhost:3000/api/contacts` — isse abhi tak aayi saari enquiries JSON format mein dikhengi.
> Production mein isko password-protect karna zaroori hai — abhi yeh open hai.

## Email / WhatsApp notification jodna (optional)
`backend/server.js` file mein `saveContact()` function ke andar comment kiya hua nodemailer example hai — usse uncomment karke apni SMTP details daalein taaki har enquiry par email mil sake.

## Customize karna
- Text/content: `frontend/index.html` mein seedha edit karein
- Colors/fonts: `frontend/css/style.css` ke top par `:root` variables mein
- Real photo: `.portrait-frame` div ki jagah `<img>` tag daal sakte hain

## Hosting (live karne ke liye)
Free/paid hosting options: Render, Railway, Vercel (backend ke liye Node hosting chahiye) + domain name khareed kar jod sakte hain.
