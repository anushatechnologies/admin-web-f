import React from 'react';
import { Box, Typography } from '@mui/material';
import styles from '@components/layout/AppBar/AppBar.module.scss';
import { Breadcrumb } from '@components/Breadcrumb';
import AppLoader from '@components/AppLoader';
import LoanSummaryAppBarRight from '@components/layout/AppBar/components/LoanSummaryAppBarRight';
import { useSelector } from 'react-redux';

const TopNav: React.FC = () => {
  const pageName = useSelector((state: any) => state.app.pageName);

  return (
    <>
      <Box className={styles.topNav}>
        <Box className={styles.leftSection}>
          <Box className="mt-4">
            <Typography variant="h3" className={styles.pageTitle}>
              <Breadcrumb />
            </Typography>
          </Box>
        </Box>

        {/* Right Section */}
        <Box className={styles.rightSection}>
          {pageName == 'allLoans' && <LoanSummaryAppBarRight />}
          {pageName == 'userModule' && <LoanSummaryAppBarRight />}
        </Box>
      </Box>

      <AppLoader />
    </>
  );
};

export default TopNav;
