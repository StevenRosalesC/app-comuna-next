'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, RotateCw, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface UsersTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  onStatusFilterChange: (value: 'all' | 'active' | 'inactive') => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function UsersTableToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  isRefreshing
}: UsersTableToolbarProps) {
  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4'>
      {/* Search & Filters */}
      <div className='flex flex-1 flex-col gap-2 sm:flex-row sm:items-center'>
        <div className='relative w-full sm:w-72'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Buscar por usuario, email o cédula...'
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className='pl-9 pr-8 h-9 text-xs sm:text-sm'
          />
          {search && (
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onSearchChange('')}
              className='absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground'
            >
              <X className='h-3.5 w-3.5' />
            </Button>
          )}
        </div>

        <div className='flex items-center gap-2'>
          <Select
            value={statusFilter}
            onValueChange={(val) =>
              onStatusFilterChange(val as 'all' | 'active' | 'inactive')
            }
          >
            <SelectTrigger className='w-[140px] h-9 text-xs'>
              <div className='flex items-center gap-1.5'>
                <Filter className='h-3.5 w-3.5 text-muted-foreground' />
                <SelectValue placeholder='Estado' />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all' className='text-xs'>
                Todos
              </SelectItem>
              <SelectItem value='active' className='text-xs'>
                Solo Activos
              </SelectItem>
              <SelectItem value='inactive' className='text-xs'>
                Solo Inactivos
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Actions */}
      <div className='flex items-center gap-2 justify-end'>
        <Button
          variant='outline'
          size='sm'
          onClick={onRefresh}
          disabled={isRefreshing}
          className='h-9 text-xs'
        >
          <RotateCw
            className={`mr-2 h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          Recargar
        </Button>
      </div>
    </div>
  );
}
