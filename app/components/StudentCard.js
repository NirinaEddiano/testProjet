
export default function StudentCard({ student }) {
    const requestedSubjects = student.subjects.join(', ');
    const studentLevel = student.levels.join(', ');
  
    return (
      <div  className="card-base student-card">
        <h3 className="text-xl font-bold text-green-800 mb-2"><span className="icon icon-student"></span>{student.name}</h3>
        <p className="text-gray-700 mb-1">
        <span className="font-semibold">Matière(s) demandée(s) :</span> {requestedSubjects}
        </p>
        <p className="text-gray-700 mb-3">
          <span className="font-semibold">Niveau scolaire :</span> {studentLevel}
        </p>
        <div className="mt-4">
          <h4 className="font-semibold text-green-700 mb-2"><span className="icon icon-availability"></span>Disponibilités :</h4>
          {student.availabilities.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600">
              {student.availabilities.map((avail, index) => (
                <li key={index}>{avail.day} : {avail.start_time} - {avail.end_time}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Pas de disponibilités enregistrées.</p>
          )}
        </div>
      </div>
    );
  }