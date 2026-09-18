Evet, sorun belli. Ekran görüntüsünde **Markdown dosyasını GitHub yerine HTML olarak yorumlayan bir editör/alan** kullanıyorsun gibi görünüyor. Ayrıca önceki cevabımda kullandığım `:::writing` sarmalayıcısı da **README'ye koyulmamalı**.

 Senin istediğin şey doğrudan kopyalanabilir **saf Markdown**. Özellikle `<p align="center">`, `<a>` ve `<img>` etiketleri GitHub README'de çalışır; ancak bunları Markdown'ı desteklemeyen bir alana yapıştırırsan kod olarak görünür.

 GitHub'a koyacaksan aşağıdaki gibi kullan:

````
# 🎶 Music Bot

<p align="center">
  <strong>Powerful, feature-rich Discord music bot powered by Lavalink and Discord.js.</strong>
</p>

<p align="center">
  <a href="https://github.com/nedeninisorma/music-bot">
    <img src="https://img.shields.io/github/stars/nedeninisorma/music-bot?style=for-the-badge&color=ffd700" alt="GitHub Stars">
  </a>
  <a href="https://github.com/nedeninisorma/music-bot/issues">
    <img src="https://img.shields.io/github/issues/nedeninisorma/music-bot?style=for-the-badge&color=5865F2" alt="GitHub Issues">
  </a>
  <a href="https://github.com/nedeninisorma/music-bot/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/nedeninisorma/music-bot?style=for-the-badge&color=2ea44f" alt="License">
  </a>
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js 18+">
  <img src="https://img.shields.io/badge/Lavalink-Powered-5865F2?style=for-the-badge" alt="Lavalink">
</p>

<p align="center">
  <a href="#-features">Features</a>
  &nbsp;•&nbsp;
  <a href="#-installation">Installation</a>
  &nbsp;•&nbsp;
  <a href="#-commands">Commands</a>
  &nbsp;•&nbsp;
  <a href="#-architecture">Architecture</a>
  &nbsp;•&nbsp;
  <a href="#-contributing">Contributing</a>
  &nbsp;•&nbsp;
  <a href="#-contact">Contact</a>
</p>

---

## ✨ Overview

**Music Bot** is a full-featured Discord music system designed for reliable, flexible, and interactive music playback.

Built around **Discord.js** and **Lavalink**, the project provides much more than basic audio playback. It combines queue management, playlists, audio filters, lyrics, radio streaming, autoplay, persistent libraries, statistics, interactive controls, and a replaceable persistence layer in a single Discord bot.

> 🎧 **One bot. Everything you need for music.**

---

## 🚀 Features

### 🎵 Music Playback

- YouTube and Lavalink-supported sources
- Search-based playback
- Direct URL playback
- Queue management
- Skip, seek, replay and stop
- Volume control
- Multiple loop modes
- Play-next functionality

### 🎛️ Audio Controls

- Bass boost
- Nightcore
- 8D audio
- Equalizer
- Custom audio filters
- Dynamic volume control
- Interactive player controls

### 📚 Library & Playlists

- Personal favorites
- Custom playlists
- Queue saving and restoration
- Persistent music library
- Playlist management
- Queue sharing

### 🤖 Smart Playback

- Autoplay
- Song recommendations
- Similar-track discovery
- Interactive search selection
- Automatic queue continuation

### 📻 Radio & Lyrics

- Live radio streaming
- Lyrics lookup
- Currently playing information
- Rich music cards
- Track metadata

### 📊 Statistics & History

- Recently played tracks
- Server statistics
- Playback history
- Usage tracking
- Music analytics

### ⏱️ Automation

- Sleep timer
- Track-based timers
- Automatic voice-channel handling
- Queue-empty handling
- Playback state management

### 🎨 Interactive Experience

- Discord buttons
- Interactive music panel
- Polls and voting
- Custom-generated emojis
- Slash commands
- Prefix commands

---

## 🎧 Player Experience

The bot provides an interactive music panel directly inside Discord.

