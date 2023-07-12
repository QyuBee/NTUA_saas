import Header from './static/header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { getUser } from '@/lib/db';
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import { Button, Container, Group, LoadingOverlay } from '@mantine/core';
import { useEffect, useState } from 'react';

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions)

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const userDB = await getUser(session.user.email)

    return {
        props: {
            userDB: JSON.stringify(userDB),
        },
    }
}


export default function CreditPage({ userDB }) {
    let { data, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    let Page;
    userDB = JSON.parse(userDB)
    
    if (status === 'loading') return <h1> loading... please wait</h1>;

    const ButtonCredit = (props) => {
        return (
            <Button onClick={() => {
                setLoading(true)
                //Insert into database
                fetch('/api/auth/addcredits', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email:data.user.email, credits:props.number}),
                }).then(function(response) {
                    // console.log(response.status); // Will show you the status
                    if (response.status!=200 && response.status!=500) {
                        console.error("HTTP status " + response.status);
                    }
                    else{
                        router.push("/account")
                    }

                    // return response.json();
                })
            }}>{props.number} credits</Button>
        )
    }

    if (userDB != null) {
        Page = (
            <Group>
                <ButtonCredit number={5} />
                <ButtonCredit number={10} />
                <ButtonCredit number={20} />
                <ButtonCredit number={50} />
            </Group>
        )
    }

    return (
        <div>
            <Header></Header>
            <Container>
            <h1>Buy Credits</h1>
            {status === "authenticated" && Page}
            </Container>
        </div>
    );

}