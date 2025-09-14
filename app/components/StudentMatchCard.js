
import TutorMatchResult from './TutorMatchResult';

export default function StudentMatchCard({ student, matches }) {
  const requestedSubjects = student.subjects.join(', ');
  const studentLevel = student.levels.join(', ');

  return (
    <div className="student-match-card">
      <div className="header-section">
        <div>
          <h3 className="text-2xl font-bold text-green-800"><span className="icon icon-student"></span>{student.name}</h3>
          <p className="text-gray-700 mt-1">
            <span className="font-semibold">Demande :</span> {requestedSubjects} ({studentLevel})
          </p>
        </div>
      </div>

      <div className="match-results-section">
        <h4 className="text-xl font-semibold text-green-700 mb-4"><span className="icon icon-match"></span>Tuteurs suggérés :</h4>
        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map(match => (
              <TutorMatchResult key={match.tutor.id} match={match} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-md">
            <span className="font-semibold">Aucun tuteur trouvé</span> pour {student.name} avec les critères spécifiés.
          </p>
        )}
      </div>
    </div>
  );
}