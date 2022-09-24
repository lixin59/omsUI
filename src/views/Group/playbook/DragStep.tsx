import React from 'react';
import type { Identifier, XYCoord } from 'dnd-core';
import type { FC, ReactNode } from 'react';
import Paper from '@mui/material/Paper';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Typography from '@mui/material/Typography';

const style = {
  width: '100%',
  paddingLeft: '14px',
  marginBottom: '10px',
  // border: '1px dashed gray',
  borderRadius: '5px 5px 0 0',
  background: '#0ba8a8',
  cursor: 'move'
};

type tProps = {
  index: number;
  moveStep: (dragIndex: number, hoverIndex: number) => void;
  children: ReactNode;
  text: string;
};

interface DragItem {
  index: number;
}

export const DragStep: FC<tProps> = ({ index, moveStep, children, text }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: 'playbookStep',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveStep(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'playbookStep',
    item: () => {
      return { index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <Paper elevation={2} data-handler-id={handlerId}>
      <Typography ref={ref} style={{ ...style, opacity }} variant="h6" gutterBottom component="div">
        {text}
      </Typography>
      {children}
    </Paper>
  );
};
