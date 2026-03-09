import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface Column {
  id: number;
  label: string;
  key?: string;
}

interface ColumnSettingsModalProps {
  open: boolean;
  columns: Column[];
  onClose: () => void;
  onSave: (newOrder: Column[]) => void;
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
};

const ColumnSettingsModal: React.FC<ColumnSettingsModalProps> = ({
  open,
  columns,
  onClose,
  onSave,
}) => {
  const [orderedColumns, setOrderedColumns] = React.useState(columns);

  React.useEffect(() => {
    setOrderedColumns(columns);
  }, [columns]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newOrder = Array.from(orderedColumns);
    const [movedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, movedItem);
    setOrderedColumns(newOrder);
  };

  const handleSave = () => {
    onSave(orderedColumns);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Manage Table Columns
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Drag and drop to change the order of columns.
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="columns-list">
            {(provided: any) => (
              <List
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{
                  maxHeight: 300,
                  overflowY: 'auto',
                  border: '1px solid #ddd',
                  borderRadius: 1,
                }}
              >
                {orderedColumns.map((col, index) => (
                  <Draggable key={col.id.toString()} draggableId={col.id.toString()} index={index}>
                    {(provided: any, snapshot: any) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{
                          bgcolor: snapshot.isDragging ? '#f0f0f0' : 'white',
                          borderBottom: '1px solid #eee',
                          cursor: 'grab',
                        }}
                        secondaryAction={
                          <IconButton {...provided.dragHandleProps}>
                            <DragIndicatorIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText primary={col.label} />
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ColumnSettingsModal;
