import HomeClient from "./HomeClient";
import supabaseAdmin from "@/lib/supabaseServer";

export default async function Home() {
  const { data } = await supabaseAdmin
    .from("slides")
    .select("*")
    .order("order", { ascending: true });

  return <HomeClient slides={data ?? []} />;
}