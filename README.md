# 👤 Users Service

## Overview

The Users Service manages user profile data, account settings, and user-related operations for the HandFit application. Built with NestJS and TypeORM, it provides secure user profile management with MySQL database integration.

## 🏗️ Architecture

- **Framework**: NestJS with TypeScript
- **Database**: MySQL with TypeORM
- **Port**: 3004
- **Authentication**: JWT Guard integration
- **Pattern**: Repository Pattern with Service Layer

## 🔧 Core Features

### 1. User Profile Management

- **Profile retrieval** with secure data filtering
- **Profile updates** (username, email, password)
- **Avatar management** with URL storage
- **Account creation timestamps** tracking

### 2. Account Security

- **Password updates** with BCrypt hashing (11 salt rounds)
- **Email uniqueness** validation
- **Username uniqueness** validation
- **Secure password verification** for sensitive operations

### 3. Account Management

- **Account deletion** with password confirmation
- **Profile data export** capabilities
- **User data privacy** protection
- **Secure data handling** practices

## 📡 API Endpoints

### User Profile Routes

```
GET    /api/users/me          - Get current user profile
PUT    /api/users/profile     - Update user profile
PUT    /api/users/avatar      - Update user avatar
DELETE /api/users/account     - Delete user account
```

## 🔒 Security Features

- **JWT Authentication Guard** on all endpoints
- **Password confirmation** for account deletion
- **BCrypt password hashing** with high salt rounds
- **Input validation** with DTOs
- **Conflict detection** for duplicate usernames/emails
- **Secure data filtering** (passwords excluded from responses)

## 🗄️ Database Schema

### Users Table

```sql
- id (int, primary key, auto-increment)
- username (varchar, unique, not null)
- email (varchar, unique, not null)
- passwordHash (varchar, not null)
- avatarUrl (varchar, nullable)
- isActive (boolean, default true)
- createdAt (datetime, not null)
- updatedAt (datetime, not null)
- lastLoginAt (datetime, nullable)
```

## 📝 Data Transfer Objects

### UpdateProfileDto

```typescript
- username?: string (optional, min 3 chars)
- email?: string (optional, valid email format)
- password?: string (optional, min 6 chars)
- confirmPassword?: string (required if password provided)
```

### UpdateAvatarDto

```typescript
- avatarUrl: string (required, valid URL format)
```

### DeleteAccountDto

```typescript
- password: string (required for verification)
```

### Run Service

```bash
cd deploy
docker-compose up --build
```

## 🔄 Service Integration

- **API Gateway**: Routes user management requests
- **Auth Service**: Shares user authentication data
- **Training Service**: Provides user context for workouts
- **Frontend**: Manages user profile interface

## 🛡️ Data Privacy & Security

- **Password exclusion** from API responses
- **Secure password updates** with confirmation
- **Account deletion** with verification
- **Data sanitization** before database operations
- **Error handling** without sensitive data exposure

## 📊 User Data Management

- **Profile completeness** tracking
- **Account activity** monitoring
- **Data consistency** validation
- **Audit trail** for profile changes

## 🔧 Technical Features

- **Repository pattern** for data access
- **Service layer** for business logic
- **DTO validation** with class-validator
- **Exception handling** with custom messages
- **Database transactions** for data integrity
- **TypeORM entity relationships**

## 🎯 User Experience Features

- **Avatar customization** support
- **Profile validation** with helpful error messages
- **Conflict resolution** for duplicate data
- **Secure account deletion** process
- **Real-time profile updates**
