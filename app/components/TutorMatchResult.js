
export default function TutorMatchResult({ match }) {
    const { tutor, score, matchDescription, commonAvailabilities } = match;
  
    return (
      <div className="tutor-match-result">
        <h5 className="text-lg font-bold text-blue-700 mb-1">{tutor.name}</h5>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Matières :</span> {tutor.subjects.join(', ')}
        </p>
        <p className="text-sm text-gray-700 mb-2">
          <span className="font-semibold">Niveaux :</span> {tutor.levels.join(', ')}
        </p>
        <div className="match-score-info">
          <p className="score-text">Score de Compatibilité : {score}%</p>
          <p className="description-text">{matchDescription}</p>
          {commonAvailabilities.length > 0 && (
            <div className="common-availabilities">
              <p className="text-xs font-semibold text-gray-700">Créneaux communs :</p>
              <ul className="list-disc list-inside text-xs text-gray-600">
                {commonAvailabilities.map((avail, index) => (
                  <li key={index}>{avail.day} : {avail.start_time} - {avail.end_time}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }