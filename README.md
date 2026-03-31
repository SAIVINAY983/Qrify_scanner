# QRify - Modern QR Code Generator

QRify is a sleek, human-centric QR code generation platform. It allows users to create, manage, and download professional QR codes for various types of data including URLs, plain text, WiFi networks, and Contact Cards.

![QRify Banner](https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=2070&auto=format&fit=crop)

## ✨ Features

- **Multiple Formats:** Support for URLs, Text, Email, Phone, WiFi, and vCards.
- **Secure Dashboard:** Save and manage all your generated QR codes in one place.
- **Advanced Options:** Set expiry dates and password protection for your QR codes.
- **One-Time Use:** Generate "burn after reading" QR codes that expire after a single scan.
- **Premium UI:** Beautiful, responsive design with a modern "Patriotic" (Navy/Red/White) theme.
- **Instant Download:** Export your QR codes as high-quality PNG images.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS (Embedded JavaScript templates), Vanilla CSS
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens) & Cookie-parser
- **QR Generation:** [qrcode](https://www.npmjs.com/package/qrcode) library

## 🚀 Getting Started

### Prerequisites

- Node.js installed on your machine.
- A MongoDB database (Local or MongoDB Atlas).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/saivinay983/Qrify_scanner.git
   cd Qrify_scanner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your credentials:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser and visit `http://localhost:3000`.

## 🌐 Deployment

### Render (Recommended for Backend)
1. Connect your GitHub repository to [Render](https://render.com/).
2. Set the **Build Command** to `npm install`.
3. Set the **Start Command** to `npm start`.
4. Add your `.env` variables in the **Environment** tab.

### Vercel
1. Connect your GitHub repository to [Vercel](https://vercel.com/).
2. Vercel will automatically detect the `vercel.json` configuration.
3. Add your environment variables in the project settings.

## 📄 License

This project is licensed under the ISC License.

---
Built with ❤️ for a better web experience.
