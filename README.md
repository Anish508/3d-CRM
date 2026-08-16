# 3d-CRM

Professional Invoice, Quotation & Payment Receipt PDF Generator with brand logo integration, predefined product catalog, real-time A4 document preview, direct vector PDF export, and instant WhatsApp sharing.

## Features
- **3 Document Types**: Generate **Invoice**, **Quotation**, and **Payment Receipt**.
- **Brand Logo Integration**: Prominently embeds HERITAGE logo (`logo.png`).
- **Predefined Product Catalog**: Quick selection from pre-loaded 3D & Design services.
- **Editable Line Items**: Dynamic addition, editing of titles, specs, quantities, prices, and totals.
- **Financial Controls**:
  - Tax / GST enable/disable toggle and custom tax rates.
  - Percentage or fixed amount discounts.
  - Extra charges & shipping fee inputs.
  - Multi-currency support (Default: `₹ INR`).
- **Bank Account Details Selector**: Select between 3D Business Bank Account, Customer Receipt / UPI QR details, Custom details, or hide bank details.
- **Custom PDF Renaming**: Custom filename prompt when clicking **Download PDF**.
- **Direct WhatsApp Sharing**: Generates pre-formatted client message and opens direct WhatsApp chat (`https://wa.me/`).
- **Mobile Responsive**: Fully adaptive desktop split view and mobile tab switcher with sticky action bar.
- **Computer-Generated Notice**: Footer notice certifying electronic document status.

## Technologies Used
- HTML5, CSS3, JavaScript (ES6+)
- `html2pdf.js` for client-side vector PDF generation
- Font Awesome 6.4.0 & Google Fonts (Outfit, Plus Jakarta Sans, JetBrains Mono)

## Setup & Running
Simply open `index.html` in any web browser or serve static files locally:
```bash
python -m http.server 8080
```
Then visit `http://localhost:8080/`.
