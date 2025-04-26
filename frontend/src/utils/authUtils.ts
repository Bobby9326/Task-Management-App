import  axiosInstance  from "./axios";

export const getUsername = async (): Promise<string> => {
    const res = await axiosInstance.get('/auth/check');
    const data = res.data;
    return data.email;
  };
  
export const isAuthenticated = async (): Promise<boolean> => {
    const res = await axiosInstance.get('/auth/check');
    const data = res.data;
    return data.authenticated;
  };
  