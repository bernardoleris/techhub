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
  const response = await fetch("http://localhost:5000/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao fazer login");
  }

  console.log("Dados do usuário no login:", data);

  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.user.id);
  localStorage.setItem("role", data.user.role);

  return data; 
};


