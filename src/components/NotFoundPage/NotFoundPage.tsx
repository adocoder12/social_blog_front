import { Link } from "@tanstack/react-router";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center py-16">
      <div className="max-w-md text-center">
        {/* Decorative, so screen readers skip it */}
        <p
          aria-hidden="true"
          className="font-mono text-[7.5rem] font-bold leading-none tracking-tighter text-foreground opacity-10"
        >
          404
        </p>

        <div className="-mt-10">
          <h1 className="text-h2">Page not found</h1>
          <p className="mt-2 text-muted">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link
          to="/"
          className="mt-8 inline-block rounded-md border border-decorator px-5 py-2.5 font-mono text-small font-bold uppercase tracking-widest text-decorator transition-colors hover:bg-decorator hover:text-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-decorator"
        >
          Back to the feed
        </Link>
      </div>
    </div>
  );
}
