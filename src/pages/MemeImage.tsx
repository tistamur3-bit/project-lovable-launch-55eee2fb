import React from 'react';
import memeImage from '../assets/meme-image.jpeg';

const MemeImage = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <img 
        src={memeImage} 
        alt="Meme" 
        className="max-w-full max-h-screen object-contain"
      />
    </div>
  );
};

export default MemeImage;
