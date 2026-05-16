[![Watch Live](https://img.shields.io/badge/▶_Watch_Live-YouTube-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/@TheEfficientDev)
[![Trading Bot](https://img.shields.io/badge/Trading_Bot-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/felix-helleckes/TradingBot)
[![Portfolio](https://img.shields.io/badge/Portfolio-felix--helleckes.github.io-0a66c2?style=for-the-badge&logo=github)](https://felix-helleckes.github.io/)

# 🔥 SteamRoast

> **Face your Pile of Shame. This is the way.**

A brutally honest Steam library analyzer that exposes your gaming habits in the most entertaining way possible. See exactly how much money you've wasted, how many games you'll never play, and get roasted by deterministic shame metrics.

**🌐 Live:** [steamroaster.netlify.app](https://steamroaster.netlify.app/)

---

## 📸 Live Preview

![SteamRoast Screenshot](./screenshot.png)

---

## 🎯 What It Does

SteamRoast pulls your Steam library and generates a brutally honest analysis of your gaming habits:

- **💰 Sunk Cost:** How much money you've wasted on games with 0 hours playtime
- **⏰ Life Burned:** How many years of your life you've spent gaming
- **🎮 Shame Score:** A deterministic metric (0-100) that roasts your purchasing discipline
- **📊 Reality Check:** Your completion rate, total hours, average hours per game, and more
- **🔥 Hot Take:** A controversial, witty conclusion about your gaming character

All results are **instantly shareable** on X (Twitter) or copy-pasteable to Reddit, Discord, and beyond.

---

## ✨ Features

- ✅ **Secure Steam Login:** OpenID authentication—we never store your password
- ✅ **Instant Analysis:** Real-time Steam API data pulls your game library
- ✅ **Deterministic Roasts:** No AI delays—fast, reliable fact-based results  
- ✅ **Shareable Outputs:** High-contrast KPI cards + one-click X share button
- ✅ **Dark Mode Theme:** Mando-inspired sleek UI for late-night shame sessions
- ✅ **Monetization Ready:** Coffee donation link + content engagement loop built-in
- ✅ **Netlify Deployed:** Fast, serverless, auto-scaling infrastructure

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js 16 (App Router) + React 19 + TypeScript |
| **Styling** | Tailwind CSS v4 + custom theme |
| **Auth** | Custom Steam OpenID 2.0 implementation |
| **Database** | httpOnly JWT cookies (stateless) |
| **APIs** | Steam Web API + Google Gemini (optional) |
| **Hosting** | Netlify (serverless functions) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm/pnpm
- Steam API Key: [https://steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey)

### Installation

`ash
# Clone the repo
git clone https://github.com/yourusername/steamroast.git
cd steamroast

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Steam API Key, NEXTAUTH_URL, NEXTAUTH_SECRET

# Run dev server
npm run dev
`

Open [http://localhost:3000](http://localhost:3000) to test locally.

### Build & Deploy

`ash
# Production build
npm run build

# Test production locally
npm run start

# Deploy to Netlify (automatic on git push if connected)
`

---

## 📊 Environment Variables

`nv
# Steam Web API Key
STEAM_API_KEY=your_steam_api_key

# Your site URL (no trailing slash)
NEXTAUTH_URL=https://steamroaster.netlify.app

# JWT signing secret (generate: openssl rand -base64 32)
NEXTAUTH_SECRET=your_random_secret

# Optional: Average game price for sunk cost estimates (default: 20)
DEFAULT_GAME_PRICE_EUR=20
`

---

## 🎬 Content & Growth Strategy

This project is part of the **100k Subscriber Mission** on YouTube.

### Distribution Channels
- **TikTok/Shorts:** "Shame Score reveals" with your worst backlog stats
- **Reddit:** Organic posts on r/Steam, r/pcgaming with data-driven insights
- **X/Twitter:** One-click share with controversial hot takes
- **Discord:** Community challenges ("Highest Shame Score" leaderboards)

### Viral Hooks
- "I analyzed my Steam library and found €1920 in unplayed games"
- "My Shame Score: 100/100 — Your Steam account is a financial crime"
- "Burned 2.27 years of life in 341 games"

---

## 💡 Ideas for Extensions

- [ ] Leaderboard: global shame scores
- [ ] Historical tracking: watch your shame score evolve monthly
- [ ] Team mode: compare shame scores with friends
- [ ] Wishlist analysis: predict future backlog bloat
- [ ] Revenue: premium reports, sponsorships, affiliate links

---

## 📝 License

MIT

---

## 🙏 Support

If SteamRoast has made you laugh (or cry), consider:
- **Buy me a coffee:** [paypal.me/sparky512](https://paypal.me/sparky512)
- **Subscribe:** [youtube.com/@TheEfficientDev](https://www.youtube.com/@TheEfficientDev)
- **Share:** Drop your Shame Score on Reddit or X

---

**Built with 🔥 by [The Efficient Dev](https://www.youtube.com/@TheEfficientDev)**
