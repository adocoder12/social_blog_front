# TanStack in this project: learning notes

Two libraries work together:

| Library | Job | Think of it as |
|---|---|---|
| **TanStack Router** | Decides *which page* shows and *what data it needs* | The map of the app |
| **TanStack Query** | *Fetches* data and *remembers* it | The memory box (cache) |

Our folders follow one direction: **route → hook → api → Go API**.
Each layer only talks to the one below it.

---

## Part 1: TanStack Router

### 1. File-based routes

Every file in `src/routes/` is a page. The file name becomes the URL:

| File | URL |
|---|---|
| `src/routes/index.tsx` | `/` |
| `src/routes/profile.tsx` | `/profile` |
| `src/routes/posts/$postId.tsx` | `/posts/1`, `/posts/2`, … |
| `src/routes/__root.tsx` | Wraps every page (header, footer) |

The router plugin reads these files and generates `src/routeTree.gen.ts`, the list of all pages.
**Never edit that file by hand.**

**Why:** adding a page = adding a file. Nothing to register.

---

### 2. `createFileRoute`

Every route file exports a `Route`:

```tsx
export const Route = createFileRoute("/profile")({
  component: ProfilePage, // what to show
  // loader, head, errorComponent… also go here
});
```

**Why:** everything about one page lives in one place.

---

### 3. Dynamic routes: `$postId`

The `$` means "this part of the URL changes".

```tsx
// src/routes/posts/$postId.tsx
const { postId } = Route.useParams(); // "/posts/3" → { postId: "3" }
```

⚠️ URL params are **always strings**, so we use `Number(postId)` when we need a number.

**Why:** one file serves every post.

---

### 4. Typed `<Link>`

```tsx
<Link to="/posts/$postId" params={{ postId: String(post.id) }}>
```

The router knows every page, so TypeScript shows an error if you:
- misspell a route (`"/post/$postId"`)
- forget a param
- link to a page that doesn't exist

**Why:** broken links become editor errors instead of 404s for users.
**Rule:** never use `<a>` for internal pages; always `<Link>`.

---

### 5. `head()` + `<HeadContent />`: page title and meta tags

```tsx
export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Social Blog" },
      { name: "description", content: "Your posts and activity." },
    ],
  }),
  component: ProfilePage,
});
```

`<HeadContent />` in `__root.tsx` writes these into the page's `<head>`.

- The root route sets the **defaults**.
- A deeper route (like a post) **overrides** them.

**Why:** each page gets the right browser tab title and description for search engines.

⚠️ This is a client-side app: social sites (Facebook, X, Slack, WhatsApp) don't run
JavaScript, so their link previews won't see these tags. Google does.

---

### 6. Router context: passing `queryClient` to every route

```tsx
// main.tsx
const router = createRouter({ routeTree, context: { queryClient } });

// __root.tsx
type RouterContext = { queryClient: QueryClient };
export const Route = createRootRouteWithContext<RouterContext>()({ ... });
```

Now every route's `loader` receives `context.queryClient`.

**Think of it as** a backpack the router hands to every page.

---

### 7. `loader`: load data *before* the page shows

```tsx
// src/routes/posts/$postId.tsx
loader: ({ context, params }) =>
  context.queryClient.ensureQueryData(postQueryOptions(Number(params.postId))),
```

**Why:** `head()` needs the post title, and `head()` runs before the component.
So the data must already be there. The loader makes sure of it.

---

### 8. `errorComponent` and `notFoundComponent`

