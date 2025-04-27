import { foundersData } from "@/lib/foundersData";
import FounderDetailClient from "./FounderDetailClient";

async function fetchFounderIds() {
  // But since we have static data, we can just return the IDs
  return foundersData?.map((founder) => founder.id);
}

export async function generateStaticParams() {
  const fetchedIds = await fetchFounderIds();
  return fetchedIds.map((id) => ({
    id,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <FounderDetailClient _id={id} />;
}
