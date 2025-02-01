export const registerUser = async (formData) => {
    const response = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.error || "Erro ao registrar usuário");
    }
  
    return data;
};
  
export const loginUser = async (formData) => {
  try {
    const response = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao fazer login. Verifique suas credenciais.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Erro ao conectar ao servidor.");
  }
};

