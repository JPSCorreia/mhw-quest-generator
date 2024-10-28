import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from 'react';
import '../Result.css';

const Result = ({ weapon, monster }) => {
  const [weaponImageSrc, setWeaponImageSrc] = useState(null);
  const [monsterImageSrc, setMonsterImageSrc] = useState(null);
  const [versusImageSrc, setVersusImageSrc] = useState(null);

  // Importa todas as imagens dos monstros para que estejam prontas para carregamento dinâmico
  const monsterImages = useMemo(() => {
    return import.meta.glob('../assets/icons/*.webp', { eager: true });
  }, []);

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
    const loadMonsterIcon = () => {
      try {
        if (monster && monsterImages[`../assets/icons/${monster}.webp`]) {
          setMonsterImageSrc(monsterImages[`../assets/icons/${monster}.webp`].default);
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
  }, [weapon, monster, monsterImages]);

  if (!weapon || !monster) return (
    <div className="result-container"></div>
  )

  return (
    <div className="result-container">
        <div className="weapon-versus-monster-container">

          <div className="weapon-container">
            <h4>{weapon}</h4>
            <div>
              {weaponImageSrc && (
                <img
                  src={weaponImageSrc}
                  alt={weapon}
                  style={{ width: '160px', height: '160px' }}
                />
              )}
            </div>
          </div>

          <div className="versus-container" >
            {versusImageSrc && (
              <img 
                src={versusImageSrc} 
                alt="versus"
                style={{ width: '120px', height: '120px'}}
              />
            )}
          </div>

          <div className="monster-container">
            <h4>{monster}</h4>
            <div>
              {monsterImageSrc && (
                <img 
                  src={monsterImageSrc}
                  alt={monster} 
                  style={{ width: '180px', height: '180px' }} 
                />
              )}
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
