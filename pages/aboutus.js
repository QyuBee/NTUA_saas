import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import  Header  from './static/header';
import { Container,LoadingOverlay } from '@mantine/core';

export default function AboutUsPage() {
    const requestDB = [];
    const { status } = useSession();
    const router = useRouter();

    if (status === 'loading') return         <LoadingOverlay visible={true} overlayBlur={2} />;

    return (
        <div>
            <Header></Header>
            <Container>

            <p>who we are</p>
            <p>pricing</p>
            <p>for developers</p>
            </Container>
        </div>
    );


}
