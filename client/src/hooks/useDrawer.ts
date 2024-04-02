import { useEffect, useRef, useState } from 'react';
import throttle from 'lodash.throttle';
import useWebSocket from 'react-use-websocket';
import { Point, Draw } from '../model.ts';

type DrawProps = {
    onDraw: (props: Draw) => void;
    currentUser: string;
};
export const useDrawer = ({ onDraw, currentUser }: DrawProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const prevPoint = useRef<null | Point>(null);

    const [isMouseDown, setIsMouseDown] = useState(false);

    const onMouseDown = (): void => {
        setIsMouseDown(true);
    };

    const { sendJsonMessage } = useWebSocket(`ws://localhost:3000`, {
        share: true,
        onOpen: () => console.log('Connection opened'),
        queryParams: {
            username: currentUser,
        },
    });
    const sendMessageThrottled = useRef(throttle(sendJsonMessage, 50));

    const handleClearCanvas = () => {
        const canvasContext = canvasRef.current?.getContext('2d');
        canvasContext?.clearRect(0, 0, canvasRef.current?.width!, canvasRef.current?.height!);
    };

    useEffect(() => {
        if (!isMouseDown) return;
        const computePoint = (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();

            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        const mouseMoveHandler = (e): void => {
            const currentPoint = computePoint(e);
            const canvasContext = canvasRef.current?.getContext('2d');

            if (!currentPoint || !canvasContext) return;
            onDraw({ ctx: canvasContext, currPoint: currentPoint, prevPoint: prevPoint.current });
            prevPoint.current = currentPoint;

            sendMessageThrottled.current({
                x: e.clientX,
                y: e.clientY,
            });
        };

        const mouseUpHandler = (): void => {
            setIsMouseDown(false);
            prevPoint.current = null;
        };

        canvasRef.current?.addEventListener('mousemove', mouseMoveHandler);
        window.addEventListener('mouseup', mouseUpHandler);

        return () => {
            canvasRef.current?.removeEventListener('mousemove', mouseMoveHandler);
            canvasRef.current?.removeEventListener('mouseup', mouseUpHandler);
        };
    }, [onDraw]);

    return {
        canvasRef,
        onMouseDown,
        handleClearCanvas,
    };
};
