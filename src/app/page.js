import Link from "next/link";
import Card from "./components/Card";
import Button from "./components/Button";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-14">
          <p className="inline-flex items-center px-3 py-1.5 rounded-full bg-[color-mix(in_oklch,var(--brand-blue)_14%,transparent)] text-[var(--brand-blue-strong)] text-xs font-semibold tracking-wide uppercase">
            Campus conversations, elevated
          </p>
          <h1 className="mt-6 mb-5">Welcome to DormTalk</h1>
          <p className="max-w-2xl mx-auto text-lg text-[var(--text-secondary)]">
            A refined social space for student voices: post, comment, and connect
            in a polished feed experience inspired by modern social apps.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mt-8">
            <Link href="/auth">
              <Button className="px-8 py-3 text-base">Get Started</Button>
            </Link>
            <Link href="/posts">
              <Button variant="secondary" className="px-8 py-3 text-base">
                Browse Posts
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 mb-14">
          <Card hover className="text-left ui-gradient-ring">
            <p className="text-sm font-semibold text-[var(--brand-green-strong)] mb-3">
              Social-first publishing
            </p>
            <h2 className="mb-3">Share thoughts that actually start dialogue</h2>
            <p className="text-[var(--text-secondary)] mb-6 max-w-[65ch]">
              Publish updates, ask questions, and follow the pulse of your school
              through a clean timeline that feels premium but approachable.
            </p>
            <Link href="/posts">
              <Button>View Feed</Button>
            </Link>
          </Card>

          <Card className="text-left">
            <p className="text-sm font-semibold text-[var(--brand-blue-strong)] mb-3">
              Private when it matters
            </p>
            <h3 className="mb-2">Anonymous mode for high school students</h3>
            <p className="text-[var(--text-secondary)]">
              Built-in privacy keeps conversations safer while still letting people
              ask honest questions and support each other.
            </p>
          </Card>
        </div>

        <Card className="mb-12">
          <h2 className="mb-6">Getting started is simple</h2>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs uppercase tracking-wide font-semibold text-[var(--brand-blue-strong)] mb-2">
                Step 1
              </p>
              <h3 className="mb-1">Sign up or sign in</h3>
              <p className="text-[var(--text-secondary)]">
                Start from the <Link href="/auth">auth page</Link> and choose your
                student type.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs uppercase tracking-wide font-semibold text-[var(--brand-blue-strong)] mb-2">
                Step 2
              </p>
              <h3 className="mb-1">Explore the feed</h3>
              <p className="text-[var(--text-secondary)]">
                Discover active threads, trending ideas, and student perspectives.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs uppercase tracking-wide font-semibold text-[var(--brand-green-strong)] mb-2">
                Step 3
              </p>
              <h3 className="mb-1">Create and comment</h3>
              <p className="text-[var(--text-secondary)]">
                Share your own posts and keep conversations moving with replies.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs uppercase tracking-wide font-semibold text-[var(--brand-green-strong)] mb-2">
                Step 4
              </p>
              <h3 className="mb-1">Manage your content</h3>
              <p className="text-[var(--text-secondary)]">
                Edit or remove posts and comments anytime from your profile.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="text-center">
            <h3 className="mb-2">Anonymous options</h3>
            <p className="text-[var(--text-secondary)] text-sm">
              High school students can post and message anonymously.
            </p>
          </Card>
          <Card className="text-center">
            <h3 className="mb-2">Campus network</h3>
            <p className="text-[var(--text-secondary)] text-sm">
              Connect with peers from your school and nearby campuses.
            </p>
          </Card>
          <Card className="text-center">
            <h3 className="mb-2">Live community pulse</h3>
            <p className="text-[var(--text-secondary)] text-sm">
              Follow fresh discussions and trending posts in one place.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
