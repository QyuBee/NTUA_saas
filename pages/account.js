import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from './static/header';
import { Button, Container, Group, LoadingOverlay } from '@mantine/core';
import { useEffect, useState } from 'react';
import axiosConfig from '@/axiosConfig'
import axiosConfig from '@/axiosConfig';

export default function AccountPage() {
    const { status } = useSession();
    const router = useRouter();
    const [userDB,setUserDB]=useState(null)
    const [loading, setLoading] = useState(false)


    let Page;

    useEffect(() => {
        const optionsAxios = {
            method: 'GET',
            url: '/api/auth/getuser',
        };

        axiosConfig.request(optionsAxios).then(function (response) {
            const result = response.data

            setUserDB(result)
        }).catch(function (error) {
            console.error(error);
            router.push("/")
        });
    }, [])

    if (status === "authenticated") {
        Page = (<div>
            <p>Email : {userDB && userDB.email}</p>
            <p>Credits : {userDB && userDB.credits}</p>
            <p>lastConnection : {userDB && userDB.lastConnection}</p>

            <Group>
                <Button onClick={() => { setLoading(true); router.push('/mycharts'); }}>my charts</Button>
                <Button onClick={() => { setLoading(true); router.push('/createnewchart'); }}>new chart</Button>
                <Button onClick={() => { setLoading(true); router.push('/credits'); }}>buy credits</Button>
            </Group>

        </div>)
    }

    return (
        <div>
            <Header></Header>
            <LoadingOverlay visible={userDB==null || loading ?  true : false} overlayBlur={2} />;
            <Container>
                <h1>Account</h1>
                {status === "authenticated" && Page}
            </Container>

        </div>
    );



}
