import React, { useState } from 'react';
import Header from './components/Header/Header';
import ImageUpload from './components/ImageUpload/ImageUpload';
import Results from './components/Results/Results';
import About from './components/About/About';
import styles from './App.module.css';

function App() {
  const [currentImage, setCurrentImage] = useState(null);
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleImageUpload = (file) => {
    setCurrentImage(URL.createObjectURL(file));
    setAnnotatedImage(null);
    setPredictions(null);
    setShowResults(false);
  };

  return (
    <div className={styles.app}>
      <Header />
      
      <main className={styles.main}>
        {!showResults ? (
          <ImageUpload 
            onImageUpload={handleImageUpload}
            onResults={(results) => {
              console.log("📡 Results received in App:", results);
              setPredictions(results.predictions);
              setAnnotatedImage(results.annotatedImage);
              setShowResults(true);
            }}
          />
        ) : (
          <Results 
            predictions={predictions}
            image={currentImage}
            annotatedImage={annotatedImage}
          />
        )}
        <About />
      </main>
    </div>
  );
}

export default App;
