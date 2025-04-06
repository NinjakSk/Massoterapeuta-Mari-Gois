const perguntas = [
    { pergunta: "Qual tipo de massagem?", opcoes: ["Relaxante", "Drenagem linfática"] },
    { pergunta: "Por região, corporal ou pacote?", tipo: "texto" },
    { pergunta: "Na sua casa ou na minha casa?", opcoes: ["Na minha casa", "Na sua casa"] },
    { pergunta: "Quais dias você tem preferência ou disponibilidade?", tipo: "texto" },
    { pergunta: "Quais horários?", tipo: "texto" },
    { pergunta: "Forma de pagamento: Pix ou dinheiro?", opcoes: ["Pix", "Dinheiro"] }
];

let respostas = [];
let passo = 0;

function abrirFormulario() {
    document.getElementById('formulario-modal').style.display = 'flex';
    mostrarPergunta();
}

function fecharFormulario() {
    document.getElementById('formulario-modal').style.display = 'none';
    respostas = [];
    passo = 0;
    document.getElementById('resumo-container').style.display = 'none';
    document.querySelector('.proximo').innerText = 'Próximo';
}

function mostrarPergunta() {
    const container = document.getElementById('perguntas-container');
    container.innerHTML = '';

    const atual = perguntas[passo];
    const label = document.createElement('label');
    label.innerText = atual.pergunta;
    container.appendChild(label);

    const input = atual.opcoes
        ? (() => {
            const select = document.createElement('select');
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.innerText = 'Selecione uma opção';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            select.appendChild(defaultOption);

            atual.opcoes.forEach(opcao => {
                const option = document.createElement('option');
                option.value = opcao;
                option.innerText = opcao;
                select.appendChild(option);
            });
            return select;
        })()
        : (() => {
            const input = document.createElement('input');
            input.type = 'text';
            return input;
        })();

    container.appendChild(input);

    // Controla o botão voltar
    document.getElementById('btn-voltar').style.display = passo > 0 ? 'inline-block' : 'none';

    // Habilita o botão próximo apenas se algo foi digitado
    const btnProximo = document.getElementById('btn-proximo');
    btnProximo.disabled = true;
    input.addEventListener('input', () => {
        btnProximo.disabled = !input.value.trim();
    });
}

function proximaPergunta() {
    const atual = perguntas[passo];
    const container = document.getElementById('perguntas-container');
    const input = container.querySelector('select, input');

    if (!input.value.trim()) return alert('Por favor, preencha a resposta.');
    const respostaAtual = input.value;

    if (
        passo === 1 &&
        ['por região', 'região', 'regiao'].includes(respostaAtual.toLowerCase())
    ) {
        perguntas.splice(passo + 1, 0, {
            pergunta: "Qual região você gostaria de massagear?",
            opcoes: ["Pernas", "Costas", "Rosto", "Braços", "Pés", "Outra"]
        });
    }

    respostas.push(respostaAtual);
    passo++;

    if (passo >= perguntas.length) {
        gerarMensagemFinal();
    } else {
        mostrarPergunta();
    }

    if (
        passo > 1 &&
        perguntas[passo - 1].pergunta.includes("Qual região") &&
        respostaAtual === "Outra"
    ) {
        perguntas.splice(passo + 1, 0, {
            pergunta: "Por favor, digite a região desejada:",
            tipo: "texto"
        });
    }
}

function voltarPergunta() {
    if (passo === 0) return;
    passo--;
    respostas.pop(); // Remove a última resposta anterior
    mostrarPergunta();
}

function gerarMensagemFinal() {
    let mensagem = "";

    const massagem = respostas[0];
    const tipoServico = respostas[1].toLowerCase();
    const emCasa = respostas[2];
    const dias = respostas[3];
    const horarios = respostas[4];
    const pagamento = respostas[5].toLowerCase();

    const nomesProprios = (texto) => texto
        .replace(/\bpix\b/gi, "Pix")
        .replace(/\bdinheiro\b/gi, "Dinheiro")
        .replace(/\bolá\b/gi, "Olá");

    // Verifica se a pessoa escolheu "por região"
    if (["por região", "região", "regiao"].includes(tipoServico)) {
        const regiao = respostas[2].toLowerCase(); // a pergunta extra desloca os índices
        const novaCasa = respostas[3];
        const novosDias = respostas[4];
        const novosHorarios = respostas[5];
        const novoPagamento = respostas[6].toLowerCase();

        mensagem = `Olá! Gostaria de agendar uma massagem ${massagem}, na região ${regiao}, realizada ${novaCasa}. Tenho disponibilidade nos dias ${novosDias} e horários ${novosHorarios}. Pagarei via ${novoPagamento}.`;
        mensagem = mensagem.includes('.') ? mensagem : mensagem.toLowerCase();
        mensagem = nomesProprios(mensagem);

    } else {
        mensagem = `Olá! Gostaria de agendar uma massagem ${massagem}, escolhendo o serviço: ${tipoServico}, realizada ${emCasa}. Tenho disponibilidade nos dias ${dias} e horários ${horarios}. Pagarei via ${pagamento}.`;
        mensagem = mensagem.includes('.') ? mensagem : mensagem.toLowerCase();
        mensagem = nomesProprios(mensagem);
    }

    const link = `https://wa.me/5514998516736?text=${encodeURIComponent(mensagem)}`;
    window.open(link, '_blank');
    fecharFormulario();
}

// Fecha ao clicar fora do conteúdo
window.addEventListener('click', (e) => {
    const modal = document.getElementById('formulario-modal');
    const content = document.querySelector('.modal-content');
    if (e.target === modal && !content.contains(e.target)) {
        fecharFormulario();
    }
});

function toggleMenu(button) {
    const nav = document.querySelector("nav");
    nav.classList.toggle("open");
    button.classList.toggle("open");
}