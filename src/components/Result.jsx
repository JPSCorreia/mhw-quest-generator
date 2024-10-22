import PropTypes from "prop-types";
import MonsterIcon from './MonsterIcon';
import { useState, useEffect } from 'react';
import '../Result.css';

const Result = ({ weapon, monster }) => {
  const [weaponImageSrc, setWeaponImageSrc] = useState(null);

  useEffect(() => {
    // Dynamically import the weapon image from the assets/icons folder
    const loadWeaponIcon = async () => {
      try {
        if (weapon) {
          const image = await import(`../assets/icons/${weapon}.png`);
          setWeaponImageSrc(image.default);
        }
      } catch (err) {
        console.error('Error loading weapon image:', err);
      }
    };

    loadWeaponIcon();
  }, [weapon]);

  if (!weapon || !monster) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
      <h2>Quest</h2>
      <div className="result-container">

        <div className="weapon-container" style={{  width: '240px' }}>
          <h4>{weapon}</h4>
          <div style={{ width: '120px', height: '120px' }}>
          {weaponImageSrc && (
            <img
              src={weaponImageSrc}
              alt={weapon}
              style={{ width: '110px', height: '110px' }}
            />
          )}
          </div>
        </div>

        <div style={{ height: '60px' }}>
          <img 
            src="/src/assets/images/versus.png" 
            alt="versus"
            style={{ width: '100px', height: '100px', margin: '5px' }}
          />
        </div>

        <div className="monster-container" style={{  width: '240px' }}>
          <h4>{monster}</h4>
          {monster && <MonsterIcon imageName={monster} />}
        </div>

      </div>
      </div>
    </div>
  );
};

Result.propTypes = {
  weapon: PropTypes.string,
  monster: PropTypes.string,
};

export default Result;
