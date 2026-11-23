# TanStack in this project: easy learning notes

## The big picture (read this first)

We use two libraries. Each one has a different job.

| Library             | Job                                                | Real-life example                                   |
| ------------------- | -------------------------------------------------- | --------------------------------------------------- |
| **TanStack Router** | Decides **which page** to show                     | A **receptionist**: "You want room 3? Go this way." |
| **TanStack Query**  | **Gets** data from the server and **remembers** it | A **fridge**: buy food once, take it out many times |

Data always moves in one direction:

```
route  →  hook  →  api  →  Go API
(page)    (asks)   (fetch)  (server)
```

Each layer only talks to the layer **right below it**.

Example: the post page never calls `fetch()` itself. It asks the hook,
the hook asks the api file, and the api file calls the Go server.

---

# Part 1: TanStack Router (the receptionist)

## 1. File-based routes: a file = a page

You create a file in `src/routes/`, and you get a page. That's all.

| File                           | URL in the browser                                   |
| ------------------------------ | ---------------------------------------------------- |
| `src/routes/index.tsx`         | `/` (home)                                           |
| `src/routes/profile.tsx`       | `/profile`                                           |
| `src/routes/posts/$postId.tsx` | `/posts/1`, `/posts/2`, `/posts/99`…                 |
| `src/routes/__root.tsx`        | Not a page. It **wraps every page** (header, footer) |

**Example: add an "About" page**

1. Create `src/routes/about.tsx`
2. Done. `/about` now works.

The router plugin writes the list of all pages in `src/routeTree.gen.ts`.
⚠️ **Never edit that file.** It is rebuilt automatically.

---

## 2. `createFileRoute`: the page's ID card

Every route file exports a `Route`. Think of it as the **ID card** of the page:
everything about that page is written on it.

```tsx
// src/routes/about.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage, // what to show on screen
});

function AboutPage() {
  return <h1>About us</h1>;
}
```

Later you can add more things to the same card: `loader`, `head`, `errorComponent`…

---

## 3. Dynamic routes: `$postId`

The `$` means **"this part of the URL changes"**.
One file handles **every** post.

```tsx
// src/routes/posts/$postId.tsx
function PostPage() {
  const { postId } = Route.useParams();
  return <p>You are reading post {postId}</p>;
}
```

| You open    | `postId` is |
| ----------- | ----------- |
| `/posts/1`  | `"1"`       |
| `/posts/42` | `"42"`      |

⚠️ **Params are always strings.** `"42"` is not `42`.
Our API wants a number, so convert it:

```tsx
const id = Number(postId); // "42" → 42
```

---

## 4. `<Link>`: links that can't break

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/posts/$postId" params={{ postId: String(post.id) }}>
  Read more
</Link>;
```

The router knows all pages, so **TypeScript catches mistakes for you**:

```tsx
<Link to="/post/$postId" ...>   // ❌ red error: "/post" doesn't exist
<Link to="/posts/$postId">       // ❌ red error: you forgot params
<Link to="/profile">             // ✅ fine
```

You see the error in your editor **before** a user sees a 404.

**Rule:** for pages inside our app, always use `<Link>`, never `<a>`.
(`<a>` is fine for external sites like `https://github.com`.)

---

## 5. `head()`: the browser tab title

`head()` sets the text in the browser tab and the description for Google.

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

`<HeadContent />` in `__root.tsx` takes these values and puts them into the HTML `<head>`.

**How defaults work:**

| Page       | Tab shows                       | Why                                        |
| ---------- | ------------------------------- | ------------------------------------------ |
| `/`        | `Social Blog`                   | Root default                               |
| `/profile` | `Profile — Social Blog`         | Profile overrides the default              |
| `/posts/3` | `My first Go API — Social Blog` | Post page overrides it with the post title |

The deepest page **wins**.

⚠️ Our app runs in the browser (client-side). WhatsApp, Slack, X and Facebook
**don't run JavaScript** when they build a link preview, so they won't see these tags.
Google does run JavaScript, so Google sees them.

---

## 6. Router context: a backpack for every page

We want every page to use the **same** `queryClient` (the fridge).
So we put it in a "backpack" that the router gives to every route.

```tsx
// main.tsx: fill the backpack
const queryClient = new QueryClient();
const router = createRouter({ routeTree, context: { queryClient } });
```

```tsx
// __root.tsx: tell TypeScript what's in the backpack
type RouterContext = { queryClient: QueryClient };

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
```

Now any `loader` can open the backpack:

```tsx
loader: ({ context }) => {
  context.queryClient; // ✅ available here
};
```

---

## 7. `loader`: get the data **before** the page opens

Real-life example: a waiter brings your food **before** you sit down,
so you don't wait at the table.

