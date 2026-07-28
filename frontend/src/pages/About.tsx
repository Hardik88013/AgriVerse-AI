// Purpose: Displays information about the project.
// How it works: Static React component.
// Why it exists: To provide context on what this platform is and why it was built.

const About = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-primary mb-8 text-center">About AgriSense AI</h1>
      
      <div className="bg-white shadow-xl rounded-lg p-8 space-y-6 text-gray-700">
        <p className="text-lg">
          AgriSense AI is a full-stack educational and production-ready platform designed to demonstrate the power of Machine Learning in agriculture.
        </p>
        
        <h2 className="text-2xl font-bold text-dark mt-6">Our Tech Stack</h2>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li><strong>Frontend:</strong> React, TypeScript, Tailwind CSS, Vite</li>
          <li><strong>Backend:</strong> Python, FastAPI, Motor</li>
          <li><strong>Database:</strong> MongoDB Atlas</li>
          <li><strong>Machine Learning:</strong> Scikit-learn, PyTorch, OpenCV (Coming soon!)</li>
        </ul>

        <h2 className="text-2xl font-bold text-dark mt-6">The Vision</h2>
        <p>
          By leveraging AI, we aim to provide actionable insights for crop management, helping maximize yield and detect plant diseases early.
        </p>
      </div>
    </div>
  );
};

export default About;
