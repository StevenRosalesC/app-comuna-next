import React from 'react';

// Dummy data for annual fees
const annualFees = [
  { id: 1, year: 2023, description: 'Cuota ordinaria', amount: 100, mandatory: true },
  { id: 2, year: 2023, description: 'Cuota extraordinaria', amount: 50, mandatory: false },
  { id: 3, year: 2024, description: 'Cuota ordinaria', amount: 120, mandatory: true },
];

export default function AnnualFeesTable() {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Año</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Monto (S/.)</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Obligatorio</th>
          <th className="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {annualFees.map((fee) => (
          <tr key={fee.id}>
            <td className="px-4 py-2">{fee.year}</td>
            <td className="px-4 py-2">{fee.description}</td>
            <td className="px-4 py-2">S/. {fee.amount}</td>
            <td className="px-4 py-2">
              {fee.mandatory ? (
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