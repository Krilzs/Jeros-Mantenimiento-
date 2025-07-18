const traduccionesErrores = {
  "User already registered": "El usuario ya está registrado.",
  "Email not confirmed": "Debés confirmar tu email para continuar.",
  "Invalid login credentials": "Credenciales inválidas.",
  "Password should be at least 6 characters.":
    "La contraseña debe tener al menos 6 caracteres.",
  "Email rate limit exceeded": "Demasiados intentos. Intentá más tarde.",
  "Unable to validate email address: invalid format":
    "El mail ingresado no tiene un formato valido.",
  "Anonymous sign-ins are disabled": "Faltan campos obligatorios.",
  "missing email or phone" : "Error de autenticación."
  // agregás más según te aparezcan
};

function translateError(error) {
  return traduccionesErrores[error] || error;
}

export { translateError };
