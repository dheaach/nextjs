// app/page.tsx
import Layout from './layout';

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to My Admin Dashboard</h1>
          <p className="text-lg mb-8">Manage your content and analytics effortlessly.</p>
          <a
            href="/login"
            className="bg-white text-blue-600 font-semibold py-2 px-4 rounded hover:bg-gray-200 transition"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold">Features</h2>
          <p className="text-gray-600">Discover what you can do with our platform.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Feature One</h3>
            <p className="text-gray-600">Description of feature one that explains its benefits and uses.</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Feature Two</h3>
            <p className="text-gray-600">Description of feature two that explains its benefits and uses.</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Feature Three</h3>
            <p className="text-gray-600">Description of feature three that explains its benefits and uses.</p>
          </div>
        </div>
      </section>
      
    </Layout>
  );
};


export default Home;
