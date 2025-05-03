import Form from '../components/Form'
function Register() {
  return (
    <>
    <div className="authentication-container">
     
      <Form route='/api/user/register/' method='register'></Form>
    </div>
    </>
  );
}

export default Register;