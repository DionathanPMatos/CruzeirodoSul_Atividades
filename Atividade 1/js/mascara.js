const cpf = document.getElementById("cpf");
const tel = document.getElementById("telefone");
const cep = document.getElementById("cep");

cpf.addEventListener("input", () => {
    cpf.value = cpf.value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
});

tel.addEventListener("input", () => {
    tel.value = tel.value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
});

cep.addEventListener("input", () => {
    cep.value = cep.value
        .replace(/\D/g, "")
        .replace(/(\d{5})(\d)/, "$1-$2");
});
