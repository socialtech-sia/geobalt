import { supabase } from "@/integrations/supabase/client";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export async function uploadFile(bucket: string, file: File, pathPrefix = ""): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const name = `${pathPrefix}${pathPrefix ? "/" : ""}${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(name, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  const { data, error: sErr } = await supabase.storage.from(bucket).createSignedUrl(name, TEN_YEARS);
  if (sErr) throw sErr;
  return data.signedUrl;
}
