# Overview

Nightfall: Last Stand is a 3D zombie survival game built as a VR-compatible web application. The game features a linear progression through multiple chapters where players fight through zombie-infested environments to reach safety. Players start in an abandoned room, escape to city streets, survive waves of enemies, and ultimately face a boss battle in a cave. The application uses React Three Fiber for 3D rendering, supports both VR and traditional controls, and includes immersive audio and visual effects.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client follows a modern React architecture with TypeScript and uses React Three Fiber for 3D rendering. The main application structure separates game logic from UI components:

- **React Three Fiber**: Handles all 3D scene rendering, lighting, and WebGL interactions
- **Component-based 3D**: Each game entity (Player, Zombie, Boss, Bullet) is a separate React component with its own logic
- **Zustand State Management**: Global game state managed through multiple focused stores (useGameState, useAudio, useGame)
- **Tailwind CSS + Radix UI**: Provides the 2D UI overlay with consistent styling and accessibility

## Backend Architecture
The server uses Express.js with TypeScript and follows a minimal API-first approach:

- **Express Server**: Handles HTTP requests and serves the React application
- **Vite Integration**: Development server with HMR and asset bundling
- **In-Memory Storage**: Simple storage interface for user data (currently using MemStorage)
- **Drizzle ORM**: Database abstraction layer configured for PostgreSQL

## Game Architecture
The game implements a real-time 3D experience with the following core systems:

- **Game Loop**: Central useGameLoop hook manages entity spawning, collision detection, and progression
- **Phase-based Progression**: Game advances through distinct phases (prologue, chapter1, chapter2, chapter3)
- **Entity System**: Modular components for zombies, bullets, and environmental objects
- **Audio System**: Centralized audio management with mute controls and spatial sound
- **VR Support**: Built-in WebXR compatibility through React Three Fiber

## Data Flow Architecture
State management follows a unidirectional flow pattern:

- **Game State**: Central store manages player stats, entities, and game progression
- **Audio State**: Separate store handles all sound-related functionality
- **Component Props**: 3D entities receive state via props and communicate back through store actions
- **Event-driven Updates**: useFrame hooks in components drive real-time updates

# External Dependencies

## 3D Graphics and VR
- **@react-three/fiber**: Core React Three.js integration for 3D rendering
- **@react-three/drei**: Additional Three.js utilities and components
- **@react-three/postprocessing**: Visual effects and post-processing pipeline
- **vite-plugin-glsl**: GLSL shader support for custom visual effects

## UI and Styling
- **@radix-ui/***: Complete UI component library with accessibility features
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Type-safe utility for component variants
- **lucide-react**: Icon library for UI elements

## Database and ORM
- **drizzle-orm**: Type-safe SQL ORM for database operations
- **@neondatabase/serverless**: Serverless PostgreSQL database driver
- **drizzle-kit**: Database migration and schema management tools

## State Management and Utilities
- **zustand**: Lightweight state management with TypeScript support
- **@tanstack/react-query**: Server state management and caching
- **date-fns**: Date manipulation utilities
- **nanoid**: Unique ID generation for game entities

## Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking and enhanced developer experience
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error handling