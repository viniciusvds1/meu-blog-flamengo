// components/WebStory.js
"use client"
import React from 'react';

const WebStory = ({ embedURL }) => {
  return (
    <div className="web-story-container w-full max-w-md mx-auto">
      <amp-story-player 
        className="w-full h-full"
        layout="responsive"
        width="360"
        height="0">
        <a href={embedURL}></a>
      </amp-story-player>
    </div>
  );
};

export default WebStory