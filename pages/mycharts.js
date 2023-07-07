import Header from './static/header';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import React from 'react';
import { Button, Container, Group, Table, Title } from '@mantine/core';

export default function MyChartsPage() {
    const { data, status } = useSession();
    const router = useRouter();

    if (status === 'loading') return <h1> loading... please wait</h1>;
    if (data === null) return router.push('/');;

    const options = {
        title: {
            text: 'My stock chart'
        },

        series: [{
            data: [[Date.UTC(2013, 5, 2), 0.7695],
            [Date.UTC(2013, 5, 3), 0.7648],
            [Date.UTC(2013, 5, 24), 0.7623],]
        }]
    }

    const rows=null

    return (
        <div>
            <Header></Header>
            <Container fluid m={0}>
                <Title>My chart</Title>
                <Group noWrap>
                    <Table width={"500px"}>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Chart name</th>
                                <th>created</th>
                                <th>download</th>
                            </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </Table>

                    <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={options} />,
                </Group>
            </Container>
        </div>
    );


}
