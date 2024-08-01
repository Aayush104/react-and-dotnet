import axios from "axios";
import { useNavigate } from "react-router-dom";
import {create} from "zustand";



const useStore = create((set) => ({
    user: null,
    registerUser: async (userData) => {
        try {
           
            const response = await axios.post("https://localhost:7252/api/Account/register", userData);

            console.log(response);
            if (response.status !== 200) throw new Error("Registration failed");

            const result = response.data;
            set({ user: result.user });
        } catch (error) {
            console.error("Error:", error.response.data);
        }
    },

    loginUser : async(userData)=>{
                const response = await axios.post("https://localhost:7252/api/Account/login",userData);

                console.log(response)
                if (response.status !== 200) throw new Error("Login failed");


    },

    forgetPassword : async(forgetPassword)=>{
        try {

            console.log(forgetPassword);
            const response = await axios.post("https://localhost:7252/api/Account/ForgetPassword",forgetPassword)

            if(response.status !==200) throw new Error("User Donot exist");
console.log(response)
        return response.data    
        
        } catch (error) {
            console.error("Error:", error.response.data);
        }

    }

}));

export default useStore;
