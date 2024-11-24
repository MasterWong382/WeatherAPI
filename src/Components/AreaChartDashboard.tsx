import { title } from 'process';
import React from 'react';
import Plot from 'react-plotly.js';
import './DashboardCard.css';

interface AreaChartProps {
  y_axis_label: string
  time: string[];
  values: number[];
}
const AreaChartDashboard: React.FC<AreaChartProps> = ({ y_axis_label, time, values }) => {
    return (
      <div className="dashboard-card">
        <h6>Direct Radiation (Area Chart)</h6>
        <div className="chart-container">
          <Plot
            data={[
              {
                x: time,
                y: values,
                type: 'scatter',
                mode: 'lines',
                name: y_axis_label,
                fill: 'tozeroy', // Fill below the line for an area chart effect
                line: { color: 'orange' },
              },
            ]}
            layout={{
              title: `${y_axis_label} over time`,
              xaxis: { title: 'Time' },
              yaxis: { title: y_axis_label },
              legend: { orientation: 'h', x: 0, y: -0.2 },
              autosize: true, // Ensure the chart is responsive
            }}
            useResizeHandler={true} // Enable dynamic resizing
            style={{ width: '100%', height: '100%' }} // Full width and height of the container
          />
        </div>
      </div>
    );
  };
  
export default AreaChartDashboard;
