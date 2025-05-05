import React from 'react';
import logo from '../logo.svg';
import styles from '../RegisterScreen.module.css';
import FindServiceScreen from '../Components/FindServiceScreen';

function RegisterScreen() {
  return (
    <div className={styles.RegisterScreen}>
      <div className={styles.Appheader}>
        <div className={styles.Clientwindow}>
          <h2>Welcome to Pandora Home Drive!</h2>
          <div className={styles.Portform}style={{width: 'fit-content'}}><FindServiceScreen/></div>
        </div>
        <div className={styles.framework}>
          <img src={logo} className={styles.Applogo} alt="logo" />
          <p>
            {"Written with the "} 
            <a
              className={styles.Applink}
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              React
            </a>
            {" framework"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;
