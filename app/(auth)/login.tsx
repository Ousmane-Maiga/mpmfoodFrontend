import React from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, Checkbox } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { loginEmployee } from '../../services/api';

// Form validation schema
const LoginSchema = Yup.object().shape({
  employee_name: Yup.string().required('Name is required'),
  pin: Yup.string().required('Password is required'),
});

type LoginFormValues = {
  employee_name: string;
  pin: string;
};

export default function LoginScreen() {
  const router = useRouter();
  const [forgotPassword, setForgotPassword] = React.useState(false);

  const initialValues: LoginFormValues = {
    employee_name: '',
    pin: '',
  };

  const handleFormSubmit = async (
    values: LoginFormValues, 
    { setSubmitting, setErrors }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      setSubmitting(true);
      console.log('Attempting login with:', values);
      
      const response = await loginEmployee(values.employee_name, values.pin);
      console.log('Login response:', response);
  
      if (!response?.employee_role) {
        throw new Error('Invalid credentials');
      }
  
      router.replace({
        pathname: '/(tabs)',
        params: { employee_role: response.employee_role }
      });
    } catch (error: any) {
      console.error('Full error:', error);
      setSubmitting(false);
      
      const errorMessage = error?.response?.data?.message 
        || error.message 
        || 'Login failed. Please try again.';
      
      Alert.alert('Error', errorMessage);
      setErrors({ pin: 'Invalid credentials' });
    }
  };
   

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/mpmfood_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.welcomeText}>Welcome to MPMFOOD</Text>
      </View>

      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={handleFormSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              mode="outlined"
              value={values.employee_name}
              onChangeText={handleChange('employee_name')}
              onBlur={handleBlur('employee_name')}
              style={styles.input}
              error={touched.employee_name && !!errors.employee_name}
            />
            {touched.employee_name && errors.employee_name && (
              <Text style={styles.errorText}>{errors.employee_name}</Text>
            )}

            <Text style={styles.label}>Pin:</Text>
            <TextInput
              mode="outlined"
              secureTextEntry
              value={values.pin}
              onChangeText={handleChange('pin')}
              onBlur={handleBlur('pin')}
              style={styles.input}
              error={touched.pin && !!errors.pin}
            />
            {touched.pin && errors.pin && (
              <Text style={styles.errorText}>{errors.pin}</Text>
            )}

            <Button onPress={() => console.log('Forgot password pressed')} style={styles.forgotPasswordButton}>
              Forgot password
            </Button>

            <Button
              mode="contained"
              onPress={() => handleSubmit()} // Wrap in arrow function
              style={styles.connectButton}
              labelStyle={styles.connectButtonLabel}
            >
              Connect
            </Button>
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff', // Add a background color if needed
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
  },
  welcomeText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  forgotPasswordButton: {
    marginTop: 5,
    marginBottom: 20,
  },
  connectButton: {
    backgroundColor: '#f7c40d',
    paddingVertical: 10,
    borderRadius: 5,
  },
  connectButtonLabel: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});