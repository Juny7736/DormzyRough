import React, { useState, useEffect } from 'react';

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  
  const fullText = "Dormzy: Because Finding Housing Shouldn't Be Homework";
  const typingSpeed = 50; // Speed for typing
  const deletingSpeed = 30; // Speed for deleting
  const pauseBeforeDelete = 1000; // Pause before starting to delete
  const pauseBeforeZoom = 500; // Pause before zoom animation
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (!isDeleting && text !== fullText) {
      // Typing
      timeout = setTimeout(() => {
        setText(fullText.slice(0, text.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && text === fullText) {
      // Pause before deleting
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseBeforeDelete);
    } else if (isDeleting && text !== '') {
      // Deleting
      timeout = setTimeout(() => {
        setText(text.slice(0, text.length - 1));
      }, deletingSpeed);
    } else if (isDeleting && text === '') {
      // Done deleting
      timeout = setTimeout(() => {
        setIsDone(true);
        setTimeout(onComplete, 1000); // Wait for zoom animation to complete
      }, pauseBeforeZoom);
    }
    
    return () => clearTimeout(timeout);
  }, [text, isDeleting, fullText, onComplete]);
  
  return (
    <div className={`loading-screen ${isDone ? 'loading-screen-done' : ''}`}>
      <div className={`loading-text ${isDone ? 'loading-text-zoom' : ''}`}>
        {text || '\u00A0'}
      </div>
    </div>
  );
};

export default LoadingScreen;