import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import throttle from 'lodash.throttle';
import { Cursor } from './Cursor.tsx';
import { Box, Container, Typography } from '@mui/material';
type MainViewProps = {
    currentUser: string;
};
export default function MainView({ currentUser }: MainViewProps): ReactElement {
    const { sendJsonMessage } = useWebSocket(`ws://localhost:3000`, {
        share: true,
        onOpen: () => console.log('Connection opened'),
        queryParams: {
            username: currentUser,
        },
    });

    const [point, setPoint] = useState<number[]>();

    const onPointerMove = useCallback(
        throttle((e: PointerEvent) => {
            setPoint([e.clientX, e.clientY]);
        }, 100),
        [setPoint]
    );

    const sendMessageThrottled = useRef(throttle(sendJsonMessage, 100));

    useEffect(() => {
        window.addEventListener('mousemove', (e) => {
            sendMessageThrottled.current({
                x: e.clientX,
                y: e.clientY,
            });
        });
    }, []);

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4 }}>
            <Typography component="h3" variant="h3">
                Welcome back {currentUser}! 😁
            </Typography>
            <Box
                onPointerMove={onPointerMove}
                sx={{
                    width: '100%',
                    height: '100vh',
                    p: 4,
                    cursor: 'none',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                }}
            >
                {point && <Cursor point={point} />}
            </Box>
        </Container>
    );
}
