import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  Save, 
  Trash2, 
  Plus, 
  Edit3,
  Copy,
  FileText,
  Mail,
  Calendar,
  Download
} from 'lucide-react';
import { useAI } from '../contexts/AIContext';
import { useBrowser } from '../contexts/BrowserContext';
import './TaskAutomation.css';

const TaskAutomation = ({ onClose }) => {
  const { sendMessage } = useAI();
  const { activeTab, tabs, updateTab } = useBrowser();
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: 'Fill Contact Form',
      description: 'Automatically fill contact forms with saved information',
      category: 'forms',
      steps: [
        'Find form fields on the page',
        'Fill name, email, and message fields',
        'Submit the form'
      ],
      isRunning: false
    },
    {
      id: 2,
      name: 'Extract Article Text',
      description: 'Extract main article content from news websites',
      category: 'extraction',
      steps: [
        'Identify main content area',
        'Extract article title and body',
        'Save to clipboard or file'
      ],
      isRunning: false
    },
    {
      id: 3,
      name: 'Schedule Meeting',
      description: 'Create calendar events from email invitations',
      category: 'calendar',
      steps: [
        'Parse email for date and time',
        'Extract meeting details',
        'Create calendar event'
      ],
      isRunning: false
    }
  ]);
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    category: 'forms',
    steps: ['']
  });

  const currentTab = tabs.find(tab => tab.id === activeTab);

  const handleRunTask = async (task) => {
    setTasks(prev => prev.map(t => 
      t.id === task.id ? { ...t, isRunning: true } : t
    ));

    try {
      let message = '';
      switch (task.category) {
        case 'forms':
          message = `Please help me fill out the form on this page. Use the following information:
          Name: John Doe
          Email: john.doe@example.com
          Phone: (555) 123-4567
          Message: I'm interested in learning more about your services.
          
          Please identify the form fields and provide instructions on how to fill them.`;
          break;
        case 'extraction':
          message = `Please extract the main article content from this page, including:
          - Article title
          - Main body text
          - Author (if available)
          - Publication date (if available)
          
          Format the extracted content in a clean, readable format.`;
          break;
        case 'calendar':
          message = `Please help me create a calendar event from the information on this page. Look for:
          - Event title/subject
          - Date and time
          - Location (if mentioned)
          - Description or agenda
          
          Provide the event details in a structured format.`;
          break;
        default:
          message = `Please help me automate the task: ${task.name}. ${task.description}`;
      }

      const context = currentTab ? `Current page: ${currentTab.title} (${currentTab.url})` : '';
      await sendMessage(message, context);
      
    } catch (error) {
      console.error('Error running task:', error);
    } finally {
      setTasks(prev => prev.map(t => 
        t.id === task.id ? { ...t, isRunning: false } : t
      ));
    }
  };

  const handleStopTask = (taskId) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, isRunning: false } : t
    ));
  };

  const handleCreateTask = () => {
    if (!newTask.name.trim()) return;
    
    const task = {
      id: Date.now(),
      ...newTask,
      steps: newTask.steps.filter(step => step.trim()),
      isRunning: false
    };
    
    setTasks(prev => [...prev, task]);
    setNewTask({
      name: '',
      description: '',
      category: 'forms',
      steps: ['']
    });
    setIsCreatingTask(false);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  const handleDuplicateTask = (task) => {
    const duplicatedTask = {
      ...task,
      id: Date.now(),
      name: `${task.name} (Copy)`,
      isRunning: false
    };
    setTasks(prev => [...prev, duplicatedTask]);
  };

  const addStep = () => {
    setNewTask(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  };

  const updateStep = (index, value) => {
    setNewTask(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }));
  };

  const removeStep = (index) => {
    setNewTask(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'forms': return <FileText size={16} />;
      case 'extraction': return <Download size={16} />;
      case 'calendar': return <Calendar size={16} />;
      case 'email': return <Mail size={16} />;
      default: return <Play size={16} />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'forms': return '#28a745';
      case 'extraction': return '#17a2b8';
      case 'calendar': return '#ffc107';
      case 'email': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="task-automation">
      <div className="automation-header">
        <h2>Task Automation</h2>
        <div className="header-actions">
          <button 
            className="create-task-btn"
            onClick={() => setIsCreatingTask(true)}
          >
            <Plus size={16} />
            New Task
          </button>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
      </div>

      <div className="automation-content">
        {isCreatingTask && (
          <div className="task-creator">
            <h3>Create New Task</h3>
            <div className="creator-form">
              <input
                type="text"
                placeholder="Task name"
                value={newTask.name}
                onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                className="task-input"
              />
              
              <textarea
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                className="task-textarea"
                rows={3}
              />
              
              <select
                value={newTask.category}
                onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                className="task-select"
              >
                <option value="forms">Form Filling</option>
                <option value="extraction">Content Extraction</option>
                <option value="calendar">Calendar Events</option>
                <option value="email">Email Processing</option>
                <option value="other">Other</option>
              </select>
              
              <div className="steps-section">
                <h4>Task Steps</h4>
                {newTask.steps.map((step, index) => (
                  <div key={index} className="step-input-group">
                    <input
                      type="text"
                      placeholder={`Step ${index + 1}`}
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      className="step-input"
                    />
                    {newTask.steps.length > 1 && (
                      <button
                        onClick={() => removeStep(index)}
                        className="remove-step-btn"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={addStep} className="add-step-btn">
                  <Plus size={14} />
                  Add Step
                </button>
              </div>
              
              <div className="creator-actions">
                <button onClick={handleCreateTask} className="save-task-btn">
                  <Save size={16} />
                  Save Task
                </button>
                <button 
                  onClick={() => setIsCreatingTask(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="tasks-grid">
          {tasks.map(task => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <div className="task-info">
                  <div 
                    className="task-category"
                    style={{ backgroundColor: getCategoryColor(task.category) }}
                  >
                    {getCategoryIcon(task.category)}
                  </div>
                  <div>
                    <h3>{task.name}</h3>
                    <p>{task.description}</p>
                  </div>
                </div>
                <div className="task-actions">
                  <button
                    onClick={() => handleDuplicateTask(task)}
                    className="task-action-btn"
                    title="Duplicate task"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={() => setSelectedTask(task)}
                    className="task-action-btn"
                    title="Edit task"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="task-action-btn danger"
                    title="Delete task"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <div className="task-steps">
                <h4>Steps:</h4>
                <ol>
                  {task.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
              
              <div className="task-controls">
                {task.isRunning ? (
                  <button
                    onClick={() => handleStopTask(task.id)}
                    className="stop-btn"
                  >
                    <Square size={16} />
                    Stop Task
                  </button>
                ) : (
                  <button
                    onClick={() => handleRunTask(task)}
                    className="run-btn"
                    disabled={!currentTab}
                  >
                    <Play size={16} />
                    Run Task
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && !isCreatingTask && (
          <div className="empty-state">
            <Play size={48} />
            <h3>No automation tasks</h3>
            <p>Create your first task to automate repetitive browser actions</p>
            <button 
              className="create-first-task-btn"
              onClick={() => setIsCreatingTask(true)}
            >
              <Plus size={16} />
              Create Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskAutomation;