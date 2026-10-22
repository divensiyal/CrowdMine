import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function getStoredAuth() {
  const storedAuth = localStorage.getItem("crowdmine_auth");

  if (!storedAuth) {
    return {
      user: null,
      token: null,
    };
  }

  try {
    return JSON.parse(storedAuth);
  } catch {
    localStorage.removeItem("crowdmine_auth");

    return {
      user: null,
      token: null,
    };
  }
}

export function AuthProvider({ children }) {
  const storedAuth = getStoredAuth();

  const [user, setUser] = useState(storedAuth.user);
  const [token, setToken] = useState(storedAuth.token);

  function login(authData) {
    const authState = {
      user: {
        id: authData.user_id,
        username: authData.username,
        email: authData.email,
      },
      token: authData.access_token,
    };

    setUser(authState.user);
    setToken(authState.token);

    localStorage.setItem(
      "crowdmine_auth",
      JSON.stringify(authState)
    );
  }

  function logout() {
    setUser(null);
    setToken(null);

    localStorage.removeItem("crowdmine_auth");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}