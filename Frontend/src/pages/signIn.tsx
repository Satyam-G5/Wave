import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppContext from '../context/user.context'
import SocketContext from '../context/socket.context'
const signIn: React.FC = () => {

  const appContext = useContext(AppContext)
  const socketContext = useContext(SocketContext)

  const login_success: boolean = true

  const navigator = useNavigate()

  interface user {
    email: string;
    password: string;
  }


  const [data, setData] = useState<user>({
    email: "",
    password: ""
  });

  const checkuser = async () => {
    const { email, password } = data;
    try {
      const response = await fetch("/log_user", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      console.log("Email send - " , data.email)
      const getresponse = await response.json();
      console.log("Full response:", getresponse); // Log the full response
      const newtoken = getresponse.token;
      console.log("Token:", newtoken); // Log the token


      if (getresponse.success) {

        // const { changeLoginState , changeToken , token } = appContext;
        if (!appContext) {
          console.log("appContext is empty")
          return null; // or render a loading/error message
        }
        appContext.changeLoginState(login_success)
        appContext.changeToken(newtoken)

        socketContext?.addsocket();
        navigator("/");
      }
      else {
        console.log("Login failed:", getresponse.message);
      }
    }
    catch (error) {
      console.log("Error:", error);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send formData to your backend API for registration
    console.log(data);
  };
  return (
    <div className='flex justify-center items-center min-h-screen  bg-custom'>
      <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit} >
      <p className="flex justify-center items-center font-semibold text-2xl mb-4">Please login to your account</p>
        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-black">Email address</label>
          <div className="mt-2">
            <input onChange={handleChange} id="email" name="email" type="email" required className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-black">Password</label>

          </div>
          <div className="mt-2">
            <input onChange={handleChange} id="password" name="password" type="password" required className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6" />
          </div>
        </div>
        <div className="mb-12 pb-1 pt-1 text-center">
          <button
            className="ml-20 mr-20 h-10 mt-4 w-80 text-black hover:text-white hover:bg-black font-semibold border-2 rounded-full border-black"
            type="button"
            onClick={checkuser}
          >

            Log in

          </button>

        </div>


        <div className="flex items-center justify-between pb-6">
          <p className="mb-0 mr-2">Don't have an account?</p>
          <button
            type="button"
            className="w-20 h-8 text-black hover:text-white hover:bg-black font-semibold border-2 rounded-full border-black"
            data-te-ripple-init
            data-te-ripple-color="light">
            <Link to={"/registration"}>
              Register
            </Link>
          </button>
        </div>
      </form>
    </div>
  )
}

export default signIn
