import PropTypes from 'prop-types';

const QuestHistory = ({ quests }) => {
  return (
    <div className='quest-history'>
      <h3 style={{textAlign: "end"}} className={quests.length === 20 ? 'red' : 'white'}>Last 20 Generated Quests</h3>
      <ul style={{listStyleType: "none", padding: 0}}>
        {quests.length === 0 ? (
          <p className='quest-history-item'>No quests generated yet.</p>
        ) : (
          quests.map((quest, index) => (
            <li key={index} className='quest-history-item'>
              <strong>{quest.weapon} vs {quest.monster}</strong> 
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

QuestHistory.propTypes = {
  quests: PropTypes.arrayOf(
    PropTypes.shape({
      weapon: PropTypes.string.isRequired,
      monster: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default QuestHistory;
