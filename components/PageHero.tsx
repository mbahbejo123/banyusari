type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string | null;
};

export default function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="container">
        <p className="eyebrow light">{eyebrow}</p>
        <h1>{title}</h1>
        {description ? <p className="page-hero-copy">{description}</p> : null}
      </div>
    </section>
  );
}
