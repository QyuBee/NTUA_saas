import { useSession  } from "next-auth/react"
import { useRouter } from "next/router";
import React , {useState} from 'react';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
const charts = () => {
    const router = useRouter();
    const {data, status} = useSession();
    const [chartIndex, setChartIndex] = useState(0);
    const chartOptions1 = {
        chart:{
            type:'area'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
    
        plotOptions: {
            series: {
                animation: false
            }
        },
    
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }],
        
    }

    const chartOptions2 = {
        chart:{
            type:'line'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
    
        plotOptions: {
            series: {
                animation: false
            }
        },
    
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    }

    const chartOptions3 = {
        chart:{
            type:'bar'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
    
        plotOptions: {
            series: {
                animation: false
            }
        },
    
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    }

    const chartsList = [chartOptions1,chartOptions2,chartOptions3];

    const handleChartChange  = (index) => {
        setChartIndex(index);
    }
    if(status === 'authenticated') {    
        
        return (<div>
            <h1>authorized</h1>
            <div>
                <HighchartsReact 
                    highcharts = {Highcharts}
                    options = {chartsList[chartIndex]}
                />
            </div>
            <button onClick={() => handleChartChange(0)}>line</button>
            <button onClick={() => handleChartChange(1)}>area</button>
            <button onClick={() => handleChartChange(2)}>bar</button>
            <button onClick={ () => router.push('/')}>back to reality</button>
            </div>)

    } else {
        return (<div>
            <h1>Not authorized</h1>
            <button onClick={ () => router.push('/')}>back to reality</button>
            </div>)
    }
}

export default charts