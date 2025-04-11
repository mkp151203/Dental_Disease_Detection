import React from 'react';
import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <h2>About Our AI Model</h2>
      
      <div className={styles.section}>
        <h3>Technology Stack</h3>
        <p>Our system uses a state-of-the-art YOLO (You Only Look Once) model 
        for real-time object detection and disease classification in dental X-rays.</p>
      </div>
      
      <div className={styles.section}>
        <h3>Dataset Information</h3>
        <ul>
          <li>Trained on 10,000+ dental OPG X-ray images</li>
          <li>Validated by dental professionals</li>
          <li>Covers multiple oral diseases and conditions</li>
        </ul>
      </div>
      
      <div className={styles.section}>
        <h3>Model Performance</h3>
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={styles.value}>95%</span>
            <span className={styles.label}>Accuracy</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.value}>93%</span>
            <span className={styles.label}>Precision</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.value}>94%</span>
            <span className={styles.label}>Recall</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;