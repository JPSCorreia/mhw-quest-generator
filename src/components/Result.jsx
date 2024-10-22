import PropTypes from "prop-types";
import { useState, useEffect } from 'react';
import '../Result.css';

const Result = ({ weapon, monster }) => {
  const [weaponImageSrc, setWeaponImageSrc] = useState(null);
  const [monsterImageSrc, setMonsterImageSrc] = useState(null);
  const [versusImageSrc, setVersusImageSrc] = useState(null);

  useEffect(() => {
    // Carregar a imagem da arma dinamicamente
    const loadWeaponIcon = async () => {
      try {
        if (weapon) {
          const image = await import(`../assets/icons/${weapon}.png`);
          setWeaponImageSrc(image.default);
        }
      } catch (err) {
        console.error('Erro ao carregar a imagem da arma:', err);
      }
    };

    // Carregar a imagem do monstro dinamicamente
    const loadMonsterIcon = async () => {
      try {
        if (monster) {
          const image = await import(`../assets/icons/${monster}.webp`);
          setMonsterImageSrc(image.default);
        }
      } catch (err) {
        console.error('Erro ao carregar a imagem do monstro:', err);
      }
    };

    // Carregar a imagem "versus" dinamicamente
    const loadVersusIcon = async () => {
      try {
        const image = await import(`../assets/images/versus.png`);
        setVersusImageSrc(image.default);
      } catch (err) {
        console.error('Erro ao carregar a imagem "versus":', err);
      }
    };

    loadWeaponIcon();
    loadMonsterIcon();
    loadVersusIcon();
  }, [weapon, monster]);

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
            {versusImageSrc && (
              <img 
                src={versusImageSrc} 
                alt="versus"
                style={{ width: '100px', height: '100px', margin: '5px' }}
              />
            )}
          </div>

          <div className="monster-container" style={{  width: '240px' }}>
            <h4>{monster}</h4>
            <div style={{ width: '120px', height: '120px' }}>
              {monsterImageSrc && (
                <img 
                  src={monsterImageSrc} 
                  alt={monster} 
                  style={{ width: '120px', height: '120px' }} 
                />
              )}
            </div>
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
