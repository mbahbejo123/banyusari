import PublicContentDetail from "@/components/PublicContentDetail";
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <PublicContentDetail section="housing" slug={slug} />; }
