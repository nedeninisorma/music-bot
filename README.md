
 # 🎶 Music Bot

 \<p align="center"\> \<strong\>Powerful, feature-rich Discord music bot powered by Lavalink and Discord.js.\</strong\> \</p\> \<p align="center"\> \<a href="https://github.com/nedeninisorma/music-bot"\> \<img src="https://img.shields.io/github/stars/nedeninisorma/music-bot?style=for-the-badge&color=ffd700" alt="GitHub Stars"\> \</a\> \<a href="https://github.com/nedeninisorma/music-bot/issues"\> \<img src="https://img.shields.io/github/issues/nedeninisorma/music-bot?style=for-the-badge&color=5865F2" alt="GitHub Issues"\> \</a\> \<a href="https://github.com/nedeninisorma/music-bot/blob/main/LICENSE"\> \<img src="https://img.shields.io/github/license/nedeninisorma/music-bot?style=for-the-badge&color=2ea44f" alt="License"\> \</a\> \<img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js 18+"\> \<img src="https://img.shields.io/badge/Lavalink-Powered-5865F2?style=for-the-badge" alt="Lavalink"\> \</p\> \<p align="center"\> \<a href="#-features"\>Features\</a\> &nbsp;•&nbsp; \<a href="#-installation"\>Installation\</a\> &nbsp;•&nbsp; \<a href="#-commands"\>Commands\</a\> &nbsp;•&nbsp; \<a href="#-architecture"\>Architecture\</a\> &nbsp;•&nbsp; \<a href="#-contributing"\>Contributing\</a\> &nbsp;•&nbsp; \<a href="#-contact"\>Contact\</a\> \</p\>
---

 ## ✨ Overview

 **Music Bot** is a full-featured Discord music system designed for reliable, flexible, and interactive music playback.

 Built around **Discord.js** and **Lavalink**, the project provides much more than basic audio playback. It combines queue management, playlists, audio filters, lyrics, radio streaming, autoplay, persistent libraries, statistics, interactive controls, and a replaceable persistence layer in a single Discord bot.

 > 🎧 **One bot. Everything you need for music.**

---

 ## 📸 Screenshots & Demo

 Add your screenshots or GIFs here to showcase the bot's interface.

 Recommended screenshots:

 - 🎵 Now Playing / Player Panel
- 📋 Queue interface
- 🎛️ Audio filter controls
- 📚 Playlist management
- 📊 Statistics interface
- 🔎 Search selection menu

 Example:

```
![Music Player](./docs/images/player.png)
![Queue](./docs/images/queue.png)
![Playlist](./docs/images/playlist.png)
```

 > **Note:** Store project screenshots inside `docs/images/` to keep the repository organized.

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

```
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
```

 Users can control playback directly through Discord's interactive components without repeatedly typing commands.

---

 ## ⚡ Commands

 The bot supports both **slash commands** and traditional **prefix commands**.

 > **Note:** The exact command set may vary depending on the current project configuration and Discord command registration.

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
├── 📁 lavalink/                 # Lavalink configuration
│
├── 📁 scripts/                  # Setup and utility scripts
│   ├── checkSetup.js
│   └── makeEmojis.js
│
├── 📁 src/
│   │
│   ├── 📁 commands/             # Discord commands
│   │   ├── library/
│   │   └── music/
│   │
│   ├── 📁 components/           # Interactive Discord components
│   │
│   ├── 📁 core/                 # Application core
│   │   ├── data/                # Database abstraction
│   │   ├── handlers/            # Command and event handlers
│   │   └── utils/               # Shared utilities
│   │
│   ├── 📁 events/               # Discord events
│   │
│   └── 📁 music/                # Music engine
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

 You can verify your Node.js and npm versions with:

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

 Then edit `.env`:

```
TOKEN=YOUR_DISCORD_BOT_TOKEN
PREFIX=!

LAVALINK_ID=main
LAVALINK_HOST=localhost
LAVALINK_PORT=2333
LAVALINK_PASSWORD=youshallnotpass
LAVALINK_SECURE=false
```

 > ⚠️ **Security:** Never commit `.env` to Git or expose your Discord bot token.

 ### 4\. Configure Lavalink

 Make sure your Lavalink server is running and that its credentials match the values configured in:

```
lavalink/application.yml
```

 The bot and Lavalink server must use matching connection settings.

 ### 5\. Verify the Installation

 Run the built-in setup checker:

```
node scripts/checkSetup.js
```

 This script can help identify common configuration and Lavalink connection problems.

 ### 6\. Start the Bot

