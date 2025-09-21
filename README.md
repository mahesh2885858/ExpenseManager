\*\*\*\*# ExpenseManager 💰

A modern, user-friendly expense management mobile app built with React Native, designed to help users track their finances with ease and efficiency.

## 📱 Overview

ExpenseManager is a cross-platform mobile application that allows users to manage their accounts and track expenses. The app features a clean, intuitive interface with dark/light theme support and internationalization capabilities.

## ✨ Features

- **Account Management**: Create and manage multiple accounts with initial balances
- **Initial Setup Flow**: Guided onboarding process for first-time users
- **Theme Support**: Automatic dark/light theme switching based on system preferences
- **Internationalization**: Multi-language support with i18next
- **Persistent Storage**: Data persistence using MMKV for fast, secure local storage
- **Modern UI**: Clean Material Design 3 interface with React Native Paper
- **State Management**: Efficient state management with Zustand
- **Navigation**: Smooth navigation experience with React Navigation

## 🏗️ Architecture

The app follows a modular architecture with the following structure:

```
src/
├── components/         # Reusable UI components
├── navigation/         # Navigation configuration
├── screens/           # App screens
│   └── InitialSetup/  # Onboarding screens
├── stores/            # Zustand state stores
├── translations/      # Internationalization files
└── types/            # TypeScript type definitions
```

## 🛠️ Tech Stack

- **Framework**: React Native 0.81.1
- **Language**: TypeScript
- **State Management**: Zustand with persistence
- **Storage**: React Native MMKV
- **Navigation**: React Navigation 7
- **UI Library**: React Native Paper (Material Design 3)
- **Internationalization**: i18next + react-i18next
- **Icons**: Material Design Icons

## 📦 Dependencies

### Core Dependencies

- `react-native`: Mobile app framework
- `typescript`: Type safety and better development experience
- `zustand`: Lightweight state management
- `react-native-mmkv`: Fast, secure storage solution
- `react-native-paper`: Material Design 3 components
- `@react-navigation/native`: Navigation library
- `react-i18next`: Internationalization

### Development Dependencies

- `eslint`: Code linting
- `prettier`: Code formatting
- `jest`: Testing framework
- `@types/*`: TypeScript type definitions

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- React Native development environment set up
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ExpenseManager
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **iOS Setup** (iOS only)
   ```bash
   bundle install
   bundle exec pod install
   ```

### Running the App

1. **Start Metro Bundler**

   ```bash
   npm start
   # or
   yarn start
   ```

2. **Run on Android**

   ```bash
   npm run android
   # or
   yarn android
   ```

3. **Run on iOS**
   ```bash
   npm run ios
   # or
   yarn ios
   ```

## 🔧 Development

### Scripts

- `npm start`: Start Metro bundler
- `npm run android`: Run on Android emulator/device
- `npm run ios`: Run on iOS simulator/device
- `npm run lint`: Run ESLint
- `npm test`: Run tests

### Code Structure

#### State Management

The app uses Zustand for state management with persistence:

```typescript
// Example: Account Store
const useAccountStore = create<PositionStore>()(
  persist(
    set => ({
      isInitialSetupDone: false,
      accounts: [],
      // ... actions
    }),
    { name: 'account-storage', storage: createJSONStorage(zustandStorage) },
  ),
);
```

#### Navigation Flow

- **Initial Setup**: Users complete account name and amount setup
- **Main App**: Bottom tab navigation with Home and Transactions tabs
- **Conditional Navigation**: App shows setup flow for new users, main app for returning users

#### Theme System

- Supports both light and dark themes
- Automatically switches based on system preference
- Uses Material Design 3 color system

## 📱 App Flow

1. **First Launch**: Users are guided through initial setup
   - Enter account name
   - Set initial balance (optional)
2. **Main Interface**: Bottom tab navigation

   - Home: Overview and quick actions
   - Transactions: Transaction history

3. **Data Persistence**: All data is stored locally and persists between app sessions

## 🧪 Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Enhancements

- [ ] Expense tracking and categorization
- [ ] Budget management
- [ ] Data visualization and reports
- [ ] Export functionality
- [ ] Multiple account types
- [ ] Cloud synchronization
- [ ] Biometric authentication

## 📞 Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

---

Built with ❤️ using React Native and TypeScript
