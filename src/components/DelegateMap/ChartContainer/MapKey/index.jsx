import React from 'react';
import styles from './styles.scss';

class MapKey extends React.Component {
  render () {
    const { data } = this.props;

    return (
      <div className={styles.component + ' class-name'}>
        {
          data.map((d, i) =>
            <p key={`key-${i}`}>
              <span className={`backer ${d.slug}`}> </span>
              {d.full_name}
            </p>
          )
        }
        <p> <span className='backer other'></span> Not assigned yet </p>
      </div>
    );
  }
}
export default MapKey;
