import { redirect } from "next/navigation";
import { isAuthed } from "../lib/auth";
import StudioApp from "./StudioApp";

export const dynamic = "force-dynamic";
export const metadata = { title: "Studio — Kasperphi" };

export default async function Studio() {
  if (!(await isAuthed())) redirect("/studio/login");
  return <StudioApp />;
}
