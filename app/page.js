import { getTutors, getSubjects, getLevels } from '../services/dataService';
import { findAllStudentsMatches } from '../services/matchmakingService'; 
import TutorCard from './components/TutorCard';
import StudentMatchCard from './components/StudentMatchCard';
import AddUserForm from './components/AddUserForm';

export default async function HomePage() {
  const tutors = await getTutors();
  const studentsWithMatches = await findAllStudentsMatches();
  const subjects = await getSubjects();
  const levels = await getLevels();

  return (
    <main className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-4xl font-bold text-center my-8 text-blue-700">Studena Matchmaking</h1>

     <section className="mb-12">
        <AddUserForm initialSubjects={subjects} initialLevels={levels} />
      </section>

      <section className="mb-12">
        <h2 className="section-heading">Nos Tuteurs</h2>
        <div className="grid-3-col-lg grid-2-col-md">
          {tutors.length > 0 ? (
            tutors.map(tutor => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))
          ) : (
            <p className="text-gray-600">Aucun tuteur trouvé.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="section-heading green-heading">Matchmaking Élèves</h2>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
          {studentsWithMatches.length > 0 ? (
            studentsWithMatches.map(({ student, matches }) => (
              <StudentMatchCard key={student.id} student={student} matches={matches} />
            ))
          ) : (
            <p className="text-gray-600">Aucun élève trouvé ou aucun match calculé.</p>
          )}
        </div>
      </section>
    </main>
  );
}