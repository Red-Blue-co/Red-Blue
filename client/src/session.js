// Who is signed in: kept in the browser after sign in, cleared on sign out.
// (A demo store: there is no server-side session or token.)
const KEY = 'twotone-user';

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
};

export const setUser = (u) => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ userId: u.userId, userName: u.userName, userMail: u.userMail, createdAt: u.createdAt }));
  } catch {}
  window.dispatchEvent(new Event('twotone-user'));
};

export const clearUser = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event('twotone-user'));
};