```tsx
// src/routes/posts/$postId.tsx
export const Route = createFileRoute("/posts/$postId")({
  loader: ({ context, params }) =>
    context.queryClient.query({
      ...postQueryOptions(Number(params.postId)),
      staleTime: "static",
    }),
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title} — Social Blog` }],
  }),
  component: PostPage,
});
```

**Why do we need it here?**
`head()` needs the **post title**, and `head()` runs **before** the component.
So the post must be loaded before that. The loader does it.

Order:

```
loader  →  head()  →  component
(fetch)    (title)    (screen)
```

---

## 8. Error screens

Instead of a blank white page, every problem gets its own screen.

| Option              | Shows when…             | Example                                  | Where                  |
| ------------------- | ----------------------- | ---------------------------------------- | ---------------------- |
| `errorComponent`    | the loader fails        | Go server is down, `/posts/3` can't load | `posts/$postId.tsx`    |
| `notFoundComponent` | no page matches the URL | user types `/banana`                     | `__root.tsx` (our 404) |

```tsx
export const Route = createFileRoute("/posts/$postId")({
  loader: /* ... */,
  errorComponent: () => <p>Sorry, this post could not load.</p>,
  component: PostPage,
});
```

---

# Part 2: TanStack Query (the fridge)

## 9. `QueryClient` + `QueryClientProvider`

- `QueryClient` = **the fridge** (the cache). It stores data.
- `QueryClientProvider` = puts the fridge **in the kitchen**, so every component can use it.

```tsx
// main.tsx
const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
  <RouterProvider router={router} />
