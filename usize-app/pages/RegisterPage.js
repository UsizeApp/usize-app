import React from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native'
import Layout from '../components/Layout'
import { Formik } from 'formik'
import * as yup from 'yup'

export default class RegisterPage extends React.Component {
  static navigationOptions = {
    title: 'Registro',
    headerStyle: {
      backgroundColor: '#66CBFF',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: 'white',
  }

  // Constructor y variables de la clase
  constructor() {
    super();
    this.state = {
      status: 0,
    }
  }

  async registroAPI(email, pwd) {
    const URL = 'http://10.0.0.22:5000/register'

    const formData = new FormData()
    formData.append('email', email);
    formData.append('pwd', pwd);
    formData.append('source', 'app');

    const response = await fetch(URL, {
      credentials: 'same-origin',
      method: 'POST',
      body: formData,
    });

    try {
      const json = await response.json();
      console.log(json)
    }
    catch (e) {
      console.log(e)
    }

    // Cuando se obtengan las respuestas, seteamos las variables de la clase
    this.setState({ status: 1 });
  }

  render() {
    return (
      <React.Fragment>
        <Layout>
          {this.renderForm()}
        </Layout>
      </React.Fragment>
    )
  }

  renderForm = () => {
    return (
      <Formik
        initialValues={{ email: 'test@test.co', password: 'testtest', confirmPassword: 'testtest' }}
        onSubmit={values => {
          //Alert.alert(JSON.stringify(values))
          this.registroAPI().done(() => {
            if (this.state.status == 1)
              this.props.navigation.navigate('Perfil')
          });
        }}
        validationSchema={yup.object().shape({
          email: yup
            .string()
            .email(),
          //.required('Ingrese un Correo'),
          password: yup
            .string(),
          //.min(6, 'Contraseña debe ser de al menos 6 caracteres')
          //.required('Ingrese una Contraseña'),
          confirmPassword: yup
            .string()
          //.required('Ingrese nuevamente la Contraseña')
          //.oneOf([yup.ref('password'), null], 'Contraseñas no coinciden'),
        })}
      >
        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
          <View style={{ margin: 10 }}>
            <TextInput
              style={styles.InputField}
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={() => setFieldTouched('email')}
              placeholder="Correo"
            />
            {touched.email && errors.email &&
              <Text style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text>
            }
            <TextInput
              style={styles.InputField}
              value={values.password}
              onChangeText={handleChange('password')}
              placeholder="Contraseña"
              onBlur={() => setFieldTouched('password')}
              secureTextEntry={true}
            />
            {touched.password && errors.password &&
              <Text style={{ fontSize: 10, color: 'red' }}>{errors.password}</Text>
            }
            <TextInput
              style={styles.InputField}
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              placeholder="Confirmar Contraseña"
              onBlur={() => setFieldTouched('confirmPassword')}
              secureTextEntry={true}
            />
            {touched.confirmPassword && errors.confirmPassword &&
              <Text style={{ fontSize: 10, color: 'red' }}>{errors.confirmPassword}</Text>
            }
            <TouchableOpacity style={styles.Container(isValid)} disabled={!isValid} onPress={handleSubmit}>
              <Text style={styles.ButtonText}>Registrarse</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    )
  }
}

const styles = StyleSheet.create({
  Container: (isValid) => ({
    backgroundColor: isValid ? '#66CBFF' : "#8E8E8E",
    padding: 8,
    borderRadius: 5,
    marginVertical: 15,
    flexDirection: 'row'
  }),
  ButtonText: {
    fontSize: 17,
    color: 'white',
    marginLeft: 8,
  },
  InputField: {
    marginVertical: 5,
  }
})
