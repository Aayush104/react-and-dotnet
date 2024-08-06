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

                return response.data


    },

    forgetPassword : async(forgetPassword)=>{
        try {

            console.log(forgetPassword);
            const response = await axios.post("https://localhost:7252/api/Account/ForgetPassword",forgetPassword)

            if(response.status !==200) throw new Error("User Donot exist");

        return response.data    
        
        } catch (error) {
            console.error("Error:", error.response.data);
        }

        

    },
    addCategory : async(addCategory)=>{
        try {
            
            const response = await axios.post("https://localhost:7252/api/Product/AddCategory",addCategory)
           return response.data
        } catch (error) {
            console.error("Error", error.response.data);
        }
    },

    getCategory : async()=>
    {
        try {
            
            const response = await axios.get("https://localhost:7252/api/Product/GetCategories")
            return response.data
        } catch (error) {
            console.error("Error", error.response.data);
        }
        
    },
   
     addProduct : async (productData, token) => {
        try {
            const response = await axios.post(
                "https://localhost:7252/api/Product/AddProducts",
                productData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data" 
                    }
                }
            );
    
            return response.data;
        } catch (error) {
            console.error("Error adding product:", error.response ? error.response.data : error.message);
            throw error; 
        }
    },
    getProducts : async ()=>{
        try {
            const response = await axios.get("https://localhost:7252/api/Product/GetProducts")

            return response.data
        } catch (error) {
            console.error("Error adding product:", error.response ? error.response.data : error.message);
            throw error; 
        }
    }

}));

export default useStore;