</QueryClientProvider>;
```

We create **one** fridge for the whole app.

---

## 10. `useQuery`: "give me this data"

```tsx
const { data, isPending, isError } = useQuery({
  queryKey: ["posts", "list"], // the LABEL on the box in the fridge
  queryFn: getPosts, // HOW to buy it if the box is empty
});
```

| You get     | Meaning                                   |
| ----------- | ----------------------------------------- |
| `data`      | the result (`undefined` until it arrives) |
| `isPending` | first load, still waiting                 |
| `isError`   | the fetch failed                          |

**Full example in a component:**

```tsx
function Feed() {
  const { data, isPending, isError } = usePosts();

  if (isPending) return <p>Loading…</p>;
  if (isError) return <p>Something went wrong.</p>;

  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

**Before vs after.** Without Query you write all this yourself:

```tsx
// ❌ the old way
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);

useEffect(() => {
  getPosts()
    .then(setPosts)
    .catch(() => setError(true))
    .finally(() => setLoading(false));
}, []);
```

With Query you write **one hook**, and you also get these for free:

- **Cache**: go back to a page and it shows instantly
- **Retry**: if a fetch fails, it tries again (3 times by default)
- **Refresh**: when you come back to the browser tab, it checks for new data

**Rule:** server data lives **only in Query**.
Never copy it into `useState` or Zustand, or you'll end up with two copies that don't match.

---

## 11. `postKeys`: labels for the boxes

Every box in the fridge needs a label. That label is the `queryKey`.
`postKeys` is the **one place** where we write all the labels.

```ts
// src/hooks/usePosts.ts
export const postKeys = {
  all: ["posts"] as const,
  list: () => [...postKeys.all, "list"] as const,
  detail: (id: number) => [...postKeys.all, "detail", id] as const,
};
```

| Call                 | Label                    |
| -------------------- | ------------------------ |
| `postKeys.all`       | `["posts"]`              |
| `postKeys.list()`    | `["posts", "list"]`      |
| `postKeys.detail(3)` | `["posts", "detail", 3]` |

Labels work like **folders**:

```
posts/
├── list          ← all posts (feed)
└── detail/
    ├── 1         ← post 1
    ├── 2         ← post 2
    └── 3         ← post 3
```

**Why this is useful:**

1. **No typos.** You write `postKeys.list()` instead of typing `["posts", "lsit"]` by hand.
2. **Refresh a whole folder at once.** Say the user edits post 2:

```ts
queryClient.invalidateQueries({ queryKey: postKeys.all });
// marks the list, post 1, post 2 and post 3 as old → they refetch
```

```ts
queryClient.invalidateQueries({ queryKey: postKeys.detail(2) });
// only post 2 refetches
```

`as const` tells TypeScript: "this array is fixed, don't change it to `string[]`."

**Rule:** after you change data (create, edit, delete), **invalidate** the cache.
Don't call `refetch()` by hand.

---

## 12. Custom hooks: `usePosts` and `usePost`

Components just call a hook. They don't know about URLs, `fetch` or keys.

```tsx
const { data: posts } = usePosts(); // all posts
const { data: post } = usePost(3); // post 3
```

**Why:** today `src/api/posts.ts` returns **mock data**.
Tomorrow it will call the **real Go API**.
On that day **only `src/api/posts.ts` changes**. Hooks and components stay the same.

```
Component  →  usePost(3)  →  getPost(3)  →  mock data   (today)
Component  →  usePost(3)  →  getPost(3)  →  Go API      (tomorrow)
              (no change)    (changes)
```

---

## 13. `queryOptions`: one recipe, used in many places

`postQueryOptions` is a **recipe**: "label + how to get it".

```ts
export const postQueryOptions = (id: number) =>
  queryOptions({
    queryKey: postKeys.detail(id), // label
    queryFn: () => getPost(id), // how to get it
  });
```

We use the **same recipe** in two places:

```ts
// 1. In the loader (before the page opens)
context.queryClient.query({ ...postQueryOptions(3), staleTime: "static" });

// 2. In the component (on screen)
export function usePost(id: number) {
  return useQuery(postQueryOptions(id));
}
```

**Why:** both places use the **same label**, so they read the **same box**.
If you typed the key by hand in both places and made a small mistake
(`["post", 3]` vs `["posts", "detail", 3]`), you would fetch the post **twice**.

---

## 14. `queryClient.query` + `staleTime: "static"`

In simple words:
**"Is it in the fridge? Use it. Not there? Go buy it and put it in the fridge."**

```ts
context.queryClient.query({ ...postQueryOptions(id), staleTime: "static" });
```

- `query()` → fetches **only if** the cache has no fresh data.
- `staleTime: "static"` → "this data never gets old", so any post already in the cache is used as it is.

**Example:**

| Situation                      | What happens                             |
| ------------------------------ | ---------------------------------------- |
| First time opening `/posts/3`  | Not in cache → `getPost(3)` → saved      |
| Go back, open `/posts/3` again | Already in cache → **no fetch**, instant |

Then `usePost(3)` in the component finds the post already there. **No second fetch.**

> Old tutorials use `queryClient.ensureQueryData(options)`. It does the same thing,
> but it's deprecated in our version (5.105) and will be removed in the next major version.

---

# Part 3: Everything together (opening a post)

Story: you are on the feed and you click the card for post 3.

```
 1. You click a post card
        │
        ▼
 2. <Link to="/posts/$postId" params={{ postId: "3" }}>
    URL becomes /posts/3
        │
        ▼
 3. LOADER runs
    queryClient.query({ ...postQueryOptions(3), staleTime: "static" })
      ├─ in cache?  → use it
      └─ not there? → getPost(3) → save in cache
        │
        ▼
 4. HEAD() runs
    tab title = "My first Go API — Social Blog"
        │
        ▼
 5. COMPONENT renders
    usePost(3) → already in cache → shows instantly ⚡
```

If step 3 fails (server down) → `errorComponent` shows instead.

---

# Part 4: Where each piece lives

| File                           | What it does                                                          |
| ------------------------------ | --------------------------------------------------------------------- |
| `src/main.tsx`                 | Creates the fridge (`QueryClient`) and the router (with the backpack) |
| `src/routes/__root.tsx`        | Layout, default title, `<HeadContent />`, 404 page                    |
| `src/routes/index.tsx`         | Feed page, uses `usePosts()`                                          |
| `src/routes/posts/$postId.tsx` | Post page: `loader`, `head()`, `errorComponent`                       |
| `src/hooks/usePosts.ts`        | `postKeys`, `postQueryOptions`, `usePosts`, `usePost`                 |
| `src/api/posts.ts`             | `getPosts`, `getPost` (mock data for now)                             |
| `src/types/`                   | `Post`, `Comment` types (same shape as the Go API)                    |

---

# Quick cheat sheet

| I want to…                      | Do this                                                             |
| ------------------------------- | ------------------------------------------------------------------- |
| Add a page                      | Create a file in `src/routes/`                                      |
| Read a URL param                | `const { postId } = Route.useParams()`                              |
| Use the param as a number       | `Number(postId)`                                                    |
| Link to a page                  | `<Link to="/posts/$postId" params={{ postId: "3" }}>`               |
| Set the tab title               | `head: () => ({ meta: [{ title: "..." }] })`                        |
| Load data before the page shows | `loader` + `queryClient.query({ ...options, staleTime: "static" })` |
| Get data in a component         | Use a hook from `src/hooks/` (e.g. `usePost(3)`)                    |
| Refresh after a change          | `queryClient.invalidateQueries({ queryKey: postKeys.all })`         |
| See what's in the cache         | React Query Devtools button (bottom corner, dev only)               |

## Words to remember

| Word           | Simple meaning                            |
| -------------- | ----------------------------------------- |
| **cache**      | the fridge: saved data                    |
| **queryKey**   | the label on a box in the fridge          |
| **queryFn**    | how to get the data if the box is empty   |
| **stale**      | "old": Query may refetch it               |
| **invalidate** | "throw this box away, get a new one"      |
| **loader**     | gets data before the page opens           |
| **params**     | the changing parts of the URL (`$postId`) |
