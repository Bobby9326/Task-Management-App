import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../../utils/axios';

const TaskCreateBox: React.FC = () => {
  const navigate = useNavigate();

  const initialValues = {
    title: '',
    description: '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string(),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await axiosInstance.post('/tasks', values);
      navigate('/');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-white">Create New Task</h2>
      
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
                placeholder="Enter task title"
              />
              <ErrorMessage name="title" component="div" className="text-orange-400 mt-1" />
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
                placeholder="Enter task description (optional)"
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
                {isSubmitting ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TaskCreateBox;