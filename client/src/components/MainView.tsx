import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import throttle from 'lodash.throttle';
import { Box, colors, Container, Slider, Typography } from '@mui/material';
import { SketchPicker } from 'react-color';
import { useDrawer } from '../hooks/useDrawer.ts';
type MainViewProps = {
    currentUser: string;
};
export default function MainView({ currentUser }: MainViewProps): ReactElement {
    const [point, setPoint] = useState<number[]>();
    const [currentColor, setCurrentColor] = useState('#000');
    const [currentLineWidth, setCurrentLineWidth] = useState<number>(5);

    const onPointerMove = useCallback(
        throttle((e: PointerEvent) => {
            setPoint([e.clientX, e.clientY]);
        }, 100),
        [setPoint]
    );

    const { canvasRef, onMouseDown } = useDrawer({ onDraw: drawAction, currentUser });

    function drawAction({ currPoint, prevPoint, ctx }) {
        const { x: currX, y: currY } = currPoint;
        const color = currentColor;
        const lineWidth = currentLineWidth;

        let startPoint = prevPoint ?? currPoint;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currX, currY);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, currentLineWidth, 0, currentLineWidth * Math.PI);
        ctx.fill();
    }

    const handleChangeColor = (e) => {
        setCurrentColor(e.hex);
    };

    const handleLineWidthChange = (e): void => setCurrentLineWidth(e.target.value);

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
                <SketchPicker onChangeComplete={handleChangeColor} color={currentColor} />
                <Slider onChange={handleLineWidthChange} defaultValue={currentLineWidth} />
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
