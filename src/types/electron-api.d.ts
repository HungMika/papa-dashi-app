export {};

declare global {
  interface UserSession {
    id: string;
    username: string;
    email: string;
  }

  interface Window {
    electronAPI: {
      // Đọc ảnh local
      readImage: (imagePath: string) => string;

      // Session liên quan file login-session.json
      getSession: () => UserSession | null;
      setSession: (sessionData: UserSession) => void;
      clearSession: () => void;

      // General (electron-store)
      getUserData: (key: string) => string | null;
      setUserData: (key: string, value: string) => void;
      removeUserData: (key: string) => void;
    };
  }
}
