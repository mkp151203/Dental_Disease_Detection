import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1>Oral Disease Detection AI</h1>
      <p>Upload Dental OPG X-ray images for AI-powered disease detection</p>
    </header>
  );
};

export default Header;