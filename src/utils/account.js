export const ACCOUNT_USERS_KEY = "athleevUsers";
export const ACCOUNT_SESSION_KEY = "athleevSession";

export const accountEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const accountMobilePattern = /^\d{10}$/;

export const normalizeAccountEmail = (emailValue) => emailValue.trim().toLowerCase();
export const normalizeAccountMobile = (mobileValue) => mobileValue.replace(/\D/g, "");

export const getAccountUserName = (user) =>
  user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(" ");

export const readAccountUsers = () => {
  if (typeof window === "undefined") return [];

  try {
    const users = JSON.parse(window.localStorage.getItem(ACCOUNT_USERS_KEY) || "[]");
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
};

export const saveAccountUsers = (users) => {
  window.localStorage.setItem(ACCOUNT_USERS_KEY, JSON.stringify(users));
};

export const readAccountSession = () => {
  if (typeof window === "undefined") return null;

  try {
    const session = JSON.parse(window.localStorage.getItem(ACCOUNT_SESSION_KEY) || "null");
    if (!session?.email) return null;

    const user = readAccountUsers().find((accountUser) => accountUser.email === session.email);
    return user ? { ...session, ...user } : null;
  } catch {
    window.localStorage.removeItem(ACCOUNT_SESSION_KEY);
    return null;
  }
};

export const readCurrentAccountUser = () => {
  const session = readAccountSession();
  return session ? readAccountUsers().find((user) => user.email === session.email) || null : null;
};

export const createAccountSalt = () => {
  const values = new Uint8Array(16);
  crypto.getRandomValues(values);
  return Array.from(values, (value) => value.toString(16).padStart(2, "0")).join("");
};

export const hashAccountPassword = async (password, salt) => {
  if (!crypto?.subtle) {
    throw new Error("Secure password storage is not available in this browser.");
  }

  const encoded = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest), (value) =>
    value.toString(16).padStart(2, "0"),
  ).join("");
};

export const writeAccountSession = (user, extra = {}) => {
  const session = {
    email: user.email,
    signedInAt: new Date().toISOString(),
    ...extra,
  };

  window.localStorage.setItem(ACCOUNT_SESSION_KEY, JSON.stringify(session));
  return { ...session, ...user };
};

export const clearAccountSession = () => {
  window.localStorage.removeItem(ACCOUNT_SESSION_KEY);
};

export const dispatchAccountSessionChange = () => {
  window.dispatchEvent(new Event("athleev-account-session-change"));
};
