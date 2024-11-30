import React from 'react';
import MessageValidator from '../MessageValidator/MessageValidator';

const ISO20022Validator = () => {
  return <MessageValidator messageType="iso20022" />;
};

export default ISO20022Validator;