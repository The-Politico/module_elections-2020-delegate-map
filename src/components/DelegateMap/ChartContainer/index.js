import React from 'react';
import styles from './styles.scss';

import Map from './Map';
import MapKey from './MapKey';

class ChartContainer extends React.Component {
  constructor (props) {
    super(props);
  }
  render () {
    const { totals, mapData, territoriesData } = this.props;
    return (
      <div className={styles.component + ' class-name'}>
        <MapKey data={totals} />
        <Map data={[mapData, territoriesData]} />
      </div>
    );
  }
}
export default ChartContainer;
