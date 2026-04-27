import Link from "next/link";
import Card from "./components/Card";
import Button from "./components/Button";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent mb-6">
              Welcome to DormTalk
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Your campus community platform for sharing ideas, discussions, and
              connecting with fellow students.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
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

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <Card hover className="text-left !bg-gray-800 !border-gray-700">
              <div className="text-4xl mb-4">📝</div>
              <h2 className="text-2xl font-bold mb-3 text-white">
                Share Your Thoughts
              </h2>
              <p className="text-gray-300 mb-6">
                Create posts, share ideas, and engage in meaningful discussions
                with your campus community.
              </p>
              <Link href="/posts">
                <Button>View All Posts</Button>
              </Link>
            </Card>

            <Card hover className="text-left !bg-gray-800 !border-gray-700">
              <div className="text-4xl mb-4">💬</div>
              <h2 className="text-2xl font-bold mb-3 text-white">
                Join Conversations
              </h2>
              <p className="text-gray-300 mb-6">
                Comment on posts, reply to discussions, and build connections
                with other students.
              </p>
              <Link href="/my-posts">
                <Button variant="success">My Posts</Button>
              </Link>
            </Card>
          </div>

          {/* Getting Started Guide */}
          <Card className="!bg-gradient-to-br !from-blue-50 !to-green-50 dark:!from-gray-800 dark:!to-gray-800 !border-blue-200 dark:!border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Getting Started
            </h2>
            <div className="text-left space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-700 rounded-lg">
                <span className="text-2xl flex-shrink-0">1️⃣</span>
                <div>
                  <strong className="text-gray-900 dark:text-white block mb-1">
                    Sign Up or Sign In
                  </strong>
                  <p className="text-gray-600 dark:text-gray-300">
                    Visit the{" "}
                    <Link
                      href="/auth"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Auth page
                    </Link>{" "}
                    to create an account or log in.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-700 rounded-lg">
                <span className="text-2xl flex-shrink-0">2️⃣</span>
                <div>
                  <strong className="text-gray-900 dark:text-white block mb-1">
                    Explore Posts
                  </strong>
                  <p className="text-gray-600 dark:text-gray-300">
                    Browse all posts from the community and join discussions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-700 rounded-lg">
                <span className="text-2xl flex-shrink-0">3️⃣</span>
                <div>
                  <strong className="text-gray-900 dark:text-white block mb-1">
                    Create Content
                  </strong>
                  <p className="text-gray-600 dark:text-gray-300">
                    Share your own posts and comments with the community.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-700 rounded-lg">
                <span className="text-2xl flex-shrink-0">4️⃣</span>
                <div>
                  <strong className="text-gray-900 dark:text-white block mb-1">
                    Manage Your Content
                  </strong>
                  <p className="text-gray-600 dark:text-gray-300">
                    Edit or delete your posts and comments from your profile
                    pages.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Features */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Anonymous Options
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                High school students can post and message anonymously
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Campus Community
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Connect with students from your school and beyond
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Real-time Updates
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Stay updated with instant notifications and live discussions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
