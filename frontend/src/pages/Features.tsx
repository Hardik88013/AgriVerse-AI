// Purpose: Lists the features of the platform.
// How it works: Maps over an array of feature objects to render cards dynamically.
// Why it exists: To showcase what the application can do (Crop Rec & Disease Detection).

const featuresList = [
  {
    title: "Crop Recommendation",
    description: "Get personalized crop recommendations based on soil nutrients (N, P, K), temperature, humidity, pH, and rainfall.",
    icon: "🌱",
    status: "Coming in Phase 03"
  },
  {
    title: "Plant Disease Detection",
    description: "Upload an image of a plant leaf and let our Convolutional Neural Network identify the disease and suggest treatments.",
    icon: "🔍",
    status: "Coming in Phase 08"
  },
  {
    title: "Real-time Dashboard",
    description: "View analytics and history of all your recommendations and scans in a beautifully designed dashboard.",
    icon: "📊",
    status: "Coming Soon"
  }
];

const Features = () => {
  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-center text-dark mb-12">Platform Features</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featuresList.map((feature, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow border-t-4 border-primary">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h2 className="text-2xl font-bold text-dark mb-3">{feature.title}</h2>
            <p className="text-gray-600 mb-6">{feature.description}</p>
            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-semibold">
              {feature.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
