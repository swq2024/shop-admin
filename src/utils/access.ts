import { useCookies } from "@vueuse/integrations/useCookies.mjs";

const cookie = useCookies();
const TOKENKEY = "admin-token";

export const getToken = () => cookie.get(TOKENKEY);

export const setToken = (token: string) => cookie.set(TOKENKEY, token);

export const removeToken = () => cookie.remove(TOKENKEY);


