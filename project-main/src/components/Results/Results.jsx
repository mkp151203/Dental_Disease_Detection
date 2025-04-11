import React, { useEffect } from 'react';
import styles from './Results.module.css';

const Results = ({ predictions, image, annotatedImage, onReupload }) => {
  useEffect(() => {
    console.log('📦 Results component mounted');
    if (annotatedImage) {
      console.log('🖼️ Annotated Image URL:', annotatedImage);
    } else {
      console.log('⚠️ Annotated image not available yet.');
    }
  }, [annotatedImage]);

  const handleDownload = () => {
    if (!annotatedImage) return;

    const extension = annotatedImage.split('.').pop().split(/\#|\?/)[0];
    const filename = `annotated_result.${extension || 'png'}`;

    fetch(annotatedImage)
      .then(response => response.blob())
      .then(blob => {
        const blobURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobURL;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobURL);
      })
      .catch(err => {
        console.error('Error downloading image:', err);
      });
  };

  const handleReupload = () => {
    const confirmRefresh = window.confirm('Are you sure you want to re-upload? This will delete all files in the outputs folder and refresh the page.');
    if (confirmRefresh) {
      // Make a request to the server to clear the outputs folder
      fetch('http://localhost:5000/clear_outputs', {
        method: 'POST',
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            console.log(data.message); // Log success message
            window.location.reload(); // Refresh the page
          } else {
            console.error("Error clearing output files:", data.error);
          }
        })
        .catch(err => {
          console.error('Error clearing output files:', err);
        });
    }
  };
  

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.buttonsRow}>
        <button className={styles.button} onClick={handleReupload}>
          🔁 Re-upload
        </button>
        <button className={styles.button} onClick={handleDownload} disabled={!annotatedImage}>
          ⬇️ Download Result
        </button>
      </div>

      <div className={styles.imageRow}>
        <div className={styles.imageContainer}>
          <h3>Annotated X-ray</h3>
          <img src={annotatedImage} alt="Annotated X-ray" className={styles.xrayImage} />
        </div>
        <div className={styles.imageContainer}>
          <h3>Original X-ray</h3>
          <img src={image} alt="Original X-ray" className={styles.xrayImage} />
        </div>
      </div>

      <div className={styles.predictionsContainer}>
        <h2>Detection Results</h2>
        <div className={styles.predictions}>
          {predictions && predictions.length > 0 ? (
            predictions.map((prediction, idx) => (
              <div key={idx} className={styles.prediction}>
                <span className={styles.disease}>Detected Disease:</span>
                <span className={styles.value} style={{ color: prediction.color }}>
                  {prediction.disease}
                </span>
                <div className={styles.confidence}>
                  Confidence: {prediction.confidence}%
                </div>
                {/* Display the cropped image with bounding box annotations */}
                {prediction.boxImageUrl && (
                  <div className={styles.boxImageContainer}>
                    <h4>Detection #{idx + 1} with Bounding Box</h4>
                    <img
                      src={`http://localhost:5000${prediction.boxImageUrl}`}
                      alt={`Detection ${idx + 1} Box`}
                      className={styles.boxImage}
                    />
                    {/* <p>{prediction.boxImageUrl}</p> */}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className={styles.noPredictions}>No predictions available</p>
          )}
        </div>

        <div className={styles.disclaimer}>
          ⚠️ Disclaimer: This tool is for educational and research purposes only.
          Not intended for medical diagnosis. Please consult healthcare professionals
          for medical advice.
        </div>
      </div>
    </div>
  );
};

export default Results;