| Option | Shows when… | Where |
|---|---|---|
| `errorComponent` | the loader throws (e.g. post can't load) | `posts/$postId.tsx` |
| `notFoundComponent` | the URL matches no page | `__root.tsx` → our 404 page |

**Why:** every failure gets a planned screen instead of a blank page.

---

## Part 2: TanStack Query

### 9. `QueryClient` + `QueryClientProvider`

In `main.tsx`:

```tsx
const queryClient = new QueryClient(); // the cache (memory box)

<QueryClientProvider client={queryClient}>
  <RouterProvider router={router} />
</QueryClientProvider>
```

**Why:** the provider makes the cache available to every component.

---

### 10. `useQuery`

```tsx
const { data, isPending, isError } = useQuery({
  queryKey: ["posts", "list"], // the NAME of the box
  queryFn: getPosts,           // HOW to fetch
});
```

| You get | Meaning |
|---|---|
| `data` | the result (undefined until loaded) |
| `isPending` | still loading the first time |
| `isError` | the fetch failed |

**Why:** no hand-written `useEffect` + `useState` + loading flags.
Query also gives you, for free:
- caching (visit a page again → instant)
- retries (3 times by default on errors)
- refetching when you come back to the browser tab

**Rule:** API data lives in Query only. Never copy it into `useState` or Zustand.

---

### 11. Query key factory: `postKeys`

```ts
// src/hooks/usePosts.ts
export const postKeys = {
  all: ["posts"] as const,
  list: () => [...postKeys.all, "list"] as const,
  detail: (id: number) => [...postKeys.all, "detail", id] as const,
};
```

| Call | Key |
|---|---|
| `postKeys.all` | `["posts"]` |
| `postKeys.list()` | `["posts", "list"]` |
| `postKeys.detail(3)` | `["posts", "detail", 3]` |

Keys work like **folder paths**:

```
posts/
├── list
└── detail/
    ├── 1
    ├── 2
    └── 3
```

**Why:**
- One place for all keys means no typos.
- `invalidateQueries({ queryKey: postKeys.all })` refreshes **everything** under `posts/`.
  Use this after creating or editing a post.

**Rule:** after a mutation, invalidate or update the cache. Don't refetch manually.

---

### 12. Custom hooks: `usePosts` and `usePost`

```tsx
// in a component
const { data: posts } = usePosts();
```

Components never see `fetch`, URLs, or query keys.

**Why:** when we swap mock data for the real Go API, **only `src/api/posts.ts` changes**.
Hooks and components stay the same.

---

### 13. `queryOptions`: share one query in two places

```ts
export const postQueryOptions = (id: number) =>
  queryOptions({
    queryKey: postKeys.detail(id),
    queryFn: () => getPost(id),
  });

export function usePost(id: number) {
  return useQuery(postQueryOptions(id));
}
```

**Why:** the **loader** and the **component** both use `postQueryOptions`,
so they always read and write the **same cache entry**.

---

### 14. `ensureQueryData`

"If it's already in the cache, use it. If not, fetch it and store it."

**Why:** the loader fills the cache, then `usePost` in the component finds it
there immediately. No second fetch.

---

## Part 3: How it all connects (opening a post)

```
 You click a post card
        │
        ▼
 <Link to="/posts/$postId" params={{ postId: "3" }}>
        │
        ▼
 Router runs the LOADER
   └─ ensureQueryData(postQueryOptions(3))
        └─ not in cache → getPost(3) → stored in cache
        │
        ▼
 Router runs HEAD()
   └─ title = "<post title> — Social Blog"
   └─ <HeadContent /> writes it into <head>
        │
        ▼
 Router renders the COMPONENT
   └─ usePost(3) → already in cache → shows instantly
```

---

## Part 4: Where each piece lives

| File | What it does |
|---|---|
| `src/main.tsx` | Creates the `QueryClient` and the router (with context) |
| `src/routes/__root.tsx` | Layout, default `head()`, `<HeadContent />`, 404 page |
| `src/routes/index.tsx` | Feed page, uses `usePosts()` |
| `src/routes/posts/$postId.tsx` | Post page: `loader`, `head()`, `errorComponent` |
| `src/hooks/usePosts.ts` | `postKeys`, `postQueryOptions`, `usePosts`, `usePost` |
| `src/api/posts.ts` | `getPosts`, `getPost` (mock data for now) |
| `src/types/` | `Post`, `Comment` types mirroring the Go API |

---

## Quick cheat sheet

| I want to… | Use |
|---|---|
| Add a page | New file in `src/routes/` |
| Read a URL param | `Route.useParams()` |
| Link to a page | `<Link to="..." params={{ ... }}>` |
| Set the tab title | `head: () => ({ meta: [{ title: "..." }] })` |
| Load data before a page shows | `loader` + `ensureQueryData` |
| Fetch data in a component | a hook from `src/hooks/` (`useQuery` inside) |
| Refresh data after a change | `queryClient.invalidateQueries({ queryKey: postKeys.all })` |
| See what's in the cache | the React Query Devtools button (bottom corner in dev) |
