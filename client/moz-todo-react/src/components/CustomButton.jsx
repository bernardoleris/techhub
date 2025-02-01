import Button from "@mui/material/Button";

const CustomButton = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      sx={{
        backgroundColor: "#000000",
        color: "#fff",
        padding: "10px 20px",
        fontWeight: 500,
        textTransform: "none",
        borderRadius: "25px", // Deixa o botão mais arredondado
        border: "2px solid #007bff", // Adiciona a borda azul ao redor do botão
        "&:hover": {
          backgroundColor: "#000000",
          borderColor: "#0056b3", // Muda a cor da borda ao passar o mouse
        },
      }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
