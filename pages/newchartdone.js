import Header from './static/header';
import { useSession } from 'next-auth/react';
import { useRouter, withRouter } from 'next/router';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import React, { useEffect, useState } from 'react';
import { Button, Container, Group, Modal, LoadingOverlay } from '@mantine/core';
import axios from 'axios';
import { useDisclosure } from '@mantine/hooks';

export default withRouter(NewChartDonePage)

function NewChartDonePage() {
    const { data, status } = useSession();
    const router = useRouter();
    const [chartOptions, setChartOptions] = useState({});
    const [opened, { open, close }] = useDisclosure(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (router.isReady) {
            if (router.query === null) return router.push('/');

            const input = router.query

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

            setChartOptions(options)

        }
    }, [router.isReady]);

    const UPLOAD_ENDPOINT = "/api/chart/savechart";

    // Handles the submit event on form submit.
    const handleSubmit = async (event) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()
        setLoading(true)

        // Get data from the form.

        // Send the data to the server in JSON format.

        const collection = document.getElementsByClassName("highcharts-container")

        // Create a new HTML document
        const newDocument = document.implementation.createHTMLDocument('collection');

        // Create a container element to hold the collection
        const container = newDocument.createElement('div');

        // Iterate over the collection and clone each element into the container
        for (let i = 0; i < collection.length; i++) {
            const element = collection[i].cloneNode(true);
            container.appendChild(element);
        }

        // Serialize the container's HTML content
        const htmlContent = container.innerHTML;


        const formData = new FormData();
        formData.append("myfile", new Blob([htmlContent], { type: "text/html" }), "chart.html");

        formData.append("chartOption", JSON.stringify(chartOptions));

        axios.post(UPLOAD_ENDPOINT, formData, {
            headers: {
                "content-type": "multipart/form-data"
            }
        }).then(response => {
            // response.data.data = JSON.stringify(response.data.data)
            // console.log(response.data);
            router.push({
                pathname: '/mycharts',
            })
        }).catch(error => {
            // Gérez les erreurs de la requête
            console.error(error);
            if (error) {
                setLoading(false)
                setError(error.response.data)
                open()
            }
        });
    }

    return (
        <div>
            <Header></Header>
            <LoadingOverlay visible={(status === 'loading' || loading == true) ? true : false} overlayBlur={2} />

            <Container>
                <Modal opened={opened} onClose={close} title="Error chart">
                    {error}
                </Modal>

                <HighchartsReact highcharts={Highcharts} options={chartOptions} />

                <Group spacing={"xs"}>
                    <Button onClick={handleSubmit}>save to my chart</Button>

                    <Button onClick={() => { router.push('/createnewchart'); }}>discard</Button>

                </Group>
            </Container>
        </div>
    );


}
