import React, { useState, MouseEvent, useCallback } from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export interface ValueCopyProps {
  value: string | number;
  onClick?: (value: string | number) => void;
  showCopyIcon?: boolean;
  copyIcon?: React.ReactNode;
  tooltipCopy?: string;
  tooltipCopied?: string;
  className?: string;
  sx?: object;
}

export const ValueCopyWithClick: React.FC<ValueCopyProps> = ({
  value,
  onClick,
  showCopyIcon = false,
  copyIcon,
  tooltipCopy = 'Copy',
  tooltipCopied = 'Copied!',
  className,
  sx,
}) => {
  const [justCopied, setJustCopied] = useState(false);
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 1500);
    } catch (err) {
      console.error('Copy failed', err);
    }
  }, [value]);

  const handleValueClick = () => {
    if (onClick) {
      onClick(value);
    }
  };

  const handleCopyClick = (e: MouseEvent) => {
    e.stopPropagation();
    copyToClipboard();
  };

  return (
    <>
      <Box
        className={className}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          cursor: onClick ? 'pointer' : 'default',
          userSelect: 'none',
          ...sx,
        }}
        onClick={handleValueClick}
      >
        <Typography
          variant="body2"
          component="span"
          sx={{
            mr: onClick ? 0.5 : 0,
            textDecoration: onClick ? 'underline' : 'none',
            color: onClick ? 'primary.main' : 'text.primary',
            cursor: onClick ? 'pointer' : 'default',
          }}
        >
          {value}
        </Typography>

        {showCopyIcon && (
          <Tooltip title={justCopied ? tooltipCopied : tooltipCopy} placement="top" arrow>
            <IconButton
              size="small"
              onClick={handleCopyClick}
              sx={{
                verticalAlign: 'middle',
                color: 'text.secondary',
              }}
              aria-label="copy to clipboard"
            >
              {copyIcon ?? <ContentCopyIcon fontSize="inherit" sx={{ fontSize: '12px' }} />}
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </>
  );
};

export default ValueCopyWithClick;
