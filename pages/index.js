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
        chart: {type: 'line'},
      title: {text: 'U.S Solar Employment Growth', align: 'left'},
      series: [
        {
          name: 'Installation & Developers',
          data: [
            43934,
            48656,
            65165,
            81827,
            112143,
            142383,
            171533,
            165174,
            155157,
            161454,
            154610
          ]
        },
        {
          name: 'Manufacturing',
          data: [24916, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726, 34243, 31050]
        },
        {
          name: 'Sales & Distribution',
          data: [11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 29243, 29213, 25663]
        },
        {
          name: 'Operations & Maintenance',
          data: [null, null, null, null, null, null, null, null, 11164, 11218, 10077]
        },
        {
          name: 'Other',
          data: [21908, 5548, 8105, 11248, 8989, 11816, 18274, 17300, 13053, 11906, 10073]
        }
      ],
      yAxis: {title: {text: 'Number of Employees'}},
      xAxis: {
        categories: [
          '2010',
          '2011',
          '2012',
          '2013',
          '2014',
          '2015',
          '2016',
          '2017',
          '2018',
          '2018',
          '2020'
        ]
      },
      plotOptions: {series: {label: {connectorAllowed: false}, pointStart: 2010}},
      legend: {layout: 'vertical', align: 'right', verticalAlign: 'middle'},
      responsive: {
        rules: [
          {
            condition: {maxWidth: 500},
            chartOptions: {legend: {layout: 'horizontal', align: 'center', verticalAlign: 'bottom'}},
            _id: 'highcharts-hkkhdpz-121'
          }
        ]
      }
    }
    
    return (
        <div>
            <Header></Header>
            <HighchartsReact highcharts={Highcharts} constructorType={'chart'} options={options} />

        </div>
    );
}

