import React from 'react';
import styles from './styles.scss';

import ChartContainer from './ChartContainer';
import { processData } from './utils/processData.js';
import results from './data/results.json';
import stateCoors from './data/stateCoors.json';
import territoryCoors from './data/territoryCoors.json';

class DelegateMap extends React.Component {
  constructor (props) {
    super(props);
    //const kitchenSink = 'https://www.politico.com/interactives/apps/kitchensink/18sLdD0xCuYL/data.json';
    const processedData = processData(stateCoors, territoryCoors, results);
    this.state = {
      totals: processedData.totals,
      mapData: processedData.mapData,
      territoriesData: processedData.territoriesData,
    };
  }
  render () {
    const { totals, mapData, territoriesData } = this.state;
    return (
      <div className={styles.component + ' class-name'}>
        <ChartContainer
          totals={ totals }
          mapData={ mapData }
          territoriesData={ territoriesData }
        />
      </div>
    );
  }
}
export default DelegateMap;
