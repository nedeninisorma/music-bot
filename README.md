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