```
npm start
```

 If the configuration is correct, the bot should connect to Discord and initialize its music system.

---

 ## 🔧 Configuration

 Most application-level configuration is handled through environment variables.

 | Variable | Description | Example |
| --- | --- | --- |
| `TOKEN` | Discord bot token | `your-token` |
| `PREFIX` | Prefix command character | `!` |
| `LAVALINK_ID` | Lavalink node identifier | `main` |
| `LAVALINK_HOST` | Lavalink hostname | `localhost` |
| `LAVALINK_PORT` | Lavalink port | `2333` |
| `LAVALINK_PASSWORD` | Lavalink authentication password | `youshallnotpass` |
| `LAVALINK_SECURE` | Enable secure Lavalink connection | `false` |

For production deployments, keep secrets outside the repository and inject them through the deployment environment or a secret-management system.

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

 This abstraction allows the application to switch storage implementations without tightly coupling the music system to a particular database technology.

 ### Adding a Custom Driver

 A custom database driver should integrate with the project's database abstraction layer and provide the required persistence operations.

 Recommended implementation areas include:

 1. Driver initialization
2. Read/write operations
3. Error handling
4. Driver registration
5. Configuration handling
6. Connection lifecycle management

---

 ## 🧪 Development

 For local development:

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

 Then start the application:

```
npm start
```

 ### Recommended Development Workflow

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

 ### Bot does not start

 Check:

```
node --version
npm --version
```

 Then verify that dependencies are installed:

```
npm install
```

 Also check that `.env` exists and contains the required variables.

 ### Lavalink connection fails

 Verify:

 - Lavalink is running.
- `LAVALINK_HOST` is correct.
- `LAVALINK_PORT` is correct.
- `LAVALINK_PASSWORD` matches Lavalink.
- `LAVALINK_SECURE` matches the server configuration.
- The Lavalink version is supported by the project.

 Run:

```
node scripts/checkSetup.js
```

 ### Commands are not appearing

 Discord slash commands may require command registration before they become available.

 Also verify that the bot was invited with the required Discord OAuth2 scopes and permissions.

 ### Audio playback does not work

 Check the Lavalink logs first.

 Then verify:

 1. The Lavalink node is connected.
2. The requested source is supported.
3. The bot can connect to the target voice channel.
4. The bot has the required Discord voice permissions.
5. No firewall or network rule is blocking Lavalink communication.

---

 ## 🔐 Security

 Never commit sensitive credentials.

 At minimum, keep the following values private:

```
TOKEN
LAVALINK_PASSWORD
Database credentials
API keys
Other service secrets
```

 Make sure `.env` is excluded from version control:

```
.env
.env.local
.env.*.local
```

 If a secret is accidentally committed, rotate it immediately.

---

 ## 🤝 Contributing

 Contributions are welcome.

 Before making a significant change, consider opening an issue to discuss the proposed implementation.

 ### Development Process

 Fork the repository and create a feature branch:

```
git checkout -b feature/my-feature
```

 Make your changes and verify the project locally:

```
node scripts/checkSetup.js
npm start
```

 Commit your changes:

```
git add .
git commit -m "feat: add my feature"
```

 Push the branch:

```
git push origin feature/my-feature
```

 Then open a Pull Request.

 ### Commit Convention

 The project can follow Conventional Commits:

```
feat: add autoplay support
fix: resolve queue handling issue
docs: improve installation guide
refactor: simplify player manager
chore: update dependencies
```

 ### Reporting Issues

 For bugs, feature requests, or other problems, open an issue with:

 - A clear title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Relevant logs
- Node.js version
- Lavalink version
- Storage driver
- Relevant configuration details

 **Never include secrets or tokens in an issue.**

---

 ## 📋 Roadmap

 The project is continuously evolving. Planned improvements may include:

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

 For questions, suggestions, bug reports, or general contact:

 **Discord:** `nedeninisorma_`

 You can also open an issue through the GitHub Issues page for project-related problems and feature requests.

---

 ## 🔗 Links

 \<p align="center"\> \<a href="https://github.com/nedeninisorma/music-bot"\> \<img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository"\> \</a\> \<a href="https://github.com/nedeninisorma/music-bot/issues"\> \<img src="https://img.shields.io/badge/Issues-Report%20a%20Problem-5865F2?style=for-the-badge&logo=github" alt="GitHub Issues"\> \</a\> \</p\>
---

 \<p align="center"\> Made with JavaScript. \</p\>
