# Safaristan mobile app

Android app (Expo / React Native) for the Safaristan website. It uses the same
Django backend (`https://safristan.com/api/...`), so tours, hotels, cars and
places added in the admin panel show up in the app straight away, and bookings
from the app land in the same admin panel and send the same email alert.

## Screens

| App | Website page |
|---|---|
| Home tab: hero video, search, featured tours, destinations, popular hotels | `/` |
| Tours / Hotels / Sightseeing / Rent a Car tabs: search, filters, infinite scroll | `/tours`, `/hotels`, `/sightseeing`, `/rent-a-car` |
| Detail screens with photo gallery and booking form | `/tours/[slug]` etc. |
| Destinations | `/destinations` |
| Make My Trip | `/make-my-trip` |

Routes live in `src/app/` (Expo Router), shared UI in `src/components/`,
API calls and colours in `src/lib/`.

## Run on your phone (quickest)

1. Install **Expo Go** from the Play Store.
2. In this folder: `npm install` (first time only), then `npx expo start`.
3. Scan the QR code with Expo Go (phone and PC on the same Wi-Fi).

## Settings (optional) — `mobile/.env`

```
EXPO_PUBLIC_API_URL=https://safristan.com        # backend; for a local backend use your PC's Wi-Fi IP, e.g. http://192.168.1.10:8001
EXPO_PUBLIC_WHATSAPP_NUMBER=923150572710
EXPO_PUBLIC_CONTACT_EMAIL=
EXPO_PUBLIC_OFFICE_ADDRESS=
```

Restart `npx expo start` after changing it. Values are baked into a build, so
rebuild the APK after changing them.

## Build an APK

**On this PC** (Android SDK is installed):

```
npx expo prebuild --platform android
cd android
gradlew assembleRelease
```

The APK is `android/app/build/outputs/apk/release/app-release.apk`. Copy it to a
phone and open it to install. This APK is signed with the debug key — fine for
testing and sharing, not for the Play Store.

**For the Play Store** (needs a free Expo account and a $25 Google Play
developer account):

```
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile production
```

This builds a signed `.aab` in the cloud; upload it in the Play Console. Raise
`version` and `android.versionCode` in `app.json` for every new upload.
