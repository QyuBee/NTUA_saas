import { useSession } from 'next-auth/react';
import  Header  from './static/header';
import { useRouter } from 'next/router';
import { LoadingOverlay } from '@mantine/core'

export default function IndexPage() {
    const router = useRouter();
    const { status } = useSession();
    if (status === 'loading') return <LoadingOverlay visible={true} overlayBlur={2} />;

    return (
    <div>
        <Header></Header>
    </div>
);
}

