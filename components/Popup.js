import React from 'react';

const Popup = ({ onStartTransformation }) => {
  return (
    <div id="popup" className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <div id="popup-content">
        <h2 className="text-2xl font-semibold mb-4">Elevate Your Business</h2>
        <p className="mb-4">
          Imagine a world where running your company feels as natural as
          breathing. With AI as your silent partner, that world is now within
          reach.
        </p>
        <p className="mb-4">Holoscope brings you:</p>
        <ul className="list-disc list-inside mb-4">
          <li>Effortless operations that free you to focus on growth</li>
          <li>Insights that turn data into your competitive edge</li>
          <li>Solutions that adapt to your unique challenges</li>
          <li>Personalized experiences that delight your customers</li>
        </ul>
        <p className="mb-4">
          We're not just dreaming of easier business management—we're making
          it a reality. Ready to transform how you run your company?
        </p>
        <button
          onClick={onStartTransformation}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Start Your Transformation
        </button>
      </div>
    </div>
  );
};

export default Popup;