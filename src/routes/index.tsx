import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Homepage,
});

function Homepage() {
  return <h1>Homepage</h1>;
}
