import { CSSProperties, useState } from 'react';
import Calendar from './components/Calendar'
import DatePicker from './components/DatePicker'
import './App.css'

const styles: { [key: string]: CSSProperties } = {
  apiContainer: {
    marginTop: "30px",
    textAlign: "center",
  },
  tableContainer: {
    width: "100%"
  }
};

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <h1>Calendar and DatePicker Overview</h1>
      <hr />
      <div className="calendar-demo-container">
        <h2>Calendar</h2>
        <Calendar />
        <h2>DatePicker</h2>
        <DatePicker date={selectedDate} onSelect={handleDateChange} />
      </div>

      <hr />

      <div style={styles.apiContainer}>
        <h4>API</h4>
        <table style={styles.tableContainer}>
          <thead>
            <tr>
              <th align="left">Name</th>
              <th align="left">Type</th>
              <th align="left">Default</th>
              <th align="left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td align="left">date</td>
              <td align="left">object or string</td>
              <td align="left">null</td>
              <td align="left"></td>
            </tr>
            <tr>
              <td align="left">onSelect</td>
              <td align="left">function(date)</td>
              <td align="left"></td>
              <td align="left">Called when a date is selected.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App
