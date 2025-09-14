
'use server'; 

import db from '../lib/db';
import { revalidatePath } from 'next/cache'; 
async function getOrCreateId(tableName, value) {
    try {
        const [rows] = await db.execute(`SELECT id FROM ${tableName} WHERE name = ?`, [value]);
        if (rows.length > 0) {
            return rows[0].id;
        } else {
            const [result] = await db.execute(`INSERT INTO ${tableName} (name) VALUES (?)`, [value]);
            return result.insertId;
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération/création dans ${tableName}:`, error);
        throw error;
    }
}

export async function addUser(formData) {
    const name = formData.get('name');
    const role = formData.get('role');
    const subjects = formData.getAll('subjects').filter(Boolean); 
    const levels = formData.getAll('levels').filter(Boolean);
    const availabilitiesRaw = formData.getAll('availabilities').filter(Boolean);

    if (!name || !role || subjects.length === 0 || levels.length === 0 || availabilitiesRaw.length === 0) {
        return { error: 'Tous les champs sont requis.' };
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [userResult] = await connection.execute(
            'INSERT INTO users (name, role) VALUES (?, ?)',
            [name, role]
        );
        const userId = userResult.insertId;

        for (const subjectName of subjects) {
            const subjectId = await getOrCreateId('subjects', subjectName);
            await connection.execute(
                'INSERT INTO user_subjects (user_id, subject_id) VALUES (?, ?)',
                [userId, subjectId]
            );
        }

        for (const levelName of levels) {
            const levelId = await getOrCreateId('levels', levelName);
            await connection.execute(
                'INSERT INTO user_levels (user_id, level_id) VALUES (?, ?)',
                [userId, levelId]
            );
        }

        for (const availString of availabilitiesRaw) {
            const [day, startTime, endTime] = availString.split('|');
            if (day && startTime && endTime) {
                await connection.execute(
                    'INSERT INTO availabilities (user_id, day, start_time, end_time) VALUES (?, ?, ?, ?)',
                    [userId, day, startTime, endTime]
                );
            }
        }

        await connection.commit();
        revalidatePath('/');
        return { success: `L'utilisateur ${name} a été ajouté.` };

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
        return { error: `Échec de l'ajout de l'utilisateur : ${error.message}` };
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
