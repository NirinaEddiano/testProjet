
import db from '../lib/db';

export async function getTutors() {
  try {
    const [rows] = await db.execute(`
      SELECT
          u.id,
          u.name,
          GROUP_CONCAT(DISTINCT s.name SEPARATOR ', ') AS subjects,
          GROUP_CONCAT(DISTINCT l.name SEPARATOR ', ') AS levels
      FROM users u
      LEFT JOIN user_subjects us ON u.id = us.user_id
      LEFT JOIN subjects s ON us.subject_id = s.id
      LEFT JOIN user_levels ul ON u.id = ul.user_id
      LEFT JOIN levels l ON ul.level_id = l.id
      WHERE u.role = 'tutor'
      GROUP BY u.id
      ORDER BY u.name;
    `);

    const tutorsWithAvailabilities = await Promise.all(rows.map(async (tutor) => {
      const [availabilities] = await db.execute(
        `SELECT day, start_time, end_time FROM availabilities WHERE user_id = ? ORDER BY FIELD(day, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'), start_time`,
        [tutor.id]
      );
      return {
        ...tutor,
        subjects: tutor.subjects ? tutor.subjects.split(', ') : [],
        levels: tutor.levels ? tutor.levels.split(', ') : [],
        availabilities: availabilities.map(a => ({
          ...a,
          start_time: a.start_time.substring(0, 5), 
          end_time: a.end_time.substring(0, 5)
        }))
      };
    }));

    return tutorsWithAvailabilities;
  } catch (error) {
    console.error('Erreur lors de la récupération des tuteurs :', error);
    return [];
  }
}

export async function getStudents() {
  try {
    const [rows] = await db.execute(`
      SELECT
          u.id,
          u.name,
          GROUP_CONCAT(DISTINCT s.name SEPARATOR ', ') AS subjects,
          GROUP_CONCAT(DISTINCT l.name SEPARATOR ', ') AS levels
      FROM users u
      LEFT JOIN user_subjects us ON u.id = us.user_id
      LEFT JOIN subjects s ON us.subject_id = s.id
      LEFT JOIN user_levels ul ON u.id = ul.user_id
      LEFT JOIN levels l ON ul.level_id = l.id
      WHERE u.role = 'student'
      GROUP BY u.id
      ORDER BY u.name;
    `);

    const studentsWithAvailabilities = await Promise.all(rows.map(async (student) => {
      const [availabilities] = await db.execute(
        `SELECT day, start_time, end_time FROM availabilities WHERE user_id = ? ORDER BY FIELD(day, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'), start_time`,
        [student.id]
      );
      return {
        ...student,
        subjects: student.subjects ? student.subjects.split(', ') : [],
        levels: student.levels ? student.levels.split(', ') : [],
        availabilities: availabilities.map(a => ({
          ...a,
          start_time: a.start_time.substring(0, 5),
          end_time: a.end_time.substring(0, 5)
        }))
      };
    }));

    return studentsWithAvailabilities;
  } catch (error) {
    console.error('Erreur lors de la récupération des élèves :', error);
    return [];
  }
}

export async function getSubjects() {
  try {
    const [rows] = await db.execute('SELECT id, name FROM subjects ORDER BY name');
    return rows;
  } catch (error) {
    console.error('Erreur lors de la récupération des matières :', error);
    return [];
  }
}

export async function getLevels() {
  try {
    const [rows] = await db.execute('SELECT id, name FROM levels ORDER BY name');
    return rows;
  } catch (error) {
    console.error('Erreur lors de la récupération des niveaux :', error);
    return [];
  }
}