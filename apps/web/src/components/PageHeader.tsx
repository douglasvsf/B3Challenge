type PageHeaderProps = {
  title: string;
  description: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="space-y-2 text-center">
      <h1 className="text-3xl font-semibold text-[var(--color-highlight)]">{title}</h1>
      <p className="text-[var(--color-muted)]">{description}</p>
    </header>
  );
}

