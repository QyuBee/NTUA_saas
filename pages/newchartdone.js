import Header from './static/header';
import { useSession } from 'next-auth/react';
import { useRouter, withRouter } from 'next/router';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import React, { useEffect, useRef, useState } from 'react';

export default withRouter(NewChartDonePage)

function NewChartDonePage() {
    const { data, status } = useSession();
    const router = useRouter();
    const [chartOptions, setChartOptions] = useState({});

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




    if (status === 'loading') return <h1> loading... please wait</h1>;


    /*  {
         chart: {
             type: 'bar'
         },
         title: {
             text: 'Historic World Population by Region',
         },
         xAxis: {
             categories: ['Africa', 'America', 'Asia', 'Europe'],
             title: {
                 text: null
             },
             gridLineWidth: 1,
             lineWidth: 0
         },
         yAxis: {
             min: 0,
             title: {
                 text: 'Population (millions)',
                 align: 'high'
             },
             labels: {
                 overflow: 'justify'
             },
             gridLineWidth: 0
         },
         series: [{
             name: 'Year 1990',
             data: [631, 727, 3202, 721]
         }, {
             name: 'Year 2000',
             data: [814, 841, 3714, 726]
         }, {
             name: 'Year 2018',
             data: [1276, 1007, 4561, 746]
         }]
     }
     {
         chart: {
             type: 'line'
         },
         title: {
             text: 'U.S Solar Employment Growth',
             align: 'left'
         },
     
         yAxis: {
             title: {
                 text: 'Number of Employees'
             }
         },
     
         xAxis: {
             accessibility: {
                 rangeDescription: 'Range: 2010 to 2020'
             }
         },
     
         legend: {
             layout: 'vertical',
             align: 'right',
             verticalAlign: 'middle'
         },
     
         plotOptions: {
             series: {
                 label: {
                     connectorAllowed: false
                 },
                 pointStart: 2010
             }
         },
     
         series: [{
             name: 'Installation & Developers',
             data: [43934, 48656, 65165, 81827, 112143, 142383,
                 171533, 165174, 155157, 161454, 154610]
         }, {
             name: 'Manufacturing',
             data: [24916, 37941, 29742, 29851, 32490, 30282,
                 38121, 36885, 33726, 34243, 31050]
         }, {
             name: 'Sales & Distribution',
             data: [11744, 30000, 16005, 19771, 20185, 24377,
                 32147, 30912, 29243, 29213, 25663]
         }, {
             name: 'Operations & Maintenance',
             data: [null, null, null, null, null, null, null,
                 null, 11164, 11218, 10077]
         }, {
             name: 'Other',
             data: [21908, 5548, 8105, 11248, 8989, 11816, 18274,
                 17300, 13053, 11906, 10073]
         }],
     
         responsive: {
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
     
     } */

    // Handles the submit event on form submit.
    const handleSubmit = async (event) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()

        // Get data from the form.
        const data = {
            html: document.getElementsByClassName("highcharts-container").getParent().innerHTML,
            chartOption: null,
        }

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/chart/savechart'

        // Form the request for sending data to the server.
        const options = {
            // The method is POST because we are sending data.
            method: 'POST',
            // Tell the server we're sending JSON.
            headers: {
                'Content-Type': 'application/json',
            },
            // Body of the request is the JSON data we created above.
            body: JSONdata,
        }

        // Send the form data to our forms API on Vercel and get a response.
        const response = await fetch(endpoint, options)


        // Get the response data from server as JSON.
        // If server returns the name submitted, that means the form works.
        const result = await response.json()
        // console.log(result)
        alert(`Is this your full name: ${result.message}`)
    }

    return (
        <div>
            <Header></Header>
            <p>{data.user.email}</p>

            <HighchartsReact highcharts={Highcharts} options={chartOptions} />

            <button onClick={() => {
                //Insert db
                router.push('/mycharts');
            }}>save to my chart</button>

            <button onClick={() => { handleSubmit }}>discard</button>
        </div>
    );


}
