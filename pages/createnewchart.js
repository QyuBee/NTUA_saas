import Header from './static/header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Center, Container, FileInput, Group, Modal, rem, LoadingOverlay } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Carousel } from '@mantine/carousel';


import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'



export default function CreateChartPage() {
    let { status } = useSession();
    const router = useRouter();
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [templates, setTemplates] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        const optionsPie = {
            method: 'GET',
            url: '/api/chart/downloadtemplatecharts',
            params: { type: "pie" }
        };

        const optionsBar = {
            method: 'GET',
            url: '/api/chart/downloadtemplatecharts',
            params: { type: "bar" }
        };
        const optionsLine = {
            method: 'GET',
            url: '/api/chart/downloadtemplatecharts',
            params: { type: "line" }
        };
        setLoading(true)
        axios.all([
            axios.request(optionsPie),
            axios.request(optionsBar),
            axios.request(optionsLine)
        ])
            .then(axios.spread(function (pieResponse, barResponse, lineResponse) {
                const pieData = pieResponse.data;
                const barData = barResponse.data;
                const lineData = lineResponse.data;

                setTemplates([
                    { type: "pie", option: pieData },
                    { type: "bar", option: barData },
                    { type: "line", option: lineData },
                ]);
                setLoading(false)
            }))
            .catch(function (error) {
                console.error(error);
                setLoading(false)
            });

    }, [])

    const UPLOAD_ENDPOINT = "/api/chart/parsecsv";
    const DOWNLOAD_ENDPOINT = "/api/chart/downloadtemplate";
    const handleSubmit = (e) => {
        e.preventDefault();

        setLoading(true)

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
                setLoading(false)
                open()
                setError(error.response.data)
                console.error(error.response.data);
            });
    };

    const DownloadFile = (type) => {
        const optionsAxios = {
            method: 'POST',
            url: DOWNLOAD_ENDPOINT,
            params: { type: type }
        };

        axios.request(optionsAxios).then(response => {
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
            <LoadingOverlay visible={(templates == null || status === 'loading' || loading== true) ? true : false} overlayBlur={2} />
            <Container>
                <Carousel loop>
                    {templates && templates.map((template) => {

                        return (
                            <Carousel.Slide key={template.type}>
                                <HighchartsReact highcharts={Highcharts} options={template.option} />
                                <Center>
                                    <Button type="Button" onClick={() => { DownloadFile(template.type) }}>Download {template.type}-chart template</Button>

                                </Center>
                            </Carousel.Slide>

                        )
                    })}

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
