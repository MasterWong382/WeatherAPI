import React from 'react';
import Plot from 'react-plotly.js';
import './DashboardCard.css';

interface ColumnDashboardProps {
  y_axis_label: string;
  time: string[];
  values: number[];
}

const ColumnDashboard: React.FC<ColumnDashboardProps> = ({ y_axis_label, time, values }) => {
  return (
    <div className="dashboard-card">
      <h6>{y_axis_label}</h6>
      <div className="chart-container">
        <Plot
          data={[
            {
              x: time,
              y: values,
              type: 'bar',
              marker: { color: 'blue' },
              
            },
          ]}
          layout={{
            title: `${y_axis_label} over time`,
            xaxis: { title: 'Time' },
            yaxis: { title: y_axis_label },
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

export default ColumnDashboard;
