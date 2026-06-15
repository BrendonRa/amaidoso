# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you will find options to open the app in a development build, Android emulator, iOS simulator, or Expo Go.

## Firebase

The app loads Firebase from `google-services.json` in the frontend root and initializes in `app/_layout.tsx`. Enable Authentication and Firestore in the Firebase console and set security rules before production use.

### Login after migration

The email/password login uses Firebase Authentication (`signInWithEmailAndPassword`). A user document in Firestore is not enough to log in: the same account must exist in **Authentication → Users** with the Email/Password provider enabled in **Authentication → Sign-in method**.

For elderly users, the CPF login is converted to a synthetic Firebase Auth email:

```txt
idoso_00000000000@amaidoso-cpf.com
```

When migrating existing data, create/import those Auth users with that exact email format and the password, then keep the profile data in the `idosos` collection using the Auth UID as the document id.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
