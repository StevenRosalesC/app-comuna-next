'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronUp, ChevronDown, Eye } from 'lucide-react';
import { ExportButton } from './export-button';

interface DataTableProps {
  data: any[];
  loading: boolean;
  error: string | null;
  onSort: (field: string) => void;
  onSearch: (search: string) => void;
  onViewDetails: (personId: string) => void;
  onExport: () => void;
  currentSort: {
    field: string;
    order: 'asc' | 'desc';
  };
  searchTerm: string;
  analyticsFilters?: any; // Advanced filters object
  viewMode?: 'initial' | 'filtered'; // View mode
}

export const DataTable = ({
  data,
  loading,
  error,
  onSort,
  onSearch,
  onViewDetails,
  onExport,
  currentSort,
  searchTerm,
  analyticsFilters,
  viewMode
}: DataTableProps) => {
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  const getSortIcon = (field: string) => {
    if (currentSort.field !== field) return null;
    return currentSort.order === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const getMembershipStatus = (person: any) => {
    if (person.members && person.members.length > 0) {
      const activeMember = person.members.find((member: any) => member.status);
      return activeMember ? (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Comunero Activo
        </Badge>
      ) : (
        <Badge variant="secondary">Comunero Inactivo</Badge>
      );
    }
    return <Badge variant="outline">No Comunero</Badge>;
  };

  const getDisabilityStatus = (person: any) => {
    if (person.hasDisability) {
      let color = 'bg-blue-100 text-blue-800';
      if (person.disabilityPercentage >= 75) {
        color = 'bg-red-100 text-red-800';
      } else if (person.disabilityPercentage >= 50) {
        color = 'bg-orange-100 text-orange-800';
      } else if (person.disabilityPercentage >= 25) {
        color = 'bg-yellow-100 text-yellow-800';
      }

      return (
        <Badge variant="default" className={color}>
          {person.disabilityPercentage}%
        </Badge>
      );
    }
    return <Badge variant="outline">Ninguno</Badge>;
  };

  const handleViewDetails = (person: any) => {
    if (person.members && person.members.length > 0) {
      window.open(`/dashboard/members/${person.members[0].memberId}`, '_blank');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-muted-foreground">Cargando datos...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <p className="text-red-600 mb-2">Error al cargar los datos</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Resultados ({data.length} registros)</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Buscar por nombre, cédula o correo..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="w-64"
            />
            <ExportButton
              tableType="persons"
              title="Reporte de Datos"
              variant="outline"
              size="sm"
              searchTerm={searchTerm}
              analyticsFilters={analyticsFilters}
              viewMode={viewMode}
            >
              Exportar
            </ExportButton>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No se encontraron datos</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onSort('lastName')}
                  >
                    <div className="flex items-center gap-1">
                      Apellido
                      {getSortIcon('lastName')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onSort('firstName')}
                  >
                    <div className="flex items-center gap-1">
                      Nombre
                      {getSortIcon('firstName')}
                    </div>
                  </TableHead>
                  <TableHead>Cédula</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Género</TableHead>
                  <TableHead>Barrio</TableHead>
                  <TableHead>Membresía</TableHead>
                  <TableHead>Discapacidad</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((person) => (
                  <TableRow key={person.personId}>
                    <TableCell className="font-medium">{person.lastName}</TableCell>
                    <TableCell>{person.firstName}</TableCell>
                    <TableCell>{person.identification}</TableCell>
                    <TableCell>{calculateAge(person.birthDate)}</TableCell>
                    <TableCell>{person.gender === 1 ? 'Masculino' : 'Femenino'}</TableCell>
                    <TableCell>{person.neighborhood?.neighborhoodName || 'N/A'}</TableCell>
                    <TableCell>{getMembershipStatus(person)}</TableCell>
                    <TableCell>{getDisabilityStatus(person)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(person)}
                        disabled={!person.members || person.members.length === 0}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 