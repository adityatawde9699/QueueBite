import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // --- State ---
      accessToken: null,
      refreshToken: null,
      user: null,
      
      // The isLoggedIn state is now a derived value.
      // It checks if an accessToken exists.
      isLoggedIn: () => !!get().accessToken,

      // --- Actions ---
      setTokens: (accessToken, refreshToken) => {
        set({
          accessToken,
          refreshToken,
        });
      },

      setUser: (user) => {
        set({ user });
      },

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
        });
      },
    }),
    {
      name: 'auth-storage', // The key in localStorage
      storage: createJSONStorage(() => localStorage),
      // We only need to persist the tokens and user data
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);

// This part is crucial. After the store is created and rehydrated from localStorage,
// we manually update the isLoggedIn flag based on the loaded token.
useAuthStore.subscribe(state => {
    const isLoggedIn = !!state.accessToken;
    if (useAuthStore.getState().isLoggedIn() !== isLoggedIn) {
        // This check prevents an infinite loop
        // We don't need to call set() here as isLoggedIn is a getter
    }
});


export default useAuthStore;
