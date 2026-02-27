import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

// Mock fetch for any API calls the Home page triggers
vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
  new Response(JSON.stringify(null), { status: 401 })
));

// Mock wouter to avoid routing issues in tests
vi.mock("wouter", () => ({
  Link: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  useLocation: () => ["/", vi.fn()],
  useRoute: () => [false, {}],
}));

// Mock framer-motion — use importOriginal to get all exports, then override
vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
      h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
      p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
      span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
      section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
      a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
      img: (props: any) => <img {...props} />,
      button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
    useAnimation: () => ({ start: vi.fn(), set: vi.fn() }),
    useInView: () => true,
  };
});

import Home from "../../pages/home";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

describe("Home page", () => {
  it("renders without crashing", () => {
    const { container } = render(<Home />, { wrapper: createWrapper() });
    expect(container).toBeTruthy();
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});
