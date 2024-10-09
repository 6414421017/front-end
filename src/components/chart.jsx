import { Bar } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
} from 'chart.js';
  
ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend,
BarElement,
);

export default function Chart({
    labels,
    label1, data1,
    label2, data2,
}) {
const data = {
    labels: labels,
    datasets: [
        {
        label:  label1,
        data : data1,
        borderColor: 'rgb(0, 128, 128)',
        backgroundColor: 'rgb(0, 128, 128)',
        },
        {
        label: label2,
        data: data2,
        borderColor: 'rgb(243, 58, 106)',
        backgroundColor: 'rgb(243, 58, 106)',
        },
    ],
    };
  return (
    <Bar
        data={data}
        options={{
            title: {
                display: true,
                text: 'Income and Expense Chart'
            },
        }}
        />
  )
}
