import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Task as TaskType, TaskStatus } from '../../types/task';
import axiosInstance from '../../utils/axios';
import { FaEdit, FaTrash, FaArrowUp } from 'react-icons/fa';

interface TaskProps {
  task: TaskType;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string) => void;
}

const Task: React.FC<TaskProps> = ({ task, onDelete, onUpdateStatus }) => {
  const navigate = useNavigate();

  const getNextStatus = (currentStatus: TaskStatus): TaskStatus | null => {
    switch (currentStatus) {
      case TaskStatus.PENDING:
        return TaskStatus.IN_PROGRESS;
      case TaskStatus.IN_PROGRESS:
        return TaskStatus.COMPLETED;
      case TaskStatus.COMPLETED:
        return null;
      default:
        return null;
    }
  };

  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.PENDING:
        return 'bg-amber-900/30 text-amber-300 border-amber-800';
      case TaskStatus.IN_PROGRESS:
        return 'bg-orange-900/30 text-orange-300 border-orange-800';
      case TaskStatus.COMPLETED:
        return 'bg-green-900/30 text-green-300 border-green-800';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  const handleEdit = () => {
    navigate(`/task/edit/${task.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axiosInstance.delete(`/tasks/${task.id}`);
        onDelete(task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleUpdateStatus = async () => {
    const nextStatus = getNextStatus(task.status);
    if (nextStatus) {
      try {
        await axiosInstance.patch(`/tasks/${task.id}`, { status: nextStatus });
        onUpdateStatus(task.id);
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }
  };

  return (
    <div className="border border-gray-700 rounded-lg shadow-lg mb-4 overflow-hidden bg-gray-800 hover:shadow-xl transition duration-300">
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-white">{task.title}</h3>
        </div>
        <div className="flex items-center space-x-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {task.status.replace('_', ' ').toUpperCase()}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={handleUpdateStatus}
              disabled={task.status === TaskStatus.COMPLETED}
              className={`p-2 rounded-full hover:bg-gray-700 ${
                task.status === TaskStatus.COMPLETED ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title={task.status === TaskStatus.COMPLETED ? 'Task already completed' : 'Update status'}
            >
              <FaArrowUp className="text-orange-400" />
            </button>
            <button
              onClick={handleEdit}
              className="p-2 rounded-full hover:bg-gray-700"
              title="Edit task"
            >
              <FaEdit className="text-orange-400" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-full hover:bg-gray-700"
              title="Delete task"
            >
              <FaTrash className="text-orange-400" />
            </button>
          </div>
        </div>
      </div>
      {task.description && (
        <div className="p-4 bg-gray-900/50">
          <p className="text-gray-300">{task.description}</p>
        </div>
      )}
    </div>
  );
};

export default Task;