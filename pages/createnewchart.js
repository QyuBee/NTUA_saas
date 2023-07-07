import Header from './static/header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { getUser } from '@/lib/db';
import axios from 'axios';
import { Button, Container, FileInput, Group, Modal, rem } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Carousel } from '@mantine/carousel';


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

export default function CreateChartPage({ userDB }) {
    let { status } = useSession();
    const router = useRouter();
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);

    if (status === 'loading') return <h1> loading... please wait</h1>;

    userDB = JSON.parse(userDB)


    const UPLOAD_ENDPOINT = "/api/chart/parsecsv";
    const DOWNLOAD_ENDPOINT = "/api/chart/downloadtemplate";
    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(file)
        //if await is removed, console log will be called before the uploadFile() is executed completely.
        //since the await is added, this will pause here then console log will be called
        const formData = new FormData();
        formData.append("myfile", file, file.name);
        axios.post(UPLOAD_ENDPOINT, formData, {
            headers: {
                "content-type": "multipart/form-data"
            }
        }).then(response => {
            response.data.data = JSON.stringify(response.data.data)
            // console.log(response.data);
            router.push({
                pathname: '/newchartdone',
                query: response.data
            })
        })
            .catch(error => {
                // Gérez les erreurs de la requête
                open()
                setError(error.response.data)
                console.error(error.response.data);
            });
    };

    const DownloadFile = (type) => {
        axios.post(DOWNLOAD_ENDPOINT, { type: type })
            .then(response => {
                // Manipulez la réponse du serveur
                // Dans ce cas, nous allons télécharger le fichier
                const filename = response.headers['content-disposition'].split('filename=')[1];
                const csvFile = response.data;

                // Créez un lien de téléchargement pour le fichier
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(new Blob([csvFile]));
                downloadLink.setAttribute('download', filename);

                // Ajoutez le lien de téléchargement à la page
                document.body.appendChild(downloadLink);

                // Cliquez sur le lien pour lancer le téléchargement
                downloadLink.click();
            })
            .catch(error => {
                // Gérez les erreurs de la requête
                open()
                setError(error)
                console.error(error);
            });
    }

    return (
        <div>
            <Header></Header>
            <Container>
                <Carousel>
                    <Carousel.Slide>
                        <Button type="Button" onClick={() => { DownloadFile("bar") }}>Download bar template</Button>
                    </Carousel.Slide>

                    <Carousel.Slide>
                        <Button type="Button" onClick={() => { DownloadFile("line") }}>Download line template</Button>
                    </Carousel.Slide>

                    <Carousel.Slide>
                        <Button type="Button" onClick={() => { DownloadFile("pie") }}>Download pie template</Button>
                    </Carousel.Slide>

                </Carousel>
                {/* // We pass the event to the handleSubmit() function on submit. */}
                <form onSubmit={handleSubmit}>
                    <Modal opened={opened} onClose={close} title="Error chart">
                        {error}
                    </Modal>

                    <h3>Select your files</h3>
                    <FileInput label="Upload csv files" placeholder="Upload csv files" icon={<IconUpload size={rem(14)} accept="csv" />} onChange={setFile} />

                    <br />
                    <br />
                    <Group>
                        <Button type="submit">
                            Send File
                        </Button>
                        <Button type="Button" onClick={() => { router.push('/mycharts'); }}>cancel</Button>

                    </Group>

                </form>
            </Container>
        </div>
    );


}
