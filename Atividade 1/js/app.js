

/* =========================================================
   1) TEMPLATES DAS PÁGINAS (HTML GERADO VIA JS)
   ========================================================= */

const templates = {
    home: `
        <section class="container">
            <h2>Quem Somos</h2>

            <img src="/img/equipe.jpeg" alt="Equipe de voluntários reunida" style="margin-bottom: 1rem; border-radius: 6px;">

            <p>Somos uma organização que trabalha para transformar vidas por meio de ações comunitárias, programas de apoio e projetos sociais direcionados a famílias em situação de vulnerabilidade.</p>
        </section>

        <section class="container">
            <h2>Nossas Ações</h2>

            <img src="/img/acao-social.jpeg" alt="Ação social sendo realizada" style="margin-bottom: 1rem; border-radius: 6px;">

            <p>Realizamos campanhas de arrecadação de alimentos, roupas, apoio educacional, visitas a instituições e projetos de impacto social contínuo.</p>
        </section>

        <section class="container">
            <h2>Contato</h2>
            <p><strong>E-mail:</strong> contato@organizacao.org</p>
            <p><strong>Telefone:</strong> (11) 99999-9999</p>
        </section>
    `,

    projetos: `
        <section class="container">
            <h2>Projetos Sociais</h2>

            <div class="card">
                <h3>Campanha de Doação de Alimentos <span class="badge badge-primary">Ativo</span></h3>
                <p>Arrecadação de cestas básicas para famílias em situação de vulnerabilidade.</p>
            </div>

            <div class="card">
                <h3>Reforço Escolar Infantil <span class="badge badge-success">Em andamento</span></h3>
                <p>Aulas de reforço para crianças do ensino fundamental com dificuldades de aprendizagem.</p>
            </div>

            <div class="card">
                <h3>Cadastros Recentes (simulação com LocalStorage)</h3>
                <p class="text-sm">Os cadastros feitos no formulário aparecem aqui só no seu navegador.</p>
                <ul id="lista-cadastros" class="lista-cadastros"></ul>
            </div>
        </section>
    `,

    cadastro: `
        <section class="container">
            <h2>Cadastro de Participante</h2>

            <div id="form-alert"></div>

            <form id="form-cadastro" novalidate>
                <fieldset>
                    <legend>Informações Pessoais</legend>

                    <label for="nome">Nome Completo:</label>
                    <input type="text" id="nome" required>

                    <label for="email">E-mail:</label>
                    <input type="email" id="email" required>

                    <label for="cpf">CPF:</label>
                    <input type="text" id="cpf" maxlength="14" required>

                    <label for="telefone">Telefone:</label>
                    <input type="tel" id="telefone" maxlength="15" required>

                    <label for="dataNascimento">Data de Nascimento:</label>
                    <input type="date" id="dataNascimento" required>
                </fieldset>

                <fieldset>
                    <legend>Endereço</legend>

                    <label for="cep">CEP:</label>
                    <input type="text" id="cep" maxlength="9" required>

                    <label for="endereco">Endereço:</label>
                    <input type="text" id="endereco" required>

                    <label for="cidade">Cidade:</label>
                    <input type="text" id="cidade" required>

                    <label for="estado">Estado (UF):</label>
                    <input type="text" id="estado" maxlength="2" required>
                </fieldset>

                <button type="submit" class="btn btn-primary">Enviar Cadastro</button>
            </form>
        </section>
    `
};


/* =========================================================
   2) NÚCLEO DA SPA – ROTEAMENTO E RENDERIZAÇÃO
   ========================================================= */

function renderView(viewName) {
    const appRoot = document.getElementById("app-root");
    if (!appRoot) return;

    const template = templates[viewName] || templates.home;
    appRoot.innerHTML = template;

    if (viewName === "cadastro") {
        initMasks();
        initFormValidation();
    }

    if (viewName === "projetos") {
        renderCadastrosNaLista();
    }
}

function handleRouteChange(route) {
    const view = route.replace("#", "") || "home";
    renderView(view);
}

function initSPA() {
    // Rota inicial usando hash (#home, #projetos, #cadastro)
    handleRouteChange(window.location.hash || "#home");

    // Clique no menu
    const links = document.querySelectorAll("a[data-route]");
    links.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const route = link.getAttribute("href");
            window.location.hash = route; // atualiza URL
            handleRouteChange(route);
        });
    });

    // Se o usuário mudar o hash manualmente
    window.addEventListener("hashchange", () => {
        handleRouteChange(window.location.hash);
    });
}


/* =========================================================
   3) MÁSCARAS DE INPUT (CPF, TELEFONE, CEP)
   ========================================================= */

