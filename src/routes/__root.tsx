import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { RequestModalProvider } from "@/components/request-modal-context";
import { RequestModal } from "@/components/RequestModal";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-black text-ink">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-ink">Lapa nav atrasta</h2>
        <p className="mt-2 text-sm text-muted">Lapa, ko meklē, neeksistē vai ir pārvietota.</p>
        <Link to="/" className="btn-accent mt-6">Uz sākumu</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-ink">Lapa neielādējās</h1>
        <p className="mt-2 text-sm text-muted">Notika kļūda. Mēģini vēlreiz.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-accent">Mēģināt vēlreiz</button>
          <a href="/" className="btn-ghost">Uz sākumu</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "geobalt.lv — Ģeodēzijas aprīkojums un risinājumi" },
      { name: "description", content: "Profesionāli GNSS uztvērēji, lauka datori, nivelieri un mērniecības aprīkojums. Pārdošana, noma un serviss Baltijā." },
      { property: "og:title", content: "geobalt.lv — Ģeodēzijas aprīkojums" },
      { property: "og:description", content: "Profesionāls mērniecības aprīkojums un risinājumi." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="lv">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <RequestModalProvider>
        <div className="flex min-h-screen flex-col bg-paper">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
        <RequestModal />
      </RequestModalProvider>
    </QueryClientProvider>
  );
}
