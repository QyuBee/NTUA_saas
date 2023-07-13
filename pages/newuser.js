import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from './static/header';
import { Button, Container, Group, LoadingOverlay } from '@mantine/core';
import { useEffect, useState } from 'react';
import axios from 'axios';


export default function NewUserPage() {
    // TODO check come from account.google
    let { data, status, update } = useSession();
    const [loading, setLoading] = useState(false)
    const [Page, setPage] = useState(<div></div>)
    const router = useRouter();


    useEffect(() => {
        const optionsAxios = {
            method: 'GET',
            url: '/api/auth/getuser',
        };
        setLoading(true)

        axios.request(optionsAxios).then(function (response) {
            const result = response.data

            if(result==null){
                setPage(
                    <div>
        
                        <Container>
        
                            <p>This is the first time you are logging with {data && data.user.email}</p>
                            <p>if you continue, your email will be stored in our user database to allow you store your created chartsand purchase chart credits</p>
                            <Group>
        
                                <Button onClick={() => {
        
        
                                    const optionsAxios = {
                                        method: 'GET',
                                        url: '/api/auth/adduser',
                                    };
        
                                    axios.request(optionsAxios).then(function (response) {
                                        if (response.status != 200 && response.status != 500) {
                                            console.error("HTTP status " + response.status);
                                        }
                                        else {
                                            router.push("/account")
                                        }
                                    }).catch(function (error) {
                                        console.error(error);
                                        router.push("/")
                                    });
                                }}>continue</Button>
                                <Button onClick={()=>{signOut({ callbackUrl: '/' })}}>no, thanks</Button>
                            </Group>
                        </Container>
                    </div>
                );
                setLoading(false)
            }else{
                // setUserDB(result)
                const optionsAxios = {
                    method: 'GET',
                    url: '/api/auth/setLastConnection',
                };
        
                axios.request(optionsAxios).then(function (response) {
                    if (response.status != 200 && response.status != 500) {
                        console.error("HTTP status " + response.status);
                    }
                    else {
                        router.push("/account")
                    }
                }).catch(function (error) {
                    console.error(error);
                    router.push("/")
                });
            }

        }).catch(function (error) {
            console.error(error);
            router.push("/")
        });
    }, [])


    return (
        <div>

        <Header></Header>
            <LoadingOverlay visible={loading ? true : false} overlayBlur={2} />;
        <Container>
            <h1>New User</h1>
            {status === "authenticated" && Page}
        </Container>
        </div>
    );

}

