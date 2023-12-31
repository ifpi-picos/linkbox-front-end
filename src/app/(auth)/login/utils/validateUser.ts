export const getPasswordError = (password: string) => {
  if (password === "") {
    return "A senha é obrigatória.";
  } else if (password.length <= 6) {
    return "A senha precisa ter mais de 6 caracteres.";
  }

  return "";
};

export const getUsernameError = (username: string) => {
  if (username === "") {
    return "O nome de usuário é obrigatório.";
  }

  return "";
};

export const getEmailError = (email: string) => {
  if (email === "") {
    return "O email é obrigatório.";
  }

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailRegex.test(email)) {
    return "Insira um email válido.";
  }

  return "";
};
