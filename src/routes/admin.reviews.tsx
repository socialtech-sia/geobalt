import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/reviews")({
  component: () => (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-ink">Отзывы</h1>
      <div className="mt-6 rounded-xl bg-card border border-line p-8 text-center">
        <p className="text-muted text-sm">Раздел будет доступен в следующем обновлении админки.</p>
      </div>
    </div>
  ),
});
