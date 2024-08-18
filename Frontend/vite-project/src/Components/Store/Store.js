import axios from "axios";
import { create } from "zustand";
import Cookies from "js-cookie";

const useStore = create((set) => ({
    user: null,
    userToken: null,
    registerUser: async (userData) => {
        try {
            const response = await axios.post("https://localhost:7252/api/Account/register", userData);
            console.log(response);
            if (response.status !== 200) throw new Error("Registration failed");

            const result = response.data;
            set({ user: result.user });
        } catch (error) {
            console.error("Error:", error.response?.data);
        }
    },

    loginUser: async (userData) => {
        try {
            const response = await axios.post("https://localhost:7252/api/Account/login", userData);
            console.log(response);
            if (response.status !== 200) throw new Error("Login failed");

         
            const { token } = response.data;
            console.log(token)

            const decodedToken = JSON.parse(atob(token.split('.')[1]));

            console.log(decodedToken)

            set({ user: { decodedToken } });
            set({userToken: {token}})

        

            return response.data.token;
        } catch (error) {
            console.error("Error:", error.response?.data);
        }
    },

    forgetPassword: async (forgetPassword) => {
        try {
            console.log(forgetPassword);
            const response = await axios.post("https://localhost:7252/api/Account/ForgetPassword", forgetPassword);

            if (response.status !== 200) throw new Error("User does not exist");

            return response.data;
        } catch (error) {
            console.error("Error:", error.response?.data);
        }
    },

    addCategory: async (addCategory) => {
        try {
            const response = await axios.post("https://localhost:7252/api/Product/AddCategory", addCategory);
            return response.data;
        } catch (error) {
            console.error("Error", error.response?.data);
        }
    },

    getCategory: async () => {
       
        try {
            const response = await axios.get("https://localhost:7252/api/Product/GetCategories");
       
            return response.data;
            
        } catch (error) {
            console.error("Error", error.response?.data);
        }
    },

    addProduct: async (productData) => {
        try {

            const{userToken} = useStore.getState()

            const response = await axios.post(
                "https://localhost:7252/api/Product/AddProducts",
                productData,
                {
                    headers: {
                        "Authorization": `Bearer ${userToken.token}`,
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

    getProducts: async () => {
      
        try {
            
            const response = await axios.get("https://localhost:7252/api/Product/GetProducts");
            return response.data;
        } catch (error) {
            console.error("Error fetching products:", error.response ? error.response.data : error.message);
            throw error;
        }
    },

    // getUserList : async ()=>{

    //     try {

       
        
    //         const{userToken} = useStore.getState()
            

    //         console.log("category", userToken)
    //         const response = await axios.get("https://localhost:7252/api/Chat/UserList",{

    //            headers:{
    //             "Authorization": `Bearer ${userToken.token}`
    //            }
    //           })
             
    //           return response.data
    //     } catch (error) {
    //         console.error("Error fetching UserList:", error.response ? error.response.data : error.message);
    //         throw error;
    //     }
    // }
}));

export default useStore;
