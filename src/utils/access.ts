import { useCookies } from "@vueuse/integrations/useCookies.mjs";
import { md5 } from "js-md5";

const cookie = useCookies();
const TOKENKEY = "admin-token";
const LOCKPWDKEY = "lockScreenPassword";
const LOCKSTATUSKEY = "isLockScreen";

export const getToken = () => cookie.get(TOKENKEY);
export const setToken = (token: string) => cookie.set(TOKENKEY, token);
export const removeToken = () => cookie.remove(TOKENKEY);
//
export const setLockPassword = (value: string) =>
  cookie.set(LOCKPWDKEY, md5(value));
export const getLockPassword = () => cookie.get(LOCKPWDKEY);
export const removeLockPassword = () => cookie.remove(LOCKPWDKEY);
//
export const setLockStatus = (state: boolean) =>
  cookie.set(LOCKSTATUSKEY, state);
export const getLockStatus = () => cookie.get(LOCKSTATUSKEY);
export const removeLockStatus = () => cookie.remove(LOCKSTATUSKEY);
