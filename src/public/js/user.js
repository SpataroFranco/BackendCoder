document.addEventListener("DOMContentLoaded", function () {
  const cambiarRolButtons = document.querySelectorAll(".cambiarRol");
  const eliminarUsuario = document.querySelectorAll(".eliminarUsuario");

  cambiarRolButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const userId = button.getAttribute("data-user-id");
      console.log(userId);

      fetch(`/api/users/premium/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data); 
          if (data.status === 200) {
            console.log("Rol cambiado con éxito");
          }
        })
        .catch((error) => {
          console.error("Error en la solicitud fetch:", error);
        });
    });
  });


  eliminarUsuario.forEach(function (button) {
    button.addEventListener("click", function () {
      const userId = button.getAttribute("data-user-id");
      console.log(userId);

      fetch(`/api/users/premium/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data); 
          if (data.status === 200) {
            console.log("Usuario eliminado con exito");
          }
        })
        .catch((error) => {
          console.error("Error en la solicitud fetch:", error);
        });
    });
  });
});