function initMasks() {
    const cpf = document.getElementById("cpf");
    const tel = document.getElementById("telefone");
    const cep = document.getElementById("cep");

    if (cpf) {
        cpf.addEventListener("input", () => {
            cpf.value = cpf.value
                .replace(/\D/g, "")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        });
    }

    if (tel) {
        tel.addEventListener("input", () => {
            tel.value = tel.value
                .replace(/\D/g, "")
                .replace(/(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{5})(\d)/, "$1-$2");
        });
    }

    if (cep) {
        cep.addEventListener("input", () => {
            cep.value = cep.value
                .replace(/\D/g, "")
                .replace(/(\d{5})(\d)/, "$1-$2");
        });
    }
}


/* =========================================================
   4) VALIDAÇÃO DO FORMULÁRIO + ALERTAS VISUAIS
   ========================================================= */

function mostrarAlert(tipo, mensagem) {
    const container = document.getElementById("form-alert");
    if (!container) return;

    container.innerHTML = `
        <div class="alert alert-${tipo}" role="alert">
            ${mensagem}
        </div>
    `;

    setTimeout(() => {
        container.innerHTML = "";
    }, 4000);
}

function limparErrosCampos(form) {
    form.querySelectorAll(".input-error").forEach(input => {
        input.classList.remove("input-error");
    });
}

function initFormValidation() {
    const form = document.getElementById("form-cadastro");
    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        limparErrosCampos(form);

        const nome = document.getElementById("nome");
        const email = document.getElementById("email");
        const cpf = document.getElementById("cpf");
        const telefone = document.getElementById("telefone");
        const dataNascimento = document.getElementById("dataNascimento");
        const cep = document.getElementById("cep");
        const endereco = document.getElementById("endereco");
        const cidade = document.getElementById("cidade");
        const estado = document.getElementById("estado");

        let erros = [];

        // Regras simples de consistência
        if (!nome.value || nome.value.trim().length < 5) {
            erros.push("Nome deve ter pelo menos 5 caracteres.");
            nome.classList.add("input-error");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            erros.push("E-mail inválido.");
            email.classList.add("input-error");
        }

        const cpfNumeros = cpf.value.replace(/\D/g, "");
        if (cpfNumeros.length !== 11) {
            erros.push("CPF deve conter 11 dígitos.");
            cpf.classList.add("input-error");
        }

        const telNumeros = telefone.value.replace(/\D/g, "");
        if (telNumeros.length < 10) {
            erros.push("Telefone deve conter DDD + número válido.");
            telefone.classList.add("input-error");
        }

        if (!dataNascimento.value) {
            erros.push("Informe a data de nascimento.");
            dataNascimento.classList.add("input-error");
        }

        const cepNumeros = cep.value.replace(/\D/g, "");
        if (cepNumeros.length !== 8) {
            erros.push("CEP deve conter 8 dígitos.");
            cep.classList.add("input-error");
        }

        if (!endereco.value.trim()) {
            erros.push("Endereço é obrigatório.");
            endereco.classList.add("input-error");
        }

        if (!cidade.value.trim()) {
            erros.push("Cidade é obrigatória.");
            cidade.classList.add("input-error");
        }

        if (estado.value.trim().length !== 2) {
            erros.push("Estado deve conter exatamente 2 letras (UF).");
            estado.classList.add("input-error");
        }

        if (erros.length > 0) {
            mostrarAlert("danger", erros.join("<br>"));
            return;
        }

        mostrarAlert("success", "Cadastro realizado com sucesso!");

        salvarCadastroLocalStorage({
            nome: nome.value.trim(),
            email: email.value.trim(),
            cidade: cidade.value.trim(),
            estado: estado.value.trim()
        });

        form.reset();
    });
}


/* =========================================================
   5) LOCALSTORAGE – SALVAR E LISTAR CADASTROS
   ========================================================= */

const STORAGE_KEY = "cadastros_organizacao";

function obterCadastros() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
}

function salvarCadastroLocalStorage(novoCadastro) {
    const cadastros = obterCadastros();
    cadastros.push({
        ...novoCadastro,
        data: new Date().toLocaleDateString("pt-BR")
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cadastros));
}

function renderCadastrosNaLista() {
    const ul = document.getElementById("lista-cadastros");
    if (!ul) return;

    const cadastros = obterCadastros();

    if (cadastros.length === 0) {
        ul.innerHTML = "<li>Nenhum cadastro realizado ainda.</li>";
        return;
    }

    ul.innerHTML = "";
    cadastros.forEach(c => {
        const li = document.createElement("li");
        li.textContent = `${c.nome} – ${c.cidade}/${c.estado} (cadastrado em ${c.data})`;
        ul.appendChild(li);
    });
}


/* =========================================================
   6) INICIALIZAÇÃO GERAL
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initSPA();
    initHighContrastToggle();
});

function initHighContrastToggle() {
    const btn = document.getElementById("toggle-contrast");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const isActive = document.body.classList.toggle("high-contrast");
        btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
}