import { createClient } from "@insforge/sdk";

const baseUrl = import.meta.env.VITE_INSFORGE_URL;
const anonKey = import.meta.env.VITE_INSFORGE_ANON_KEY;

export const insforgeConfigured = Boolean(baseUrl && anonKey);

export const insforge = insforgeConfigured
  ? createClient({ baseUrl, anonKey })
  : null;

export async function callRemodel(body) {
  if (!insforge) {
    throw new Error("Add VITE_INSFORGE_URL and VITE_INSFORGE_ANON_KEY to the project .env, then restart the dev server.");
  }
  const { data, error } = await insforge.functions.invoke("remodel", { body });
  if (error) {
    throw new Error(error.message || "The remodel function failed.");
  }
  const payload = data?.data && !data.action ? data.data : data;
  if (payload?.error) throw new Error(payload.error);
  return payload;
}
