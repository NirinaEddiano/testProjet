
export default function TutorCard({ tutor }) {
    return (
      <div  className="card-base tutor-card">
        <h3 className="text-xl font-bold text-blue-800 mb-2"><span className="icon icon-tutor"></span>{tutor.name}</h3>
        <p className="text-gray-700 mb-1">
          <span className="font-semibold">Matières :</span> {tutor.subjects.join(', ')}
        </p>
        <p className="text-gray-700 mb-3">
          <span className="font-semibold">Niveaux :</span> {tutor.levels.join(', ')}
        </p>
        <div className="mt-4">
          <h4 className="font-semibold text-blue-700 mb-2"><span className="icon icon-availability"></span>Disponibilités :</h4>
          {tutor.availabilities.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600">
              {tutor.availabilities.map((avail, index) => (
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