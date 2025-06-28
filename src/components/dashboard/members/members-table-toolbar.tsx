// Toolbar for comuneros table
// Comments in English as requested

export function MembersTableToolbar({
  search,
  onSearchChange
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className='mb-4 flex items-center gap-2'>
      <input
        type='text'
        placeholder='Buscar comunero...'
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className='w-full max-w-xs rounded border px-3 py-2'
      />
    </div>
  );
}
