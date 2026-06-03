import { createFileRoute } from "@tanstack/react-router";

function Stub({ title }: { title: string }) {
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
      <div className="mt-6 rounded-xl bg-card border border-line p-8 text-center">
        <p className="text-muted text-sm">Раздел будет доступен в следующем обновлении админки.</p>
        <p className="text-xs text-muted mt-2 font-mono">Данные уже хранятся в БД и читаются на сайте.</p>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/admin/categories")({ component: () => <Stub title="Категории" /> });
