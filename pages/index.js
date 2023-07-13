import { useSession } from 'next-auth/react';
import Header from './static/header';
import { useRouter } from 'next/router';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import { LoadingOverlay } from '@mantine/core'

export default function IndexPage() {
    const router = useRouter();
    const { status } = useSession();
    if (status === 'loading') return <LoadingOverlay visible={true} overlayBlur={2} />;

    // Initiate both requests in parallel
    // const csvData = getCsv("../public/templates/bar-chart.csv")

    // // Wait for the promises to resolve
    // const csv = Promise.all([csvData])

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
    
    return (
        <div>
            <Header></Header>
            <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={options} />

        </div>
    );
}