```text
┌───────────────────────────────────────────────┐
│                  🎵 NOW PLAYING               │
│                                               │
│            Daft Punk — One More Time          │
│                                               │
│              ━━━━━━━━━●━━━━━━                 │
│              02:14 / 05:20                    │
│                                               │
│       ⏮️     ▶️     ⏭️     🔁     🔊          │
│                                               │
│              Queue: 12 tracks                 │
└───────────────────────────────────────────────┘
````

 Users can control playback directly through Discord's interactive components without repeatedly typing commands.

---

 ## ⚡ Commands

 The bot supports both **slash commands** and traditional **prefix commands**.

 ### 🎵 Playback

 | Command | Description |
| --- | --- |
| `/play <query>` | Play a track or search for music |
| `/search <query>` | Search for music |
| `/skip` | Skip the current track |
| `/stop` | Stop playback |
| `/pause` | Pause playback |
| `/resume` | Resume playback |
| `/queue` | Display the current queue |

### 🎛️ Controls

 | Command | Description |
| --- | --- |
| `/volume <level>` | Change playback volume |
| `/seek <time>` | Seek to a specific position |
| `/loop` | Change loop mode |
| `/shuffle` | Shuffle the queue |
| `/remove <position>` | Remove a track from the queue |
| `/move <from> <to>` | Move a queue item |

### 📚 Library

 | Command | Description |
| --- | --- |
| `/playlist save` | Save a playlist |
| `/playlist load` | Load a playlist |
| `/favorite` | Manage favorite tracks |
| `/savequeue` | Save the current queue |

### 🤖 Smart Features

 | Command | Description |
| --- | --- |
| `/autoplay` | Toggle autoplay |
| `/recommend` | Get recommendations |
| `/lyrics` | Display lyrics |
| `/radio` | Stream a radio station |
| `/poll` | Create a music poll |

---

 ## 🛠️ Tech Stack

 \<p align="center"\> \<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"\> \<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"\> \<img src="https://img.shields.io/badge/Discord.js-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord.js"\> \<img src="https://img.shields.io/badge/Lavalink-000000?style=for-the-badge" alt="Lavalink"\> \<img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite"\> \</p\> ### Core

 - **Node.js** — JavaScript runtime
- **Discord.js** — Discord API integration
- **Lavalink** — Audio streaming and playback
- **dotenv** — Environment-based configuration
- **@napi-rs/canvas** — Dynamic graphics and emoji generation

 ### Storage

 The project uses a driver-based persistence layer designed to decouple application logic from a specific storage engine.

 Currently supported storage backends include:

 - SQLite
- MySQL
- JSON
- Text
- Memory
- EngineDB
- Fusion
- Spectral

 This architecture makes it possible to replace the underlying storage implementation without rewriting the core music system.

---

 ## 🏗️ Architecture

 The application is divided into separate layers responsible for Discord interactions, music state, Lavalink communication, and persistence.

```
                    ┌─────────────────────┐
                    │       Discord       │
                    │ Slash / Prefix Cmds │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Handlers      │
                    │ Router / Permissions│
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │  Music System   │        │   Data Layer    │
        │                 │        │                 │
        │ Queue           │        │ SQLite          │
        │ Player          │        │ MySQL           │
        │ Autoplay        │        │ JSON            │
        │ Filters         │        │ Memory          │
        │ Lyrics          │        │ Custom Drivers  │
        └────────┬────────┘        └─────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │     Lavalink    │
        │ Audio Processing│
        └─────────────────┘
```

 ### Data Flow

 1. A user interacts with the bot through Discord.
2. A command or component interaction is handled by the appropriate handler.
3. The music layer manages player state, queues, filters, and playback logic.
4. Lavalink performs the audio processing and streaming.
5. Persistent information is stored through the configured database driver.

---

 ## 📁 Project Structure

```
music-bot/
│
├── 📁 lavalink/
│
├── 📁 scripts/
│   ├── checkSetup.js
│   └── makeEmojis.js
│
├── 📁 src/
│   │
│   ├── 📁 commands/
│   │   ├── library/
│   │   └── music/
│   │
│   ├── 📁 components/
│   │
│   ├── 📁 core/
│   │   ├── data/
│   │   ├── handlers/
│   │   └── utils/
│   │
│   ├── 📁 events/
│   │
│   └── 📁 music/
│       ├── player/
│       ├── queue/
│       ├── filters/
│       ├── autoplay/
│       ├── library/
│       └── statistics/
│
├── .env.example
├── package.json
├── LICENSE
└── README.md
```

---

 ## 🚀 Installation

 ### Prerequisites

 Before installing the bot, make sure the following software is available:

 - **Node.js 18 or newer**
- **npm**
- A registered **Discord application/bot**
- A running **Lavalink server**
- A configured storage backend

 Check your versions:

```
node --version
npm --version
```

 ### 1\. Clone the Repository

```
git clone https://github.com/nedeninisorma/music-bot.git
cd music-bot
```

 ### 2\. Install Dependencies

```
npm install
```

 ### 3\. Configure Environment Variables

 Copy the example environment file:

```
cp .env.example .env
```

 Configure your `.env` file:

```
TOKEN=YOUR_DISCORD_BOT_TOKEN
PREFIX=!

