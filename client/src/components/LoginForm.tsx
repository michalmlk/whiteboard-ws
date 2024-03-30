import { ChangeEvent, ReactElement, useState } from 'react';
import { Button, Card, CardActions, CardContent, CardHeader, Container, InputLabel, OutlinedInput } from '@mui/material';

type LoginFormProps = {
    onSubmit: (userName: string) => void;
};
export default function LoginForm({ onSubmit }: LoginFormProps): ReactElement {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setInputValue(e.target.value);
    };
    const [inputValue, setInputValue] = useState('');

    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'start',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: 320,
                    gap: 4,
                }}
                component="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(inputValue);
                }}
            >
                <CardHeader title="How people should call you?" />
                <CardContent sx={{ width: '100%' }}>
                    <InputLabel>Name</InputLabel>
                    <OutlinedInput type="text" sx={{ width: '100%' }} onChange={handleInputChange} />
                </CardContent>
                <CardActions sx={{ mb: 4 }}>
                    <Button variant="contained" type="submit" disabled={inputValue.trim().length === 0}>
                        Log in
                    </Button>
                </CardActions>
            </Card>
        </Container>
    );
}
