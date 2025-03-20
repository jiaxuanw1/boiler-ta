import React from 'react';
import { Question } from '../types';

interface EditQuestionFormProps {
  show: boolean;
  question: Question;
  onUpdate: (updatedQuestion: Question) => void;
  onDelete: (questionId: number) => void;
}

const EditQuestionForm = ({ show, question, onUpdate, onDelete }: EditQuestionFormProps) => {
  return (
    <div>{question.id}</div>
  );
}

export default EditQuestionForm;