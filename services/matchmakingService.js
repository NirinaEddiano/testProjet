
import { getTutors, getStudents } from './dataService'; 

function checkOverlap(studentAvail, tutorAvail) {
  const studentStart = new Date(`2000-01-01T${studentAvail.start_time}:00`);
  const studentEnd = new Date(`2000-01-01T${studentAvail.end_time}:00`);
  const tutorStart = new Date(`2000-01-01T${tutorAvail.start_time}:00`);
  const tutorEnd = new Date(`2000-01-01T${tutorAvail.end_time}:00`);

  return (studentStart < tutorEnd && studentEnd > tutorStart);
}

export async function findMatchesForStudent(studentId) {
  const allTutors = await getTutors();
  const allStudents = await getStudents();
  const student = allStudents.find(s => s.id === studentId);

  if (!student) {
    return [];
  }

  const potentialMatches = [];

  for (const tutor of allTutors) {
    const subjectMatch = student.subjects.some(sub => tutor.subjects.includes(sub));
    if (!subjectMatch) continue; 
    const levelMatch = student.levels.some(lvl => tutor.levels.includes(lvl));
    if (!levelMatch) continue; 
    let hasPerfectAvailabilityMatch = false;
    let hasPartialAvailabilityMatch = false;

    const commonAvailabilities = []; 

    for (const studentAvail of student.availabilities) {
      for (const tutorAvail of tutor.availabilities) {
        if (studentAvail.day === tutorAvail.day) { 
          if (checkOverlap(studentAvail, tutorAvail)) {
            hasPartialAvailabilityMatch = true;

            const commonStart = new Date(Math.max(
              new Date(`2000-01-01T${studentAvail.start_time}:00`).getTime(),
              new Date(`2000-01-01T${tutorAvail.start_time}:00`).getTime()
            ));
            const commonEnd = new Date(Math.max(
              new Date(`2000-01-01T${studentAvail.end_time}:00`).getTime(),
              new Date(`2000-01-01T${tutorAvail.end_time}:00`).getTime()
            ));
            const actualCommonEnd = new Date(Math.min(
                new Date(`2000-01-01T${studentAvail.end_time}:00`).getTime(),
                new Date(`2000-01-01T${tutorAvail.end_time}:00`).getTime()
            ));

            if (commonStart < actualCommonEnd) { 
              commonAvailabilities.push({
                  day: studentAvail.day,
                  start_time: commonStart.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                  end_time: actualCommonEnd.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
              });

              const studentStartTime = new Date(`2000-01-01T${studentAvail.start_time}:00`).getTime();
              const studentEndTime = new Date(`2000-01-01T${studentAvail.end_time}:00`).getTime();

              const tutorStartTime = new Date(`2000-01-01TtutorAvail.start_time}:00`).getTime();
              const tutorEndTime = new Date(`2000-01-01T${tutorAvail.end_time}:00`).getTime();

              if (studentStartTime >= tutorStartTime && studentEndTime <= tutorEndTime) {
                  hasPerfectAvailabilityMatch = true;
              }
            }
          }
        }
      }
    }

    if (!hasPartialAvailabilityMatch) {
        continue; 
    }

    let compatibilityScore = 0;
    let matchDescription = [];

    if (subjectMatch) {
      compatibilityScore += 30;
      matchDescription.push(`Matière(s) compatible(s)`);
    }
    if (levelMatch) {
      compatibilityScore += 30;
      matchDescription.push(`Niveau(x) compatible(s)`);
    }
    if (hasPerfectAvailabilityMatch) {
      compatibilityScore += 40;
      matchDescription.push(`Disponibilité parfaite`);
    } else if (hasPartialAvailabilityMatch) {
      compatibilityScore += 20;
      matchDescription.push(`Disponibilité partielle`);
    }


    potentialMatches.push({
      tutor,
      score: compatibilityScore,
      matchDescription: matchDescription.join(' ; '),
      commonAvailabilities: commonAvailabilities
    });
  }

  potentialMatches.sort((a, b) => b.score - a.score);

  return potentialMatches;
}

export async function findAllStudentsMatches() {
  const allStudents = await getStudents();
  const allMatches = [];

  for (const student of allStudents) {
    const matchesForStudent = await findMatchesForStudent(student.id);
    allMatches.push({
      student,
      matches: matchesForStudent
    });
  }
  return allMatches;
}