import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import  Header  from './static/header';

export default function AboutUsPage() {
    const requestDB = [];
    const { status } = useSession();
    const router = useRouter();

    if (status === 'loading') return <h1> loading... please wait</h1>;

    return (
        <div>
            <Header></Header>
            <p>who we are</p>
            <p>pricing</p>
            <p>for developers</p>
        </div>
    );


}