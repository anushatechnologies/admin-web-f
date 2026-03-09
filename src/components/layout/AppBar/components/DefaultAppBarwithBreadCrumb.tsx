import React from 'react';
import { Box, Typography } from '@mui/material';
import styles from '@components/layout/AppBar/AppBar.module.scss';
import { Breadcrumb } from '@components/Breadcrumb';

const DefaultAppBar: React.FC = () => {
  return (
    <Box className={styles.topNav}>
      <Box className={styles.leftSection}>
        <Box className="mt-4">
          <Typography variant="h3" className={styles.pageTitle}>
            <Breadcrumb />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DefaultAppBar;
