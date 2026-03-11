import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, AccountCircle, Logout } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { logoutUser } from '@features/auth/authSlice';
import { Logo } from '@assets/index';
import styles from '@components/layout/SideNav/SideNav.module.scss';
import { RouteLinks } from '@routes/utils';

const SideNav: React.FC = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  // ✅ PERFECT LOGOUT - Clears localStorage + Redux + Redirects
  const handleLogout = () => {
    localStorage.clear();
    dispatch(logoutUser());
    handleMenuClose();
    navigate('/login', { replace: true });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  // Don't render if not logged in
  if (!isLoggedIn) return null;

  return (
    <Box
      className={`${styles.sideNav} ${isCollapsed ? styles.collapsed : styles.expanded}`}
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header with Logo */}
      <Box className={`${styles.header} ${isCollapsed ? styles.collapsed : styles.expanded}`}>
        {!isCollapsed && (
          <Box className={styles.logoContainer}>
            <Box className={styles.logoIcon}>
              <img src={Logo} alt="Company Logo" />
            </Box>
            <Box className={styles.logoText}>Anusha Bazaar</Box>
          </Box>
        )}
        {isCollapsed && (
          <Box className={styles.logoIconCollapsed}>
            <img src={Logo} alt="Company Logo" />
          </Box>
        )}
      </Box>

      {/* Toggle Button */}
      <IconButton onClick={() => setIsCollapsed(!isCollapsed)} className={styles.toggleButton}>
        {isCollapsed ? (
          <ChevronRight sx={{ fontSize: 20 }} />
        ) : (
          <ChevronLeft sx={{ fontSize: 20 }} />
        )}
      </IconButton>

      {/* Navigation Links */}
      <Box
        component="nav"
        className={styles.nav}
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {RouteLinks.map((group, groupIndex) => (
          <Box key={group.section}>
            {/* Section Title */}
            {!isCollapsed && (
              <Box
                sx={{
                  padding: '10px 16px',
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#22d3ee', // Highly visible Cyan
                  textTransform: 'uppercase',
                  marginTop: groupIndex !== 0 ? '10px' : '0px',
                  letterSpacing: '0.05em',
                }}
              >
                {group.section}
              </Box>
            )}

            {/* Links */}
            {group.links.map(({ path, name, Icon }) => {
              const isActive = location.pathname === path;
              const isHovered = hoveredItem === name;

              return (
                <Tooltip key={name} title={isCollapsed ? name : ''} placement="right" arrow>
                  <Link
                    to={path}
                    className={styles.navLink}
                    onMouseEnter={() => setHoveredItem(name)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Box
                      className={`${styles.navItem} 
                        ${isCollapsed ? styles.collapsed : styles.expanded}
                        ${isActive ? styles.active : ''}
                        ${isHovered ? styles.hovered : ''}`}
                    >
                      <Box className={styles.navIcon}>
                        <Icon />
                      </Box>
                      {!isCollapsed && <Box className={styles.navText}>{name}</Box>}
                    </Box>
                  </Link>
                </Tooltip>
              );
            })}
          </Box>
        ))}
      </Box>

      {/* User Profile Section */}
      <Box className={styles.userSection} sx={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Box
          className={`${styles.userProfile} ${isCollapsed ? styles.collapsed : styles.expanded}`}
          onClick={handleMenuOpen}
        >
          <AccountCircle sx={{ fontSize: 32 }} className="text-[var(--sidenav-text)]" />
          {!isCollapsed && (
            <Box className={styles.userInfo}>
              <Box className={styles.userName}>{user?.email?.split('@')[0] || 'User'}</Box>
              <Box className={styles.userRole}>
                {user?.role === 'ROLE_ADMIN' ? 'Admin' : user?.role || 'User'}
              </Box>
            </Box>
          )}
        </Box>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              minWidth: 240,
              bgcolor: 'var(--card-bg)',
              color: 'var(--text-color)',
              border: '1px solid var(--border-soft)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              borderRadius: '12px',
            },
          }}
        >
          {/* User Info */}
          <MenuItem disabled sx={{ p: 2, opacity: '1 !important' }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                mr: 2,
                bgcolor: 'var(--highlight-color)',
                color: 'white',
              }}
            >
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} color="var(--text-color)">
                {user?.email?.split('@')[0] || 'User'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text-color)', opacity: 0.7 }}>
                {user?.role === 'ROLE_ADMIN' ? 'Administrator' : user?.role || 'User'}
              </Typography>
            </Box>
          </MenuItem>

          <Divider sx={{ borderColor: 'var(--border-soft)' }} />

          {/* Email */}
          <MenuItem disabled sx={{ justifyContent: 'flex-start', opacity: '1 !important' }}>
            <Typography variant="body2" sx={{ color: 'var(--text-color)', opacity: 0.7 }}>
              {user?.email || 'No email'}
            </Typography>
          </MenuItem>

          <Divider sx={{ borderColor: 'var(--border-soft)' }} />

          {/* Logout */}
          <MenuItem
            onClick={handleLogout}
            sx={{
              color: '#ef4444',
              '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' },
            }}
          >
            <Logout fontSize="small" sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default SideNav;
