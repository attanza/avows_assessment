import { Field, Form, Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const LoginSchema = Yup.object().shape({
  password: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
});

const Login = () => {
  const history = useHistory();
  const { getMe } = useAuth();
  return (
    <div className="hold-transition login-page">
      <div className="login-box">
        <div className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">Welcome, Sign in to start your session</p>
            <Formik
              initialValues={{ email: 'dani.lesmiadi@gmail.com', password: 'password' }}
              validationSchema={LoginSchema}
              onSubmit={async (values) => {
                try {
                  await api.post('/login', { ...values });
                  await getMe();
                  history.push('/');
                } catch (error) {
                  toast.error('Login failed !');
                }
              }}>
              {({ errors, touched }) => (
                <Form>
                  <div className="mb-3">
                    <div className="input-group">
                      <Field
                        type="email"
                        className={`form-control ${
                          errors.email && touched.email ? 'is-invalid' : ''
                        }`}
                        placeholder="Email"
                        name="email"
                      />
                      <div className="input-group-append">
                        <div className="input-group-text">
                          <span className="fas fa-envelope" />
                        </div>
                      </div>
                    </div>
                    {errors.email && touched.email ? (
                      <p className="text-danger mt-1" style={{ fontSize: 12 }}>
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <div className="input-group">
                      <Field
                        type="password"
                        className={`form-control ${
                          errors.email && touched.email ? 'is-invalid' : ''
                        }`}
                        placeholder="Password"
                        name="password"
                      />
                      <div className="input-group-append">
                        <div className="input-group-text">
                          <span className="fas fa-lock" />
                        </div>
                      </div>
                    </div>
                    {errors.password && touched.password ? (
                      <p className="text-danger mt-1" style={{ fontSize: 12 }}>
                        {errors.password}
                      </p>
                    ) : null}
                  </div>
                  <div className="row mt-4">
                    <div className="col">
                      <button type="submit" className="btn btn-primary btn-block">
                        Sign In
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
