import Form from '../components/Form'

function Login(){
   return (
    <Form route='/api/user/token/' method='login'></Form>
   )
}

export default Login;