import React, { useState ,useContext} from 'react';
import { useNavigate ,Link } from 'react-router-dom';
import AppContext from '../context/user.context';

const register : React.FC= () => {

    const appcontext = useContext(AppContext) 
    const Navigate = useNavigate()

    interface user_interface {
        firstname: string ,
        lastname: string ,
        email: string,
        password: string,
        phone_no: number,

    }

    const [formData, setFormData] = useState<user_interface>({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        phone_no: 0,
    });

    const saveuser = async () => {

        const {firstname , lastname , phone_no , email ,password} = formData
        try {
            console.log("saveuser function called with data:", formData);
            const response = await fetch("/add_user" , {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                firstname,
                lastname,
                phone_no,
                email,
                password
                })
                });

                if (response.ok){
                    console.log("User Save to Database")
                    appcontext?.changeLoginState(true);
                    Navigate("/")
                }
                else{
                    console.log("User not saved to Database")
                }
        } catch (error) {
            console.log(error)
        }
        
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        // console.log('handleChange called', e); // Log the entire event object
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
    
    
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
    };

  return (
    <div className='flex justify-center items-center min-h-screen bg-custom'>
       <div className=" w-md  p-8 rounded-md">
                <h2 className="text-4xl underline text-center font-semibold mb-10">Registration Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className="md:grid md:grid-cols-2 md:gap-x-24 md:gap-y-12 flex flex-col gap-y-8 mt-12">
                        <div className='flex flex-row justify-around'>
                            <label htmlFor="firstname" className="block text-sm font-medium mt-2">
                               First Name
                            </label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                placeholder='Enter First Name'
                                value={formData.firstname}
                                onChange={handleChange}
                                className="w-48 p-2 ml-4 border rounded-md h-8 "
                            />
                        </div>
                        <div className='flex flex-row justify-around'>
                            <label htmlFor="lastname" className="block text-sm font-medium mt-2">
                               Last Name
                            </label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                placeholder='Enter Last Name'
                                value={formData.lastname}
                                onChange={handleChange}
                                className="w-48 p-2 ml-4 border rounded-md h-8 "
                            />
                        </div>
                    
                        <div className="flex flex-row justify-around ">
                            <label htmlFor="phoneNo" className="block text-sm font-medium mt-2">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="phone_no"
                                name="phone_no"
                                placeholder='Enter Your Number'
                                value={formData.phone_no}
                                onChange={handleChange}
                                className="w-48 ml-4 p-2 border rounded-md h-8"
                            />
                        </div>
                    </div>
                    <div className="mt-4 mb-3 p-4">

                    <div className="flex flex-row justify-around ">
                            <label htmlFor="email" className="block text-sm font-medium mt-2">
                                Email
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                placeholder='Your Email here'
                                value={formData.email}
                                onChange={handleChange}
                                className="w-48 ml-4 p-2 border rounded-md h-8"
                            />
                        </div>
                        <div className="flex flex-row justify-around mt-4">
                            <label htmlFor="Password" className="block text-sm font-medium mt-2">
                                Password
                            </label>
                            <input
                                type="text"
                                id="password"
                                name="password"
                                placeholder='Password'
                                value={formData.password}
                                onChange={handleChange}
                                className="w-48 ml-4 p-2  border rounded-md h-8"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="md:ml-44 h-10 mt-4 w-80 text-black hover:text-white hover:bg-black font-semibold border-2 rounded-full border-black"
                        onClick={saveuser}
                    >
                        
                        Register
    
                    </button>
                    <div className="flex items-center mt-6 justify-between pb-6">
                          <p className="mb-0 mr-2">Already have an account?</p>
                          <button
                            type="button"
                            className="w-20 h-8 text-black hover:text-white hover:bg-black font-semibold border-2 rounded-full border-black"
                            data-te-ripple-init
                            data-te-ripple-color="light">
                            <Link to={"/signIn"}>
                              SingIn
                            </Link>
                          </button>
                        </div>
                </form>
            </div>
    </div>
  )
}

export default register
