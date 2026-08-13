'use client';
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  resetForm: () => void;
  setFieldValue: (field: keyof T, value: string) => void;
}

export function useForm<T extends object>({
  initialValues,
  onSubmit,
  validate,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof T]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const setFieldValue = (field: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      resetForm();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
  };
}
