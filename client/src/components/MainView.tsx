import { ReactElement, useEffect, useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { ChromePicker } from 'react-color';
import { useDrawer } from '../hooks/useDrawer.ts';
import { Draw, DrawLineEvent } from '../model.ts';
import { drawLine } from '../../helpers/drawLine.ts';
import { io } from 'socket.io-client';

type MainViewProps = {
    currentUser: string;
};

export default function MainView({ currentUser }: MainViewProps): ReactElement {
    const [color, setColor] = useState('#000000');
    const { canvasRef, onMouseDown, handleClearCanvas } = useDrawer({ onDraw: createLine, currentUser });

    const socket = io('http://localhost:3000');
    function createLine({ currPoint, prevPoint, ctx }: Draw) {
        socket.emit('draw-line', { currPoint, prevPoint, ctx });
        drawLine({ currPoint, prevPoint, ctx, color });
    }

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');

        socket.emit('client-prepared');

        socket.on('get-current-canvas', () => {
            if (!canvasRef.current?.toDataURL()) return;
            socket.emit('canvas-state', canvasRef.current?.toDataURL());
        });

        socket.on('canvas-state-from-server', (state: string) => {
            const image = new Image();
            image.src = state;
            image.onload = () => {
                ctx?.drawImage(image, 0, 0);
            };
        });

        socket.on('draw-line', ({ prevPoint, currPoint, color }: DrawLineEvent) => {
            if (!ctx) return;
            drawLine({ prevPoint, currPoint, ctx, color });
        });

        socket.on('clear', () => {
            console.log('canvas cleared');
            handleClearCanvas();
        });

        return () => {
            socket.off('draw-line');
            socket.off('canvas-state-from-server');
            socket.off('get-current-canvas');
            socket.off('clear');
            socket.off('client-prepared');
        };
    }, [canvasRef]);
    const handleChangeColor = (e: any) => {
        setColor(e.hex);
    };

    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
            <Container
                sx={{
                    width: '320px',
                    height: 768,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Typography component="h3" variant="h3">
                    Welcome back {currentUser} 😀
                </Typography>
                <ChromePicker onChangeComplete={handleChangeColor} color={color} disableAlpha />
                <Button onClick={() => socket.emit('clear')} variant="outlined" color="primary">
                    Clear canvas
                </Button>
            </Container>
            <canvas
                width={768}
                height={768}
                onMouseDown={onMouseDown}
                ref={canvasRef}
                style={{
                    border: '1px solid #000',
                    borderRadius: '8px',
                }}
            />
        </Container>
    );
}
