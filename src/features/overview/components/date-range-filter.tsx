'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { useQueryClient } from '@tanstack/react-query';

interface DateRangeFilterProps {
  onDateRangeChange: (dateRange: string | undefined) => void;
  className?: string;
}

export function DateRangeFilter({ onDateRangeChange, className }: DateRangeFilterProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [quickDays, setQuickDays] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Set default date range to current year
  useEffect(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);

    setDate({
      from: startOfYear,
      to: endOfYear
    });
    setQuickDays(null);

    // Set initial date range
    const dateRange = `${format(startOfYear, 'yyyy-MM-dd')},${format(endOfYear, 'yyyy-MM-dd')}`;
    onDateRangeChange(dateRange);
  }, [onDateRangeChange]);

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    setQuickDays(null);

    if (newDate?.from && newDate?.to) {
      const dateRange = `${format(newDate.from, 'yyyy-MM-dd')},${format(newDate.to, 'yyyy-MM-dd')}`;
      onDateRangeChange(dateRange);
      setIsOpen(false);
    } else {
      onDateRangeChange(undefined);
    }
  };

  const handleQuickFilter = (days: number) => {
    const now = new Date();
    const from = new Date(now);
    from.setDate(now.getDate() - days);

    setDate({
      from,
      to: now
    });
    setQuickDays(days);
    setIsOpen(false);

    const dateRange = `${format(from, 'yyyy-MM-dd')},${format(now, 'yyyy-MM-dd')}`;
    onDateRangeChange(dateRange);
  };

  const clearFilter = () => {
    setDate(undefined);
    setQuickDays(null);
    onDateRangeChange(undefined);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey?.[0];
          return typeof key === 'string' && key.startsWith('dashboard-');
        }
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filtrar por rango de fechas</span>
          </CardTitle>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-xs">{isRefreshing ? 'Actualizando...' : 'Actualizar'}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date?.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "dd MMM, y", { locale: es })} -{" "}
                      {format(date.to, "dd MMM, y", { locale: es })}
                    </>
                  ) : (
                    format(date.from, "dd MMM, y", { locale: es })
                  )
                ) : (
                  <span>Selecciona un rango de fechas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleDateChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={quickDays === 7 ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter(7)}
            className="text-xs"
          >
            Últimos 7 días
          </Button>
          <Button
            variant={quickDays === 30 ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter(30)}
            className="text-xs"
          >
            Últimos 30 días
          </Button>
          <Button
            variant={quickDays === 90 ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter(90)}
            className="text-xs"
          >
            Últimos 90 días
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilter}
            className="text-xs"
          >
            Limpiar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 
