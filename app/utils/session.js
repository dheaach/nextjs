// app/utils/session.js
import Cookies from 'js-cookie';

const SESSION_COOKIE_NAME = 'userSession';

export const setSession = (user) => {
  Cookies.set(SESSION_COOKIE_NAME, JSON.stringify(user), { expires: 1 }); // Expires in 1 day
};

export const getSession = () => {
  const session = Cookies.get(SESSION_COOKIE_NAME);
  return session ? JSON.parse(session) : null;
};

export const clearSession = () => {
  Cookies.remove(SESSION_COOKIE_NAME);
};
