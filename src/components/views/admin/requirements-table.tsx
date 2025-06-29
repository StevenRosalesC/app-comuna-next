import React from 'react';

// Dummy data for requirements
const requirements = [
  { id: 1, description: 'Ser mayor de edad', mandatory: true },
  { id: 2, description: 'Residir en la comunidad', mandatory: true },
  { id: 3, description: 'Presentar DNI vigente', mandatory: false }
];

export default function RequirementsTable() {
  return (
    <table className='min-w-full divide-y divide-gray-200'>
      <thead>
        <tr>
          <th className='px-4 py-2 text-left text-xs font-medium uppercase text-gray-500'>
            Requisito
          </th>
          <th className='px-4 py-2 text-left text-xs font-medium uppercase text-gray-500'>
            Obligatorio
          </th>
          <th className='px-4 py-2'></th>
        </tr>
      </thead>
      <tbody className='divide-y divide-gray-200 bg-white'>
        {requirements.map((req) => (
          <tr key={req.id}>
            <td className='px-4 py-2'>{req.description}</td>
            <td className='px-4 py-2'>
              {req.mandatory ? (
                <span className='font-semibold text-green-600'>Sí</span>
              ) : (
                <span className='text-gray-400'>No</span>
              )}
            </td>
            <td className='px-4 py-2 text-right'>
              {/* Actions: edit/delete */}
              <button className='mr-2 text-blue-600 hover:underline'>
                Editar
              </button>
              <button className='text-red-600 hover:underline'>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
