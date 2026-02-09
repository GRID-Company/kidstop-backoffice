'use client';

import React, { useMemo, useState } from 'react';
import {
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Select,
  SelectItem,
  Tooltip,
} from '@heroui/react';
import { motion } from 'framer-motion';
import { TASK_PRIORITY_LABELS } from '@/features/clickup/domain/constants';
import { ClickUpTask } from '@/features/clickup/domain/types';

interface TasksTableProps {
  tasks: ClickUpTask[];
  listProgress?: Array<{ name: string }>;
}

const PAGE_SIZE = 10;

const getPriorityColor = (priority: number): 'danger' | 'warning' | 'success' | 'primary' => {
  switch (priority) {
    case 1: return 'danger';
    case 2: return 'warning';
    case 4: return 'success';
    default: return 'primary';
  }
};

const getStatusColor = (status: string): 'success' | 'warning' | 'default' | 'primary' => {
  switch (status) {
    case 'done':
    case 'complete': return 'success';
    case 'in progress':
    case 'inprogress': return 'warning';
    case 'todo': return 'primary';
    default: return 'default';
  }
};

export const TasksTable: React.FC<TasksTableProps> = ({ tasks, listProgress }) => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [listFilter, setListFilter] = useState<string>('all');

  const statuses = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach(t => { if (t.status) set.add(t.status); });
    return Array.from(set).sort();
  }, [tasks]);

  const listNames = useMemo(() => {
    if (listProgress) return listProgress.map(l => l.name);
    return [];
  }, [listProgress]);

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter);
    }
    if (listFilter !== 'all') {
      result = result.filter(t =>
        t.name.toLowerCase().includes(listFilter.toLowerCase()) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(listFilter.toLowerCase())))
      );
    }
    return result;
  }, [tasks, statusFilter, listFilter]);

  const totalPages = Math.ceil(filteredTasks.length / PAGE_SIZE);
  const paginatedTasks = filteredTasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleStatusChange = (keys: any) => {
    const value = typeof keys === 'string' ? keys : keys.currentKey || 'all';
    setStatusFilter(value);
    setPage(1);
  };

  const handleListChange = (keys: any) => {
    const value = typeof keys === 'string' ? keys : keys.currentKey || 'all';
    setListFilter(value);
    setPage(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
    >
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <Tooltip content="Lista completa de todas las tareas del proyecto. Usa los filtros para buscar por estado o lista. Muestra 10 tareas por página." placement="top" delay={300}>
              <h3 className="text-lg font-semibold cursor-help">Tareas ({filteredTasks.length})</h3>
            </Tooltip>
            <div className="flex gap-3">
              <Select
                label="Estado"
                size="sm"
                className="w-40"
                selectedKeys={new Set([statusFilter])}
                onSelectionChange={handleStatusChange}
              >
                {[
                  <SelectItem key="all">Todos</SelectItem>,
                  ...statuses.map(s => (
                    <SelectItem key={s}>{s}</SelectItem>
                  )),
                ]}
              </Select>
              {listNames.length > 0 && (
                <Select
                  label="Lista"
                  size="sm"
                  className="w-44"
                  selectedKeys={new Set([listFilter])}
                  onSelectionChange={handleListChange}
                >
                  {[
                    <SelectItem key="all">Todas</SelectItem>,
                    ...listNames.map(name => (
                      <SelectItem key={name}>{name}</SelectItem>
                    )),
                  ]}
                </Select>
              )}
            </div>
          </div>

          <Table
            aria-label="Tasks table"
            removeWrapper
            isStriped
          >
            <TableHeader>
              <TableColumn>Nombre</TableColumn>
              <TableColumn>Estado</TableColumn>
              <TableColumn>Prioridad</TableColumn>
              <TableColumn>Asignados</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No hay tareas con estos filtros">
              {paginatedTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <span className="font-medium text-sm">{task.name}</span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      color={getStatusColor(task.status || '')}
                      variant="flat"
                    >
                      {task.status || 'Sin estado'}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {task.priority && (
                      <Chip
                        size="sm"
                        color={getPriorityColor(task.priority)}
                        variant="flat"
                      >
                        {TASK_PRIORITY_LABELS[task.priority as keyof typeof TASK_PRIORITY_LABELS] || 'Unknown'}
                      </Chip>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {task.assignees?.length || 0}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                total={totalPages}
                page={page}
                onChange={setPage}
                showControls
                size="sm"
              />
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
};
