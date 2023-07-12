import Header from './static/header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import axios from 'axios';
import { Button, Center, Container, FileInput, Group, Modal, rem, LoadingOverlay } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Carousel } from '@mantine/carousel';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import { csvJSON } from './api/chart/utils';

function readFileAsync(path) {
    let fs = require('fs');
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

export async function getServerSideProps() {
    let templates = []

    let fs = require('fs');
    var csvFiles = fs.readdirSync(`${process.cwd()}/public/templates/`);

    for (const file of csvFiles) {
        const filePath = `${process.cwd()}/public/templates/${file}`;
        const contents = await readFileAsync(filePath);
        templates.push(csvJSON(contents));
    }


    // contents is a string with the content of uploaded file, so you can read it or store


    const result = templates.map((input) => {
        input = JSON.parse(input)
        if (typeof input.data == "string") { //With router in some case (refresh), it might be a string and in other an Object
            input.data = JSON.parse(input.data)
        }

        const options = {
            chart: {
                type: input.type
            },
            title: {
                text: input.title,
                align: 'left'
            },
            series: [{
                name: input.x_axe[0],
                colorByPoint: true,
                data: input.data.map(({ name, data }) => { return { name: name, y: parseFloat(data) } })
            }]
        }
        if (input.type == "pie") {
            options.series = [{
                name: input.x_axe[0],
                colorByPoint: true,
                data: input.data.map(({ name, data }) => { return { name: name, y: parseFloat(data) } })
            }]
            options.tooltip = {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            }
            options.accessibility = {
                point: {
                    valueSuffix: '%'
                }
            }
            options.plotOptions = {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            }
        } else if (input.type == "bar") {
            options.xAxis = {
                categories: input.x_axe
            }
            options.yAxis = {
                min: 0,
                title: {
                    text: input.y_axe,
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                },
                gridLineWidth: 0
            }

            options.series = input.data
        }

        else if (input.type == "line") {
            options.yAxis = {
                title: {
                    text: input.y_axe
                }
            }


            options.xAxis = {
                categories: input.x_axe
            }

            options.series = input.data


            options.plotOptions = {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: 2010
                }
            }

            options.legend = {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            }

            options.responsive = {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        }
        return { template: input, options: options }
    })

    return {
        props: {
            templates: result,
        },
    }
}

export default function CreateChartPage({ templates }) {
    let { status } = useSession();
    const router = useRouter();
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [loading, setLoading] = useState(false)

    if (status === 'loading') return <h1> loading... please wait</h1>;



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
            <LoadingOverlay visible={(templates == null || status === 'loading' || loading== true) ? true : false} overlayBlur={2} />
            <Container>
                <Carousel loop>
                    {templates.map((template) => {

                        return (
                            <Carousel.Slide>
                                <HighchartsReact highcharts={Highcharts} options={template.options} />
                                <Center>
                                <Button type="Button" onClick={() => { DownloadFile(template.template.type) }}>Download {template.template.type}-chart template</Button>

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
