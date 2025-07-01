'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook para gerenciar estados e validações de formulários
 * @param {Object} config - Configuração do formulário
 * @param {Object} config.initialValues - Valores iniciais para os campos do formulário
 * @param {Function} config.onSubmit - Função a ser executada na submissão válida
 * @param {Object} config.validationSchema - Schema de validação dos campos
 * @param {boolean} config.validateOnChange - Se deve validar a cada mudança
 * @param {boolean} config.validateOnBlur - Se deve validar ao perder o foco
 * @param {boolean} config.validateOnSubmit - Se deve validar ao submeter
 * @returns {Object} - Objeto com métodos e estados do formulário
 */
export function useForm({
  initialValues = {},
  onSubmit = () => {},
  validationSchema = {},
  validateOnChange = false,
  validateOnBlur = true,
  validateOnSubmit = true
} = {}) {
  // Estados para os valores do formulário, erros e status
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  
  // Referência para monitorar se o formulário foi submetido
  const hasSubmitted = useRef(false);

  // Função para validar um único campo
  const validateField = useCallback((name, value) => {
    if (!validationSchema[name]) return '';
    
    try {
      const fieldValidator = validationSchema[name];
      const errorMsg = fieldValidator(value, values);
      return errorMsg || '';
    } catch (error) {
      console.error(`Erro ao validar campo ${name}:`, error);
      return 'Erro de validação';
    }
  }, [validationSchema, values]);

  // Função para validar todos os campos do formulário
  const validateForm = useCallback(() => {
    const newErrors = {};
    let formIsValid = true;
    
    // Validar cada campo com schema
    Object.keys(values).forEach(key => {
      if (validationSchema[key]) {
        const errorMsg = validateField(key, values[key]);
        if (errorMsg) {
          newErrors[key] = errorMsg;
          formIsValid = false;
        }
      }
    });
    
    setErrors(newErrors);
    setIsValid(formIsValid);
    return formIsValid;
  }, [values, validationSchema, validateField]);

  // Efeito para validar o formulário quando os valores mudam
  useEffect(() => {
    if ((validateOnChange && Object.keys(touched).length > 0) || hasSubmitted.current) {
      validateForm();
    }
  }, [values, validateOnChange, validateForm]);

  // Função para lidar com mudanças nos campos
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({
      ...prev,
      [name]: fieldValue
    }));
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    if (validateOnChange) {
      const errorMsg = validateField(name, fieldValue);
      setErrors(prev => ({
        ...prev,
        [name]: errorMsg
      }));
      
      // Atualizar isValid baseado em todos os erros
      const newErrors = { ...errors, [name]: errorMsg };
      setIsValid(!Object.values(newErrors).some(error => error));
    }
  }, [validateOnChange, validateField, errors]);

  // Função para lidar com perda de foco
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    if (validateOnBlur) {
      const errorMsg = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: errorMsg
      }));
      
      // Atualizar isValid
      validateForm();
    }
  }, [validateOnBlur, validateField, validateForm]);

  // Função para lidar com a submissão do formulário
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    hasSubmitted.current = true;
    setIsSubmitting(true);
    
    let isFormValid = true;
    if (validateOnSubmit) {
      isFormValid = validateForm();
    }
    
    if (isFormValid) {
      try {
        await onSubmit(values, {
          setFieldValue,
          resetForm,
          setErrors
        });
      } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        setErrors(prev => ({
          ...prev,
          form: error.message || 'Erro ao processar formulário'
        }));
      }
    }
    
    setIsSubmitting(false);
  }, [values, validateOnSubmit, validateForm, onSubmit]);

  // Função para definir manualmente o valor de um campo
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validateOnChange) {
      const errorMsg = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: errorMsg
      }));
    }
  }, [validateOnChange, validateField]);

  // Função para definir manualmente um erro
  const setFieldError = useCallback((name, errorMsg) => {
    setErrors(prev => ({
      ...prev,
      [name]: errorMsg
    }));
    
    setIsValid(false);
  }, []);

  // Função para marcar um campo como tocado
  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [name]: isTouched
    }));
  }, []);

  // Função para resetar o formulário
  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    hasSubmitted.current = false;
  }, [initialValues]);

  // Retornar os valores, funções e estados necessários
  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    validateForm
  };
}

export default useForm;
