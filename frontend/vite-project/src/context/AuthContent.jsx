import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("customers/me")
      .then((response) => {
        setCustomer(response.data.customerData);
      })
      .catch((error) => {
        console.log(error);
        setCustomer(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Centralized logout function
  const logout = async () => {
    try {
      await axiosInstance.get("/customers/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      // Always reset the local customer state to null
      setCustomer(null);
    }
  };

  return (
    <AuthContext.Provider value={{ customer, setCustomer, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);