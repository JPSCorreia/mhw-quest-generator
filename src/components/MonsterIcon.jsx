import PropTypes from "prop-types";

const MonsterIcon = ({ imageName }) => {
  // As imagens estão disponíveis na pasta pública, podemos gerar o caminho diretamente
  const imageSrc = `/src/assets/icons/${imageName}.webp`;

  return (
    <img 
      src={imageSrc} 
      alt={imageName} 
      style={{ width: '120px', height: '120px' }} 
    />
  );
};

MonsterIcon.propTypes = {
    imageName: PropTypes.string.isRequired,
};

export default MonsterIcon;
