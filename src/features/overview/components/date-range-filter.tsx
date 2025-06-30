'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

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

  // Set default date range to current year
  useEffect(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);

    setDate({
      from: startOfYear,
      to: endOfYear
    });

    // Set initial date range
    const dateRange = `${format(startOfYear, 'yyyy-MM-dd')},${format(endOfYear, 'yyyy-MM-dd')}`;
    onDateRangeChange(dateRange);
  }, [onDateRangeChange]);

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);

    if (newDate?.from && newDate?.to) {
      const dateRange = `${format(newDate.from, 'yyyy-MM-dd')},${format(newDate.to, 'yyyy-MM-dd')}`;
      onDateRangeChange(dateRange);
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

    const dateRange = `${format(from, 'yyyy-MM-dd')},${format(now, 'yyyy-MM-dd')}`;
    onDateRangeChange(dateRange);
  };

  const clearFilter = () => {
    setDate(undefined);
    onDateRangeChange(undefined);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Filtrar por rango de fechas</span>
        </CardTitle>
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
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Selecciona un rango de fechas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
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
            variant="outline"
            size="sm"
            onClick={() => handleQuickFilter(7)}
            className="text-xs"
          >
            Últimos 7 días
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickFilter(30)}
            className="text-xs"
          >
            Últimos 30 días
          </Button>
          <Button
            variant="outline"
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