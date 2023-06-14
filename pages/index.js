import { useSession } from 'next-auth/react';
import  Header  from './static/header';
import { useRouter } from 'next/router';

export default function IndexPage() {
    const router = useRouter();
    const { status } = useSession();
    if (status === 'loading') return <h1> loading... please wait</h1>;

    return (
    <div>
        <Header></Header>
    </div>
);
}

