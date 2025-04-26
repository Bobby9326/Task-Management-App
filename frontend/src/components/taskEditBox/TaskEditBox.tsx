import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../../utils/axios';
import { Task, TaskStatus } from '../../types/task';

const TaskEditBox: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axiosInstance.get(`/tasks/${id}`);
        setTask(response.data.data);
      } catch (error) {
        console.error('Error fetching task:', error);
        setError('Failed to load task details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <div className="text-orange-400 text-center">
          {error || 'Task not found'}
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const initialValues = {
    title: task.title,
    description: task.description || '',
    status: task.status,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string(),
    status: Yup.string().oneOf(Object.values(TaskStatus), 'Invalid status'),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await axiosInstance.patch(`/tasks/${id}`, values);
      navigate('/');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-white">Edit Task</h2>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-300 font-medium mb-2">
                Title <span className="text-orange-500">*</span>
              </label>
              <Field
                type="text"
                id="title"
                name="title"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              />
              <ErrorMessage name="title" component="div" className="text-orange-400 mt-1" />
            </div>
            
            <div className="mb-4">
              <label htmlFor="status" className="block text-gray-300 font-medium mb-2">
                Status
              </label>
              <Field
                as="select"
                id="status"
                name="status"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              >
                <option value={TaskStatus.PENDING}>Pending</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.COMPLETED}>Completed</option>
              </Field>
              <ErrorMessage name="status" component="div" className="text-orange-400 mt-1" />
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-300 font-medium mb-2">
                Description
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              />
              <ErrorMessage name="description" component="div" className="text-orange-400 mt-1" />
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition duration-300"
              >
                {isSubmitting ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TaskEditBox;