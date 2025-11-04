import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AgendaContext = createContext();

/**
 * Custom hook to use the Agenda context
 * @returns {Object} Agenda context value
 */
export const useAgenda = () => {
  const context = useContext(AgendaContext);
  if (!context) {
    throw new Error('useAgenda must be used within an AgendaProvider');
  }
  return context;
};

/**
 * AgendaProvider component to manage user's saved events
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AgendaProvider = ({ children }) => {
  const STORAGE_KEY = 'xops-mi-agenda';
  
  // Load agenda from localStorage on mount
  const [agenda, setAgenda] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading agenda from localStorage:', error);
      return [];
    }
  });

  // Save agenda to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(agenda));
    } catch (error) {
      console.error('Error saving agenda to localStorage:', error);
    }
  }, [agenda]);

  /**
   * Generates a unique key for an event
   * @param {Object} event - Event object
   * @returns {string} Unique key
   */
  const getEventKey = (event) => {
    return `${event.timeISO}-${event.talk}`;
  };

  /**
   * Checks if an event is in the agenda
   * @param {Object} event - Event object
   * @returns {boolean} True if event is in agenda
   */
  const isInAgenda = (event) => {
    const key = getEventKey(event);
    return agenda.some(e => getEventKey(e) === key);
  };

  /**
   * Adds an event to the agenda
   * @param {Object} event - Event object
   */
  const addToAgenda = (event) => {
    if (!isInAgenda(event)) {
      setAgenda(prev => [...prev, event]);
    }
  };

  /**
   * Removes an event from the agenda
   * @param {Object} event - Event object
   */
  const removeFromAgenda = (event) => {
    const key = getEventKey(event);
    setAgenda(prev => prev.filter(e => getEventKey(e) !== key));
  };

  /**
   * Toggles an event in the agenda
   * @param {Object} event - Event object
   */
  const toggleAgenda = (event) => {
    if (isInAgenda(event)) {
      removeFromAgenda(event);
    } else {
      addToAgenda(event);
    }
  };

  /**
   * Clears all events from the agenda
   */
  const clearAgenda = () => {
    setAgenda([]);
  };

  /**
   * Gets the count of events in the agenda
   * @returns {number} Number of events
   */
  const getAgendaCount = () => {
    return agenda.length;
  };

  const value = {
    agenda,
    addToAgenda,
    removeFromAgenda,
    toggleAgenda,
    isInAgenda,
    clearAgenda,
    getAgendaCount
  };

  return (
    <AgendaContext.Provider value={value}>
      {children}
    </AgendaContext.Provider>
  );
};

AgendaProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AgendaContext;
