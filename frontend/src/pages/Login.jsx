import Form from '../components/Form'

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