// components/ui/DataTable.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, DimensionValue } from 'react-native';
import { theme } from '../../constants/theme';

export interface Column<T> {
  key: keyof T;
  title: string;
  numeric?: boolean;
  width?: DimensionValue;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  keyExtractor: (item: T) => string;
  onRowPress?: (item: T) => void;
  loading?: boolean;
}

export function DataTable<T extends object>({
  data,
  columns,
  pageSize = 10,
  keyExtractor,
  onRowPress,
  loading = false,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'ascending' | 'descending';
  } | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // Handle null/undefined values for comparison
      if (aValue === null || aValue === undefined) return sortConfig.direction === 'ascending' ? 1 : -1;
      if (bValue === null || bValue === undefined) return sortConfig.direction === 'ascending' ? -1 : 1;

      // Basic comparison for string/number. Extend for Date objects if needed.
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === 'ascending' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
      }

      // Fallback for other types or mixed types (less precise)
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const requestSort = (key: keyof T) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {columns.map((column) => (
          <TouchableOpacity
            key={column.key.toString()} // This is fine for header cells, as column keys are unique
            style={[
              styles.headerCell,
              { width: column.width || 'auto' },
              column.sortable && styles.sortableHeader
            ]}
            onPress={() => column.sortable && requestSort(column.key)}
            disabled={!column.sortable}
          >
            <Text style={styles.headerText}>
            {column.title}
            {sortConfig?.key === column.key && (
              sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'
            )}
          </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {paginatedData.length > 0 ? (
        paginatedData.map((item) => (
          <TouchableOpacity
            key={keyExtractor(item)} // This is the unique key for the row
            style={styles.row}
            onPress={() => onRowPress?.(item)}
            activeOpacity={0.7}
          >
            {columns.map((column) => (
              <View 
                // FIX: Combine row key with column key for unique cell key
                key={`${keyExtractor(item)}-${column.key.toString()}`} 
                style={[styles.cell, { width: column.width || 'auto' }]}
              >
                {column.render 
                  ? column.render(item[column.key], item)
                  : (
                    <Text 
                      style={[
                        styles.cellText,
                        column.numeric && styles.numericCell
                      ]}
                      numberOfLines={1}
                    >
                      {String(item[column.key] ?? '')} 
                    </Text>
                  )
                }
              </View>
            ))}
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No data available</Text>
        </View>
      )}
      
      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
          >
            <Text style={styles.paginationText}>Previous</Text>
          </TouchableOpacity>
          
          <Text style={styles.paginationInfo}>
            Page {currentPage} of {totalPages}
          </Text>
          
          <TouchableOpacity
            onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
          >
            <Text style={styles.paginationText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.roundness,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: theme.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: theme.spacing.sm,
  },
  headerCell: {
    paddingHorizontal: theme.spacing.sm,
    justifyContent: 'center',
  },
  sortableHeader: {
    // backgroundColor: theme.colors.primaryLight, // Optional: highlight sortable headers
  },
  headerText: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.cardBackground,
  },
  cell: {
    paddingHorizontal: theme.spacing.sm,
    justifyContent: 'center',
  },
  cellText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
  },
  numericCell: {
    textAlign: 'right',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  paginationButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.primary,
    minWidth: 80,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: theme.colors.border,
  },
  paginationText: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  paginationInfo: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
  },
  loadingContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyState: {
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.cardBackground,
    flex: 1,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.md,
  },
});
