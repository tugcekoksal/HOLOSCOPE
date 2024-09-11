import React, { useState } from 'react';
import MovingDots from '../components/MovingDots';
import Popup from '@/components/Popup';
import ThankYouMessage from '../components/ThankYouMessage';
import KnowledgeGraph from '../components/MovingDots';


export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleBallClick = () => {
    setShowPopup(true);
  };

  const handleStartTransformation = () => {
    setShowPopup(false);
    setShowThankYou(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <KnowledgeGraph />
      <div id="container" className="text-center relative z-10">
        {/* <h1 id="company-name" className="text-7xl font-bold mb-20 text-w">Holoscope</h1> */}
        {/* <div 
          id="ball" 
          className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-8 animate-pulse cursor-pointer"
          onClick={handleBallClick}
        /> */}
        {showPopup && <Popup onStartTransformation={handleStartTransformation} />}
        {showThankYou && <ThankYouMessage />}
      </div>
    </div>
  );
}