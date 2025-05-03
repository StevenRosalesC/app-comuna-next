// Pagination for comuneros table
// Comments in English as requested

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MembersTablePaginationProps {
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  isLoading: boolean;
  onPageIndexChange: (index: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function MembersTablePagination({
  pageIndex,
  pageCount,
  pageSize,
  isLoading,
  onPageIndexChange,
  onPageSizeChange,
}: MembersTablePaginationProps) {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 lg:space-x-8 w-full justify-between items-center mt-4">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium whitespace-nowrap">Registros por página</p>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[5, 10, 20, 30, 40, 50].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="hidden sm:flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageIndexChange(0)}
            disabled={pageIndex === 0 || isLoading}
            className="px-2"
          >
            {"<<"}
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageIndexChange(pageIndex - 1)}
          disabled={pageIndex === 0 || isLoading}
        >
          Anterior
        </Button>
        <div className="flex items-center justify-center text-sm min-w-[100px]">
          <span className="hidden sm:inline">Página </span>
          {pageIndex + 1} de {pageCount}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageIndexChange(pageIndex + 1)}
          disabled={pageIndex >= pageCount - 1 || isLoading}
        >
          Siguiente
        </Button>
        <div className="hidden sm:flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageIndexChange(pageCount - 1)}
            disabled={pageIndex >= pageCount - 1 || isLoading}
            className="px-2"
          >
            {">>"}
          </Button>
        </div>
      </div>
    </div>
  );
} 