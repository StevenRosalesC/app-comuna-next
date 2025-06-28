import React from 'react';

export default function UnauthorizedPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}
    >
      <h1 style={{ fontSize: '2rem', color: '#e53e3e', marginBottom: '1rem' }}>
        Acceso no autorizado
      </h1>
      <p>No tienes permisos para acceder a esta sección.</p>
    </div>
  );
}
