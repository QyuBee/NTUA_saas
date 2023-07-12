import Header from './static/header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, Container, SimpleGrid, Table, Title, ScrollArea, createStyles, rem, LoadingOverlay } from '@mantine/core';
import axios from 'axios';


function ButtonChart({ id, type }) {
    return (
        <Button onClick={() => {
            const options = {
                method: 'GET',
                url: 'http://localhost:3000/api/chart/downloadchart',
                params: { type: type, chart_id: id }
            };

            axios.request(options).then(function (response) {
                console.log(response.data);

                // Manipulez la réponse du serveur
                // Dans ce cas, nous allons télécharger le fichier
                const filename = response.headers['content-disposition'].split('filename=')[1];
                const file = response.data;

                // Créez un lien de téléchargement pour le fichier
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(new Blob([file]));
                downloadLink.setAttribute('download', filename);

                // Ajoutez le lien de téléchargement à la page
                document.body.appendChild(downloadLink);

                // Cliquez sur le lien pour lancer le téléchargement
                downloadLink.click();

            }).catch(function (error) {
                console.error(error);
            });
        }} >{type}</Button>
    )
}

function Chart({ chart, setChart }) {
    return (

        <tr
            onClick={() => {
                const options = {
                    method: 'GET',
                    url: 'http://localhost:3000/api/chart/downloadchart',
                    params: { type: "html", chart_id: chart.id }
                };

                axios.request(options)
                    .then(function (response) {
                        // console.log(response.data);

                        // Lecture du fichier HTML téléchargé
                        const fileReader = new FileReader();
                        fileReader.onload = function (event) {
                            const downloadedChart = event.target.result;

                            // Mettre à jour le state avec le contenu du fichier HTML
                            setChart(<div dangerouslySetInnerHTML={{ __html: downloadedChart }}></div>);
                        };
                        fileReader.readAsText(new Blob([response.data]));
                    })
                    .catch(function (error) {
                        console.error(error);
                    });

            }}
        >
            <td  >

                {chart.type}
            </td>
            <td>{chart.name}</td>
            <td>{chart.created}</td>
            <td>
                <ButtonChart id={chart.id} type={"html"} />
                <ButtonChart id={chart.id} type={"svg"} />
                <ButtonChart id={chart.id} type={"png"} />
                <ButtonChart id={chart.id} type={"pdf"} />
            </td>
        </ tr>
    )
}

const useStyles = createStyles((theme) => ({
    header: {
        position: 'sticky',
        top: 0,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        transition: 'box-shadow 150ms ease',

        '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            borderBottom: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
                }`,
        },
    },

    scrolled: {
        boxShadow: theme.shadows.sm,
    },
}));

export default function MyChartsPage() {
    const { data, status } = useSession();
    const router = useRouter();
    const [chart, setChart] = useState(<div></div>)
    const [scrolled, setScrolled] = useState(false);
    const [mycharts, setMycharts] = useState([]);
    const { classes, cx } = useStyles();

    useEffect(() => {
        const optionsAxios = {
            method: 'GET',
            url: 'http://localhost:3000/api/chart/getchartfromuser',
        };

        axios.request(optionsAxios).then(function (response) {
            const result = response.data.map((chart) => {
                return (<Chart key={chart.id} chart={chart} setChart={setChart} />)
            })

            setMycharts(result)
        }).catch(function (error) {
            console.error(error);
        });
    }, [])

    if (data === null) return router.push('/');;

    return (
        <div>
            <Header></Header>
            <LoadingOverlay visible={status === 'loading' ? true : false} overlayBlur={2} />;
            <Container fluid m={0}>
                <Title>My charts</Title>
                <SimpleGrid cols={2} spacing="xs" >
                    <ScrollArea h={400} onScrollPositionChange={({ y }) => setScrolled(y !== 0)} style={{ height: "400px" }}>
                        <Table miw={700} highlightOnHover withBorder >
                            <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                                <tr>
                                    <th>Type</th>
                                    <th>Chart name</th>
                                    <th>created</th>
                                    <th>download</th>
                                </tr>
                            </thead>
                            <tbody>{mycharts}</tbody>
                        </Table>
                    </ScrollArea>

                    <Container>{chart}</Container>
                </SimpleGrid>
            </Container>
        </div>
    );


}
