import React from 'react';
import Plot from 'react-plotly.js';
import './DashboardCard.css';

interface LineDashboardProps {
  time: string[];
  maxTemperature: number[];
  minTemperature: number[];
}


const LineDashboard: React.FC<LineDashboardProps> = ({ time, maxTemperature, minTemperature }) => {
    return (
      <div className="dashboard-card">
        <h6>Temperature Trends</h6>
        <div className="chart-container">
          <Plot
            data={[
              {
                x: time,
                y: maxTemperature,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Max Temperature',
                line: { color: 'red' },
              },
              {
                x: time,
                y: minTemperature,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Min Temperature',
                line: { color: 'blue' },
              },
            ]}
            layout={{
              title: 'Daily Max and Min Temperatures',
              xaxis: { title: 'Time' },
              yaxis: { title: 'Temperature (°C)' },
              legend: { orientation: 'h', x: 0.5, y: -0.3},
              autosize: true, // Ensure the chart is responsive
              margin: {
                r: 30,  /* Adjust the right margin to avoid overflow */    
                t:30
              },
            }}
            config={
                {displayModeBar:false}
              }
            useResizeHandler={true} // Enable dynamic resizing
            style={{ width: '100%', height: '80%' }} // Full width and height of the container
          />
        </div>
      </div>
    );
  };
  

export default LineDashboard;
