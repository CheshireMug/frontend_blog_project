import React from 'react';
import styles from './Footer.module.scss';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export const Footer = () => {
  return (
    <footer className={styles.root}>
      <Container maxWidth="lg" className={styles.inner}>
        <Typography variant="body2" className={styles.text}>
          © {new Date().getFullYear()} Blog. Все права защищены.
        </Typography>
      </Container>
    </footer>
  );
};
