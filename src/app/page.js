import Link from "next/link";
import Card from "./components/Card";
import Button from "./components/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-cyan-400 mb-6">
            Welcome to DormTalk
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Your campus community platform for sharing ideas, discussions, and
            connecting with fellow students.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="text-left hover:shadow-xl hover:shadow-cyan-900/30 transition-shadow">
              <h2 className="text-2xl font-bold mb-3 text-cyan-400">
                📝 Share Your Thoughts
              </h2>
              <p className="text-gray-300 mb-4">
                Create posts, share ideas, and engage in meaningful discussions
                with your campus community.
              </p>
              <Link href="/posts">
                <Button>View All Posts</Button>
              </Link>
            </Card>

            <Card className="text-left hover:shadow-xl hover:shadow-cyan-900/30 transition-shadow">
              <h2 className="text-2xl font-bold mb-3 text-green-400">
                💬 Join Conversations
              </h2>
              <p className="text-gray-300 mb-4">
                Comment on posts, reply to discussions, and build connections
                with other students.
              </p>
              <Link href="/my-posts">
                <Button variant="success">My Posts</Button>
              </Link>
            </Card>
          </div>

          <Card className="bg-gray-800/50 border-2 border-cyan-900/50">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Getting Started
            </h2>
            <div className="text-left space-y-3 text-gray-300">
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <strong className="text-white">Sign Up or Sign In:</strong>{" "}
                  Visit the{" "}
                  <Link href="/auth" className="text-cyan-400 hover:underline">
                    Auth page
                  </Link>{" "}
                  to create an account or log in.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <strong className="text-white">Explore Posts:</strong> Browse
                  all posts from the community and join discussions.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <strong className="text-white">Create Content:</strong> Share
                  your own posts and comments with the community.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">4️⃣</span>
                <div>
                  <strong className="text-white">Manage Your Content:</strong>{" "}
                  Edit or delete your posts and comments from your profile
                  pages.
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-12 flex gap-4 justify-center flex-wrap">
            <Link href="/auth">
              <Button className="px-8 py-3 text-lg">Get Started</Button>
            </Link>
            <Link href="/posts">
              <Button variant="secondary" className="px-8 py-3 text-lg">
                Browse Posts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
