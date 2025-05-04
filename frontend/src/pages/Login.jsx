import Form from '../components/Form'
import '../styles/Authentication.css'
function Login(){
   return (
      <>
      <div className="authentication-container">
         <Form route='/api/user/token/' method='login'></Form>
      </div>
         
      </>
   )
}

export default Login;