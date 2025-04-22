# Project Context

## Overview
This is a React Native mobile application built using Expo and Expo Router. The project appears to be a vendor management or marketplace application with features for authentication, chat, and admin functionality. It uses Supabase as the backend service and follows a modern React Native architecture.

## Technology Stack
- **Framework**: Expo (v52.0.33)
- **Navigation**: Expo Router (v4.0.17)
- **Backend**: Supabase
- **Language**: TypeScript
- **UI Components**: React Native with various Expo packages
- **State Management**: React Context (based on the context directory)

## Project Structure

### Root Directory
- `.bolt/` - Configuration files for Bolt
- `.expo/` - Expo-specific configuration and cache
- `app/` - Main application code
- `assets/` - Static assets (images, fonts, etc.)
- `components/` - Reusable UI components
- `context/` - React Context providers
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and shared code
- `styles/` - Global styles and theme
- `supabase/` - Supabase client configuration and utilities

### Main Application Structure (`app/`)
The application follows a feature-based routing structure using Expo Router:

1. **(admin)/** - Admin panel and management features
2. **(auth)/** - Authentication-related screens
3. **(chat)/** - Chat functionality
4. **(tabs)/** - Main tab navigation
5. `_layout.tsx` - Root layout component
6. `+not-found.tsx` - 404 error page
7. `context/` - Application-specific context providers

### Key Dependencies
- **UI Components**: 
  - `@expo/vector-icons` - Icon library
  - `expo-blur` - Blur effects
  - `expo-linear-gradient` - Gradient components
  - `lucide-react-native` - Additional icons

- **Navigation**:
  - `@react-navigation/bottom-tabs`
  - `@react-navigation/native`
  - `expo-router`

- **Backend Integration**:
  - `@supabase/supabase-js` - Supabase client

- **Device Features**:
  - `expo-camera` - Camera access
  - `expo-secure-store` - Secure storage
  - `expo-web-browser` - Web browser integration

## Development Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for web:
   ```bash
   npm run build:web
   ```

## Configuration
- `.env` - Environment variables
- `.prettierrc` - Code formatting rules
- `tsconfig.json` - TypeScript configuration
- `app.json` - Expo configuration

## Architecture
The application follows a modern React Native architecture with:
- Feature-based routing
- Component-based UI development
- Context-based state management
- TypeScript for type safety
- Supabase for backend services

## Security
- Uses `expo-secure-store` for secure storage
- Environment variables for sensitive data
- Supabase authentication integration

## Key Features
1. **Authentication System**
   - Dedicated auth directory for login/signup flows
   - Secure storage integration (expo-secure-store)

2. **Chat Functionality**
   - Separate chat module
   - Real-time communication capabilities

3. **Navigation**
   - Tab-based navigation structure
   - File-based routing with Expo Router
   - Error handling with custom 404 page

4. **UI/UX**
   - Custom components library
   - Gesture handling support
   - Blur effects and gradients
   - Haptic feedback
   - Vector icons and symbols
   - Safe area handling
   - SVG support

## Development Setup
1. **Prerequisites**
   - Node.js
   - Expo CLI
   - TypeScript

2. **Available Scripts**
   - `npm run dev`: Start development server
   - `npm run build:web`: Build for web platform
   - `npm run lint`: Run linting

3. **Environment Setup**
   - Uses `.env` file for environment variables
   - Supabase integration for backend services

## Best Practices
1. **Code Organization**
   - Feature-based directory structure
   - Separation of concerns
   - Reusable components
   - Custom hooks for shared logic

2. **Type Safety**
   - TypeScript configuration
   - Expo type definitions
   - React type definitions

3. **Styling**
   - Global styles management
   - Prettier configuration for consistent formatting

## Security Considerations
- Environment variables management
- Secure storage implementation
- Authentication flow

## Performance Optimizations
- Expo's built-in optimizations
- React Native Reanimated for smooth animations
- Efficient navigation structure

## Future Considerations
1. **Scalability**
   - Modular architecture allows for easy expansion
   - Feature-based organization supports team collaboration

2. **Maintenance**
   - Clear project structure aids in maintenance
   - TypeScript reduces runtime errors
   - Consistent code formatting through Prettier

3. **Testing**
   - Consider adding testing setup
   - Implement CI/CD pipeline

## Dependencies
The project uses a comprehensive set of Expo and React Native packages, including:
- Core Expo packages
- Navigation libraries
- UI enhancement packages
- Utility libraries
- Development tools

For a complete list of dependencies, refer to `package.json`.

## Chat Implementation

### Overview
The chat functionality uses Supabase Edge Functions for message handling and real-time subscriptions for live updates. The system supports text messages, read status tracking, and location sharing.

### Core Components

1. **Chat Service (`lib/chatService.ts`)**
   - Manages chat API calls and real-time subscriptions
   - Uses UUID v5 for deterministic chat ID generation
   - Handles authentication via session tokens
   - Implements message operations (send, receive, mark as read)

2. **Edge Function (`supabase/functions/chat/index.ts`)**
   - Processes chat operations with authentication
   - Supports message sending, retrieval, and status updates
   - Implements comprehensive error handling and logging
   - Enforces security through authentication checks

3. **Chat Screen (`app/(chat)/[id].tsx`)**
   - Provides real-time chat interface
   - Handles message sending and receiving
   - Implements error handling and retry functionality
   - Manages read status and location sharing

### Security & Error Handling

1. **Authentication**
   - Session-based token authentication
   - User verification for all operations
   - Secure session management

2. **Error Management**
   - Client-side retry mechanisms
   - Detailed error logging
   - User-friendly error messages
   - Secure error responses

### Message Structure
```typescript
interface Message {
  id?: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at?: string;
  read?: boolean;
  sender_name?: string;
  sender_avatar?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}
```

### Future Improvements
- Message pagination
- Media attachments
- Message reactions
- Typing indicators
- End-to-end encryption
- Offline support 