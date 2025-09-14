
'use client'; 

import React, { useState, useRef, useEffect } from 'react';
import { addUser } from '../../services/actions'; 

export default function AddUserForm({ initialSubjects = [], initialLevels = [] }) {
    const [status, setStatus] = useState({ message: '', type: '' });
    const [subjectsOptions, setSubjectsOptions] = useState(initialSubjects.map(s => s.name));
    const [levelsOptions, setLevelsOptions] = useState(initialLevels.map(l => l.name));
    const formRef = useRef(null);
    const [selectedSubjects, setSelectedSubjects] = useState(['']); 
    const [selectedLevels, setSelectedLevels] = useState(['']);    
    const [availabilities, setAvailabilities] = useState([{ day: '', startTime: '', endTime: '' }]);

    useEffect(() => {
        setSubjectsOptions(initialSubjects.map(s => s.name));
      }, [initialSubjects]);
      useEffect(() => {
        setLevelsOptions(initialLevels.map(l => l.name));
      }, [initialLevels]);

      const handleSubjectChange = (e, index) => {
        const newSubjects = [...selectedSubjects];
        newSubjects[index] = e.target.value;
        setSelectedSubjects(newSubjects);
      };
    
      const handleLevelChange = (e, index) => {
        const newLevels = [...selectedLevels];
        newLevels[index] = e.target.value;
        setSelectedLevels(newLevels);
      };

      const addSubjectField = () => setSelectedSubjects([...selectedSubjects, '']);
      const addLevelField = () => setSelectedLevels([...selectedLevels, '']);
      const removeSubjectField = (index) => {
        const newSubjects = selectedSubjects.filter((_, i) => i !== index);
        setSelectedSubjects(newSubjects);
      };
      const removeLevelField = (index) => {
        const newLevels = selectedLevels.filter((_, i) => i !== index);
        setSelectedLevels(newLevels);
      };

      const handleAvailabilityChange = (index, field, value) => {
        const newAvailabilities = [...availabilities];
        newAvailabilities[index][field] = value;
        setAvailabilities(newAvailabilities);
      };
    
      const addAvailabilityField = () => setAvailabilities([...availabilities, { day: '', startTime: '', endTime: '' }]);
      const removeAvailabilityField = (index) => {
        const newAvailabilities = availabilities.filter((_, i) => i !== index);
        setAvailabilities(newAvailabilities);
      };

      const handleSubmit = async (event) => {
        event.preventDefault();
    
        setStatus({ message: 'Envoi en cours...', type: 'info' });
    
        const formData = new FormData(formRef.current);

        selectedSubjects.forEach(sub => {
          if (sub) formData.append('subjects', sub);
        });
        selectedLevels.forEach(lvl => {
          if (lvl) formData.append('levels', lvl);
        });
        availabilities.forEach(avail => {
          if (avail.day && avail.startTime && avail.endTime) {
            formData.append('availabilities', `${avail.day}|${avail.startTime}|${avail.endTime}`);
          }
        });
    
        const result = await addUser(formData);
    
        if (result.success) {
          setStatus({ message: result.success, type: 'success' });
          formRef.current.reset();
          setSelectedSubjects(['']);
          setSelectedLevels(['']);
          setAvailabilities([{ day: '', startTime: '', endTime: '' }]);
        } else {
          setStatus({ message: result.error, type: 'error' });
        }
      };


  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  return (
    <div className="add-user-form-container bg-blue-50 p-6 rounded-lg shadow-inner mb-12">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Ajouter un nouvel utilisateur (Tuteur/Élève)</h2>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div  className="form-group">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-1"><span className="icon icon-user"></span>Nom Complet :</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="form-input w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="form-group">
          <label htmlFor="role" className="block text-gray-700 font-semibold mb-1"><span className="icon icon-role"></span>Rôle :</label>
          <select
            id="role"
            name="role"
            required
            className="form-select w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Sélectionnez un rôle</option>
            <option value="tutor">Tuteur</option>
            <option value="student">Élève</option>
          </select>
        </div>

        <div  className="form-group">
          <label className="block text-gray-700 font-semibold mb-1"><span className="icon icon-subject"></span>Matière(s) :</label>
          {selectedSubjects.map((subject, index) => (
            <div key={index} className="field-array-item flex items-center space-x-2 mb-2">
              <select
                value={subject}
                onChange={(e) => handleSubjectChange(e, index)}
                className="form-select flex-grow p-2 border border-gray-300 rounded-md"
              >
                <option value="">Sélectionnez ou ajoutez</option>
                {subjectsOptions.map((sub, sIndex) => (
                  <option key={sIndex} value={sub}>{sub}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Nouvelle matière..."
                value={subject}
                onChange={(e) => handleSubjectChange(e, index)}
                className="form-input flex-grow p-2 border border-gray-300 rounded-md"
              />
              <button type="button" onClick={() => removeSubjectField(index)} className="remove-btn">X</button>
            </div>
          ))}
          <button type="button" onClick={addSubjectField}  className="add-field-btn">Ajouter une matière</button>
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-semibold mb-1"><span className="icon icon-level"></span>Niveau(x) :</label>
          {selectedLevels.map((level, index) => (
            <div key={index} className="field-array-item flex items-center space-x-2 mb-2">
              <select
                value={level}
                onChange={(e) => handleLevelChange(e, index)}
                className="form-select"
              >
                <option value="">Sélectionnez ou ajoutez</option>
                {levelsOptions.map((lvl, lIndex) => (
                  <option key={lIndex} value={lvl}>{lvl}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Nouveau niveau..."
                value={level}
                onChange={(e) => handleLevelChange(e, index)}
                className="form-input"
              />
              <button type="button" onClick={() => removeLevelField(index)} className="remove-btn">X</button>
            </div>
          ))}
          <button type="button" onClick={addLevelField} className="add-field-btn">Ajouter un niveau</button>
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-semibold mb-1"><span className="icon icon-availability"></span>Disponibilités :</label>
          {availabilities.map((avail, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <select
                value={avail.day}
                onChange={(e) => handleAvailabilityChange(index, 'day', e.target.value)}
                required
               className="form-select"
              >
                <option value="">Jour</option>
                {daysOfWeek.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <input
                type="time"
                value={avail.startTime}
                onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                required
                className="form-input"
              />
              <span>-</span>
              <input
                type="time"
                value={avail.endTime}
                onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                required
                 className="form-input"
              />
              <button type="button" onClick={() => removeAvailabilityField(index)} className="remove-btn">X</button>
            </div>
          ))}
          <button type="button" onClick={addAvailabilityField} className="add-field-btn">Ajouter un créneau</button>
        </div>

        <button
          type="submit"
          className="submit-btn"
        >
          Ajouter l&apos;utilisateur
        </button>

        {status.message && (
          <p className={`status-message ${status.type}`}>
            {status.message}
          </p>
        )}
      </form>
    </div>
  );
}
