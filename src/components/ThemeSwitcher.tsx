// src/components/ThemeSwitcher.tsx
import React, { useState } from 'react';
import { useTheme } from '@hooks/useTheme';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Moon, Monitor, Check } from 'lucide-react';

type ThemeMode = 'light' | 'dark' | 'system';

/*
 * A professional Theme Switcher dropdown mimicking high-end
 * layouts used by modern frameworks like Vercel and MUI.
 */
const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const selectTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    handleClose();
  };

  // Determine which icon shows on the AppBar when the menu is closed
  const CurrentIcon = theme === 'dark' ? Moon : Monitor;

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-label="Toggle Theme"
        sx={{
          color: 'var(--text-color)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'var(--border-soft)',
            transform: 'scale(1.05)',
          },
        }}
      >
        <CurrentIcon size={20} strokeWidth={2} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            width: 160,
            overflow: 'visible',
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-color)',
            border: '1px solid var(--border-soft)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            borderRadius: '12px',
            '& .MuiMenuItem-root': {
              padding: '10px 16px',
              fontSize: '0.9rem',
              fontWeight: 500,
              gap: '12px',
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: 'var(--border-soft)',
              },
            },
          },
        }}
      >
        <MenuItem onClick={() => selectTheme('dark')}>
          <Moon size={18} />
          <span style={{ flexGrow: 1 }}>Dark</span>
          {theme === 'dark' && <Check size={16} className="text-[var(--highlight-color)]" />}
        </MenuItem>

        <MenuItem onClick={() => selectTheme('system')}>
          <Monitor size={18} />
          <span style={{ flexGrow: 1 }}>System</span>
          {theme === 'system' && <Check size={16} className="text-[var(--highlight-color)]" />}
        </MenuItem>
      </Menu>
    </>
  );
};

export default ThemeSwitcher;
