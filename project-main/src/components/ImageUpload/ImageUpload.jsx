import React, { useState } from 'react';
import axios from 'axios';
import styles from './ImageUpload.module.css';

const ImageUpload = ({ onImageUpload, onResults }) => {
  const [preview, setPreview] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
        setUploadedFile(file);
        onImageUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    if (e.target.files.length) {
      handleFile(e.target.files[0]);
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      if (!uploadedFile) throw new Error("No file selected!");

      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await axios.post('http://localhost:5000/predict', formData);

      const { predictions, annotatedImageUrl } = response.data;
      const fullAnnotatedUrl = annotatedImageUrl.startsWith('http')
        ? annotatedImageUrl
        : `http://localhost:5000${annotatedImageUrl}`;

      console.log("✅ Prediction Response:", response.data);

      onResults({
        predictions,
        annotatedImage: fullAnnotatedUrl, // Ensure correct key is passed
      });

    } catch (error) {
      console.error("❌ Prediction Error:", error);
      alert("Prediction failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${styles.uploadContainer} ${dragActive ? styles.dragActive : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className={styles.uploadArea}>
        {preview ? (
          <div className={styles.previewContainer}>
            <img src={preview} alt="Preview" className={styles.preview} />
            <button className={styles.resetButton} onClick={() => {
              setPreview(null);
              setUploadedFile(null);
            }}>
              Choose Different Image
            </button>
          </div>
        ) : (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className={styles.fileInput}
              id="file-upload"
            />
            <label htmlFor="file-upload" className={styles.uploadLabel}>
              <div className={styles.uploadIcon}>📁</div>
              <p>Drag and drop your X-ray image here or click to browse</p>
              <span className={styles.supportedFormats}>
                Supported formats: PNG, JPG, JPEG
              </span>
            </label>
          </>
        )}
      </div>
      {preview && (
        <button
          className={styles.predictButton}
          onClick={handlePredict}
          disabled={loading}
        >
          {loading ? "Predicting..." : "Predict Disease"}
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
