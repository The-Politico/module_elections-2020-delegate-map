import React from 'react';
import styles from './styles.scss';
import { format } from 'date-fns'

function formatDate(d){
  return d.Type + ': ' + format(new Date(d.Date), 'MMM dd, yyyy');
}

class Tooltip extends React.Component {
  render() {
    const { d, sum, isTerritory } = this.props;
    return (
      <div className={styles.component + ' class-name'}>
        <p className='state'>{isTerritory ? d.Name : d.stateData.name}</p>
        <p className='label'>
          <span className='date'>{isTerritory ? formatDate(d) : formatDate(d.delegates)}</span>
          <br />
          <span className='delegates'>{isTerritory ? d.Pledged : d.delegates.Pledged} delegates</span>
        </p>
        <table className={`show-${d.results.length > 0}`}>
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Pct.</th>
              <th>Delegates</th>
            </tr>
          </thead>
          <tbody>
            {
              d.results.map((candidate, i) => (
                <tr key={candidate.name}>
                  <td><span className={candidate.slug} /> {candidate.name}</td>
                  <td>{Math.round(candidate.delegates * 1000 / sum) / 10}%</td>
                  <td>{candidate.delegates}</td>
                </tr>
              )
              )
            }
          </tbody>
        </table>
      </div>
    );
  }
}
export default Tooltip;
