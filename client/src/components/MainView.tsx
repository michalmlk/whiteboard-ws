import { ReactElement, useEffect, useRef } from 'react';
import useWebSocket from 'react-use-websocket';
import throttle from 'lodash.throttle';
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

    const sendMessageThrottled = useRef(throttle(sendJsonMessage, 100));

    useEffect(() => {
        window.addEventListener('mousemove', (e) => {
            sendMessageThrottled.current({
                x: e.clientX,
                y: e.clientY,
            });
        });
    }, []);

    return <h1>Welcome back {currentUser}!</h1>;
}
