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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 relative overflow-hidden m-0">
      <KnowledgeGraph />
      <div id="container" className="text-center relative z-10">
       
        {showPopup && <Popup onStartTransformation={handleStartTransformation} />}
        {showThankYou && <ThankYouMessage />}
      </div>
    </div>
  );
}