import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nano.atomoquantico',
  appName: 'Átomo Quântico',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    FirebaseAuthentication: {
      providers: ["google.com"],
      skipNativeAuth: false,
      googleWebClientId: "434005661-aumq9bmpm2qb9p5s5pcq0dcvasbh40h0.apps.googleusercontent.com",
    },
  },
};

export default config;