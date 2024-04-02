import { ChangeEvent, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import throttle from 'lodash.throttle';
import { Button, Container, Typography } from '@mui/material';
import { ChromePicker, ColorChangeHandler } from 'react-color';
import { useDrawer } from '../hooks/useDrawer.ts';
import { Draw, DrawLineEvent } from '../model.ts';
import { drawLine } from '../../helpers/drawLine.ts';
type MainViewProps = {
    currentUser: string;
};
import { io } from 'socket.io-client';

export default function MainView({ currentUser }: MainViewProps): ReactElement {
    const [point, setPoint] = useState<number[]>();
    const [color, setColor] = useState('#000000');

    const onPointerMove = useCallback(
        throttle((e: PointerEvent) => {
            setPoint([e.clientX, e.clientY]);
        }, 100),
        [setPoint]
    );

    const { canvasRef, onMouseDown, handleClearCanvas } = useDrawer({ onDraw: createLine, currentUser });

    const socket = io('http://localhost:3000');
    function createLine({ currPoint, prevPoint, ctx }: Draw) {
        socket.emit('draw-line', { currPoint, prevPoint, ctx });
        drawLine({ currPoint, prevPoint, ctx, color });
    }

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');

        socket.on('draw-line', ({ prevPoint, currPoint, color }: DrawLineEvent) => {
            if (!ctx) return;
            drawLine({ prevPoint, currPoint, ctx, color });
        });

        return () => {
            socket.off('draw-line');
        };
    }, [canvasRef]);
    const handleChangeColor = (e) => {
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
                <Button onClick={handleClearCanvas} variant="outlined" severity="primary">
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
