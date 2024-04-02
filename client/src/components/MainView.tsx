import { ChangeEvent, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import throttle from 'lodash.throttle';
import { Button, Container, Typography } from '@mui/material';
import { ChromePicker, ColorChangeHandler } from 'react-color';
import { useDrawer } from '../hooks/useDrawer.ts';
import { Draw } from '../model.ts';
type MainViewProps = {
    currentUser: string;
};
export default function MainView({ currentUser }: MainViewProps): ReactElement {
    const [point, setPoint] = useState<number[]>();
    const [currentColor, setCurrentColor] = useState('#000000');

    const onPointerMove = useCallback(
        throttle((e: PointerEvent) => {
            setPoint([e.clientX, e.clientY]);
        }, 100),
        [setPoint]
    );

    const { canvasRef, onMouseDown, handleClearCanvas } = useDrawer({ onDraw: drawAction, currentUser });

    function drawAction({ currPoint, prevPoint, ctx }: Draw) {
        const { x: currX, y: currY } = currPoint;
        const lineWidth = 5;

        let startPoint = prevPoint ?? currPoint;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = currentColor;
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currX, currY);
        ctx.stroke();

        ctx.fillStyle = currentColor;
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    const handleChangeColor = (e) => {
        setCurrentColor(e.hex);
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
                <ChromePicker onChangeComplete={handleChangeColor} color={currentColor} disableAlpha />
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
