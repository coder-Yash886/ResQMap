import { RESOURCE_TYPES } from './constants';

export const validateResource = ({ title, type, quantity, location }) => {
  const errors = {};
  
  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.title = 'Title is required';
  }
  
  if (!RESOURCE_TYPES.includes(type)) {
    errors.type = `Type must be one of: ${RESOURCE_TYPES.join(', ')}`;
  }
  
  const parsedQuantity = Number(quantity);
  if (!quantity || isNaN(parsedQuantity) || parsedQuantity <= 0) {
    errors.quantity = 'Quantity must be a number greater than 0';
  }
  
  if (!location || typeof location !== 'string' || location.trim() === '') {
    errors.location = 'Location is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
