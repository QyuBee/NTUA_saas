import Header from './static/header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Button, Container, Group, LoadingOverlay } from '@mantine/core';
import axiosConfig from '@/axiosConfig'
import { useEffect, useState } from 'react';

export default function CreditPage() {
    let { data, status } = useSession();
    const router = useRouter();
    const [userDB, setUserDB] = useState(null)
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        const optionsAxios = {
            method: 'GET',
            url: '/api/auth/getuser',
        };

        axiosConfig.request(optionsAxios).then(function (response) {
            const result = response.data

            if (result == null) {
                router.push("/newuser")
            }

            setUserDB(result)
        }).catch(function (error) {
            console.error(error);
            router.push("/")
        });
    }, [])

    
    const ButtonCredit = (props) => {
        return (
            <Button onClick={() => {
                setLoading(true)
                //Insert into database
                const optionsAxios = {
                    method: 'POST',
                    url: 'api/auth/addcredits',
                    params: { credits: props.number }
                };

                axiosConfig.request(optionsAxios)
                    .then(function (response) {
                        // console.log(response.status); // Will show you the status
                        if (response.status !== 200 && response.status !== 500) {
                            console.error("HTTP status " + response.status);
                            setLoading(false);
                        } else {
                            router.push("/account");
                            setLoading(false);
                        }

                        // return response.data;
                    })
                    .catch(function (error) {
                        // Handle error
                        console.error(error);
                        setLoading(false);
                    });

            }}>{props.number} credits</Button>
        )
    }

    return (
        <div>
            <Header></Header>
            <LoadingOverlay visible={(userDB == null || status === 'loading' || loading == true) ? true : false} overlayBlur={2} />
            <Container>
                <h1>Buy Credits</h1>
                <Group>
                    <ButtonCredit number={5} />
                    <ButtonCredit number={10} />
                    <ButtonCredit number={20} />
                    <ButtonCredit number={50} />
                </Group>
            </Container>
        </div>
    );

}