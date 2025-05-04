import React from 'react';

// Dummy data for requirements
const requirements = [
  { id: 1, description: 'Ser mayor de edad', mandatory: true },
  { id: 2, description: 'Residir en la comunidad', mandatory: true },
  { id: 3, description: 'Presentar DNI vigente', mandatory: false },
];

export default function RequirementsTable() {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Requisito</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Obligatorio</th>
          <th className="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {requirements.map((req) => (
          <tr key={req.id}>
            <td className="px-4 py-2">{req.description}</td>
            <td className="px-4 py-2">
              {req.mandatory ? (
                <span className="text-green-600 font-semibold">Sí</span>
              ) : (
                <span className="text-gray-400">No</span>
              )}
            </td>
            <td className="px-4 py-2 text-right">
              {/* Actions: edit/delete */}
              <button className="text-blue-600 hover:underline mr-2">Editar</button>
              <button className="text-red-600 hover:underline">Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 