'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Filter, Search } from 'lucide-react';
import { AnalyticsQuery } from '@/services/analytics';

interface FilterPanelProps {
  onApplyFilters: (filters: AnalyticsQuery) => void;
  onClearFilters: () => void;
  neighborhoods: any[];
  requirements: any[];
  loading?: boolean;
}

export const FilterPanel = ({
  onApplyFilters,
  onClearFilters,
  neighborhoods,
  requirements,
  loading = false
}: FilterPanelProps) => {
  const [filters, setFilters] = useState<AnalyticsQuery>({});

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  const handleClearFilters = () => {
    setFilters({});
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key =>
      filters[key as keyof AnalyticsQuery] !== undefined &&
      filters[key as keyof AnalyticsQuery] !== null &&
      filters[key as keyof AnalyticsQuery] !== ''
    ).length;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros avanzados
          </CardTitle>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary">
              {getActiveFiltersCount()} filtros activos
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Demographics Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Demografía</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Age Filter */}
            <div className="space-y-2">
              <Label>Rango de edad</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Edad mínima"
                  value={filters.ageFilter?.minAge || ''}
                  onChange={(e) => handleFilterChange('ageFilter', {
                    ...filters.ageFilter,
                    minAge: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                />
                <Input
                  type="number"
                  placeholder="Edad máxima"
                  value={filters.ageFilter?.maxAge || ''}
                  onChange={(e) => handleFilterChange('ageFilter', {
                    ...filters.ageFilter,
                    maxAge: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                />
              </div>
            </div>

            {/* Gender Filter */}
            <div className="space-y-2">
              <Label>Género</Label>
              <Select
                value={filters.gender?.toString() || ''}
                onValueChange={(value) => handleFilterChange('gender', value ? parseInt(value) : undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="1">Masculino</SelectItem>
                  <SelectItem value="2">Femenino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Neighborhood Filter */}
            <div className="space-y-2">
              <Label>Barrio</Label>
              <Select
                value={filters.membershipFilter?.neighborhoodId || ''}
                onValueChange={(value) => handleFilterChange('membershipFilter', {
                  ...filters.membershipFilter,
                  neighborhoodId: value || undefined
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona barrio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los barrios</SelectItem>
                  {(Array.isArray(neighborhoods) ? neighborhoods : []).map((neighborhood) => (
                    <SelectItem key={neighborhood.neighborhoodId} value={neighborhood.neighborhoodId}>
                      {neighborhood.neighborhoodName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Membership Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Membresía</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estado de membresía</Label>
              <Select
                value={filters.membershipFilter?.status || ''}
                onValueChange={(value) => handleFilterChange('membershipFilter', {
                  ...filters.membershipFilter,
                  status: value || undefined
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">No comuneros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Disability Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Discapacidad</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasDisability"
                  checked={filters.disabilityFilter?.hasDisability || false}
                  onCheckedChange={(checked) => handleFilterChange('disabilityFilter', {
                    ...filters.disabilityFilter,
                    hasDisability: checked as boolean
                  })}
                />
                <Label htmlFor="hasDisability">Tiene discapacidad</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rango de porcentaje</Label>
              <Select
                value={filters.disabilityFilter?.percentageRange || ''}
                onValueChange={(value) => handleFilterChange('disabilityFilter', {
                  ...filters.disabilityFilter,
                  percentageRange: value || undefined
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona rango" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los rangos</SelectItem>
                  <SelectItem value="low">Bajo (1-25%)</SelectItem>
                  <SelectItem value="medium">Medio (26-50%)</SelectItem>
                  <SelectItem value="high">Alto (51-75%)</SelectItem>
                  <SelectItem value="very_high">Muy alto (76-100%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Financial Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Financiero</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Estado de cuota</Label>
              <Select
                value={filters.financialFilter?.feeStatus || ''}
                onValueChange={(value) => handleFilterChange('financialFilter', {
                  ...filters.financialFilter,
                  feeStatus: value || undefined
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="PENDING">Pendiente</SelectItem>
                  <SelectItem value="PAID">Pagado</SelectItem>
                  <SelectItem value="PARTIAL">Parcial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Monto mínimo</Label>
              <Input
                type="number"
                placeholder="Monto mínimo"
                value={filters.financialFilter?.minAmountDue || ''}
                onChange={(e) => handleFilterChange('financialFilter', {
                  ...filters.financialFilter,
                  minAmountDue: e.target.value ? parseFloat(e.target.value) : undefined
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Año</Label>
              <Input
                type="number"
                placeholder="Año"
                value={filters.financialFilter?.year || ''}
                onChange={(e) => handleFilterChange('financialFilter', {
                  ...filters.financialFilter,
                  year: e.target.value ? parseInt(e.target.value) : undefined
                })}
              />
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Requisitos</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allApproved"
                checked={filters.requirementsFilter?.allApproved || false}
                onCheckedChange={(checked) => handleFilterChange('requirementsFilter', {
                  ...filters.requirementsFilter,
                  allApproved: checked as boolean
                })}
              />
              <Label htmlFor="allApproved">Todos los requisitos aprobados</Label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleApplyFilters}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Aplicar filtros
          </Button>
          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Limpiar todo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 