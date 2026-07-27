import PublicContentList from "@/components/PublicContentList";

export default async function Page({ searchParams }: { searchParams: Promise<{ kategori?: string }> }) {
  const { kategori } = await searchParams;
  return <PublicContentList section="business" category={kategori} />;
}
