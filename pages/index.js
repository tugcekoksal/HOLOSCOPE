import React, { useState } from "react"
import MovingDots from "../components/MovingDots"

import KnowledgeGraph from "../components/MovingDots"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 relative overflow-hidden m-0">
      <KnowledgeGraph />
      <div id="container" className="text-center relative z-10"></div>
    </div>
  )
}