LAVALINK_ID=main
LAVALINK_HOST=localhost
LAVALINK_PORT=2333
LAVALINK_PASSWORD=youshallnotpass
LAVALINK_SECURE=false
```

 > ⚠️ **Never commit your `.env` file or expose your Discord bot token.**

 ### 4\. Configure Lavalink

 Make sure your Lavalink server is running.

 The Lavalink configuration can be found at:

```
lavalink/application.yml
```

 Make sure the Lavalink credentials match your `.env` configuration.

 ### 5\. Check Your Setup

 Run:

```
node scripts/checkSetup.js
```

 This checks the project configuration and Lavalink connection.

 ### 6\. Start the Bot

```
npm start
```

 Your bot should now connect to Discord.

---

 ## 🔧 Configuration

 Most configuration is handled through environment variables.

 | Variable | Description | Example |
| --- | --- | --- |
| `TOKEN` | Discord bot token | `your-token` |
| `PREFIX` | Prefix command character | `!` |
| `LAVALINK_ID` | Lavalink node identifier | `main` |
| `LAVALINK_HOST` | Lavalink hostname | `localhost` |
| `LAVALINK_PORT` | Lavalink port | `2333` |
| `LAVALINK_PASSWORD` | Lavalink authentication password | `youshallnotpass` |
| `LAVALINK_SECURE` | Enable secure Lavalink connection | `false` |

---

 ## 🧩 Database Drivers

 The persistence layer follows a driver-based architecture.

```
┌─────────────────────────┐
│       Database API      │
└────────────┬────────────┘
             │
             ▼
      ┌──────────────┐
      │    Driver    │
      └──────┬───────┘
             │
   ┌─────────┼─────────┐
   ▼         ▼         ▼
 SQLite     MySQL     JSON
   │         │         │
   └─────────┼─────────┘
             ▼
       Application
```

 This abstraction allows the application to switch storage implementations without tightly coupling the music system to a specific database technology.

---

 ## 🧪 Development

 Clone and install the project:

```
git clone https://github.com/nedeninisorma/music-bot.git
cd music-bot
npm install
cp .env.example .env
```

 Run the setup checker:

```
node scripts/checkSetup.js
```

 Start the bot:

```
npm start
```

 ### Development Workflow

```
Create branch
     ↓
Implement change
     ↓
Run checks
     ↓
Test locally
     ↓
Commit changes
     ↓
Push branch
     ↓
Open Pull Request
```

---

 ## 🐛 Troubleshooting

 ### Bot Does Not Start

 Check your Node.js installation:

```
node --version
npm --version
```

 Then reinstall dependencies:

```
npm install
```

 Make sure your `.env` file exists and contains the required configuration.

 ### Lavalink Connection Fails

 Check that:

 - Lavalink is running.
- `LAVALINK_HOST` is correct.
- `LAVALINK_PORT` is correct.
- `LAVALINK_PASSWORD` matches your Lavalink configuration.
- `LAVALINK_SECURE` is configured correctly.
- The bot can reach the Lavalink server.

 Run:

```
node scripts/checkSetup.js
```

 ### Commands Are Not Appearing

 Make sure the bot has been invited with the required Discord OAuth2 scopes and permissions.

 Slash commands may also require command registration before they become available.

 ### Audio Playback Does Not Work

 Check the Lavalink logs and verify:

 1. The Lavalink node is connected.
2. The requested source is supported.
3. The bot can connect to the voice channel.
4. The bot has the required voice permissions.
5. No firewall is blocking Lavalink communication.

---

 ## 🔐 Security

 Never commit sensitive credentials.

 Keep the following values private:

```
TOKEN
LAVALINK_PASSWORD
Database credentials
API keys
Other service secrets
```

 Make sure `.env` is ignored by Git:

```
.env
.env.local
.env.*.local
```

 If a secret is accidentally exposed, rotate it immediately.

---

 ## 🤝 Contributing

 Contributions are welcome!

 ### Development Process

 Create a feature branch:

```
git checkout -b feature/my-feature
```

 Make your changes and test them:

```
node scripts/checkSetup.js
npm start
```

 Commit your changes:

```
git add .
git commit -m "feat: add my feature"
```

 Push your branch:

```
git push origin feature/my-feature
```

 Then open a Pull Request.

 ### Commit Convention

 Recommended commit format:

```
feat: add autoplay support
fix: resolve queue handling issue
docs: improve installation guide
refactor: simplify player manager
chore: update dependencies
```

 ### Reporting Issues

 When opening an issue, include:

 - A clear title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Relevant logs
- Node.js version
- Lavalink version
- Storage driver

 **Never include passwords, tokens, API keys, or other secrets.**

---

 ## 📋 Roadmap

 - [ ] Additional Lavalink integrations
- [ ] Expanded music providers
- [ ] Improved statistics
- [ ] Additional database drivers
- [ ] Enhanced player UI
- [ ] Automated testing
- [ ] Production deployment documentation

---

 ## 📄 License

 This project is licensed under the **MIT License**.

 See the `LICENSE` file for the complete license text.

---

 ## 📞 Contact

 For questions, suggestions, bug reports, or general inquiries:

 **Discord:** `nedeninisorma_`

 For project-related bugs and feature requests, you can also use GitHub Issues.

---

 ## 🔗 Links

 \<p align="center"\> \<a href="https://github.com/nedeninisorma/music-bot"\> \<img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository"\> \</a\> \</p\>
---

 \<p align="center"\> Made with JavaScript. \</p\> \`\`\
