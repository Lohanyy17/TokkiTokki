// leitor de qr code
const qrcode = require('qrcode-terminal');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js'); // Mudança Buttons
const axios = require('axios');

const client = new Client();

// serviço de leitura do qr code

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

// apos isso ele diz que foi tudo certo
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

// E inicializa tudo 
client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra

async function enviarQrCodePixComoImagem(client, to, imageUrl, caption){
    try{
        const media = await MessageMedia.fromUrl(imageUrl, {
            unsafeMime: true,
            filename: 'qrcode.png',
        });
        await client.sendMessage(to, media, { caption });
        return;
    } catch (e1) {
        console.warn('fromUrl falhou, tentando baixar manualmente...', e1?.message || e1);
    }

    try{
        const res = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
            headers: {
                'Accept': 'image/avif,image/webp,imagem/apng,image/svg+xml,image/,/*;q=0.8'
            }
        });

        const mime = res.headers['content-type'] || 'image/png';
        const base64 = Buffer.from(res.data).toString('base64');
        const media = new MessageMedia(mime, base64, 'qrcode.png');

        await client.sendMessage(to, media, { caption });
    }catch (e2) {
        console.error('Falha ao baixar/enviar imagem do QR Code:', e2);
        throw e2;
    }
}

async function registrarReserva(nome, pessoas, dataReserva, horarioReserva) {
 try {
    await axios.post('https://hook.us2.make.com/bcqx8bhsjknu6dv2pqhol74xtusy95tv', {
    nome,
    pessoas,
    dataReserva,
    horarioReserva
  })
  console.log('Reserva registrada:', { nome, pessoas, dataReserva, horarioReserva })
} catch (erro) {
    console.error('Erro ao registrar a reserva:', erro?.response?.data || erro.message)
  }
}

// Funil

const estadoUsuario = {}; // "Caderno" para anotar o estado de cada usuário 

client.on('message', async msg => {

    if (msg.body.match(/(dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola)/i) && msg.from.endsWith('@c.us')) {

        const chat = await msg.getChat();

        await delay(2000);
        await chat.sendStateTyping();
        await delay(1000);
        const contact = await msg.getContact();
        const name = contact.pushname;
        await client.sendMessage(msg.from,'Olá!'+ name.split(" ")[0] + '\nSou o assistente virtual da Tokki Tokki Café =). Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - Horário de Funcionamento\n2 - Cardápio\n3 - Lista de alergênicos\n4 - Reserva');
        
    }

    if (msg.body !== null && msg.body === '1' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(2000);
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(msg.from, 'O horário de funcionamento das nossas lojas são de:\n*Segunda a Sexta:* Das 8h às 17h\n*Sábado, Domingos e Feriados:* Das 7h às 15h')



    }

    if (msg.body !== null && msg.body === '2' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(2000);
        await chat.sendStateTyping();
        await delay(2000);
        await client.sendMessage(msg.from, 'O cardápio da Tokki Tokki é uma jornada de sabores que celebra a união entre o Brasil e a Coreia. Em cada seção, de cafés da manhã a sobremesas, os pratos clássicos brasileiros ganham um toque coreano inusitado, com nomes que homenageiam diferentes espécies de coelhos. Já a nossa seção de cafés, feita com grãos brasileiros de alta qualidade, traz trocadilhos divertidos, refletindo o espírito criativo e aconchegante da nossa cafeteria.');
        await delay(1000);
        await client.sendMessage(msg.from, 'BREAKFAST:\n*Holland Lop*\nO autêntico pão de queijo quentinho e crocante por fora, macio e elástico por dentro. Uma delícia de Minas Gerais que conquista a todos.\n*Gigante Xadrez*\nUma versão brasileira da famosa panqueca doce coreana. Recheada com a dupla imbatível de goiabada e queijo branco, servida quente e crocante.\n*Deilenaar*\nA simplicidade de um bom pão de forma tostado com manteiga na chapa, recheado com queijo e presunto. O café da manhã mais tradicional do Brasil.\n*Bunolagus*\nO clássico bolo de fubá, fofinho e com um aroma delicioso de milho, perfeito para acompanhar o nosso Expresso.\n*Cashmere Lop*\nUm bolo de cenoura caseiro, super fofinho e úmido, coberto com uma generosa e irresistível calda de chocolate.');
        await delay(1000)
        await client.sendMessage(msg.from, 'DESSERTS:\n*Rex*\nO brigadeiro cremoso e irresistível, enrolado com o granulado clássico. A doçura perfeita para qualquer momento.\n*Teporingo*\nO tradicional pudim de leite condensado, com a sua textura aveludada e a inconfundível calda de caramelo que derrete na boca.\n*Tan*\nUma gema de ovo e coco com a cor vibrante do sol, uma sobremesa clássica do Nordeste brasileiro com uma crosta dourada e um interior macio e delicioso. \n*Nesolagus*\nA doçura do coco em lascas, cozido lentamente até se tornar uma cocada macia e de sabor intenso, uma verdadeira joia da culinária brasileira. \n*Netherland Dwarf*\nA energia do açaí puro, servido em tigela com a granola mais crocante, banana em rodelas e um toque de pasta de feijão-doce coreano para uma surpresa deliciosa.')
        await delay(1000)
        await client.sendMessage(msg.from, 'COFFEE:\n*Coelhuccino*\nUm delicioso cappuccino com a nossa espuma de leite macia e aveludada, finalizado com um toque de canela. Um abraço em forma de café.\n*Hoppy Latte*\nO clássico latte, com a nossa assinatura Tokki Tokki: uma cremosidade que fará o seu dia "saltar de alegria". \n*Mocha Cenourita*\nUma mistura inusitada de chocolate, café expresso e um toque especial de especiarias que lembra o sabor doce e terroso de uma cenoura fresca. \n*Cold Brew da Toca*\nCafé gelado coado por horas, criando uma bebida suave e de sabor profundo. Perfeito para se refrescar nos dias mais quentes. \n*Espresso no Pulão*\nO nosso expresso, forte e intenso, para quem precisa de um impulso rápido. Um verdadeiro "salto" de energia em uma xícara.')
    
    }

    if (msg.body !== null && msg.body === '3' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();


        await delay(2000);
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(msg.from, '*Lista de alergênicos*:\nLaticínios\nOvo\nGlúten\nSoja\nCastanhas');

    }

    if (msg.body !== null && msg.body === '4' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(2000); 
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(msg.from, '*Gostaria de fazer uma reserva?*\nSabemos que em alguns dias, a nossa toca fica bem cheia. Para garantir que a sua visita seja perfeita e você não precise esperar, oferecemos a possibilidade de reservar uma mesa.\nValor fixo de: R$20,00\nSe quiser fazer sua reserva digite *5*');

    }

if (msg.body === '5' && msg.from.endsWith('@c.us')){
    const chat = await msg.getChat();
    await delay(2000);
    await chat.sendStateTyping();
    await delay(1000);

    estadoUsuario[msg.from] = {
        passo: 'aguardando_pessoas'
    };

    await client.sendMessage(msg.from, 'Vamos iniciar o agendamento! Será mesa para quantas pessoas? Ex: x pessoas');
}
    
else if (estadoUsuario[msg.from] && estadoUsuario[msg.from].passo === 'aguardando_pessoas') {
    const numeroPessoas = parseInt(msg.body);

    if (!isNaN(numeroPessoas) && numeroPessoas > 0) {
        estadoUsuario[msg.from] = {
            passo: 'aguardando_data',
            pessoas: numeroPessoas
        };
        await client.sendMessage(msg.from, 'Certo! Agora me diga que dia será? (Ex:20/10/2025)');
    } else {
        await client.sendMessage(msg.from, 'Digite um número válido de pessoas, por favor.')
    }
}

else if (estadoUsuario[msg.from] && estadoUsuario[msg.from].passo === 'aguardando_data') {
    const dataReserva = msg.body;

    estadoUsuario[msg.from].data = dataReserva;
    estadoUsuario[msg.from].passo = 'aguardando_horario';

    await client.sendMessage(msg.from, 'Qual vai ser o horário? (10h45)')
}
    
else if (estadoUsuario[msg.from] && estadoUsuario[msg.from].passo === 'aguardando_horario') {
    const horarioReserva = msg.body;

    estadoUsuario[msg.from].horario = horarioReserva;
    estadoUsuario[msg.from].passo = 'aguardando_periodo_pagamento';

    const reservaFinal = estadoUsuario[msg.from];
    const contact = await msg.getContact();
    const nome = contact.pushname;

    const mensagemConfirmacao = `${nome}, antes de continuar confira se os dados da sua reserva estão certos:\n\n` +
                                `Pessoas: ${reservaFinal.pessoas}\n` +
                                `Data: ${reservaFinal.data}\n` +
                                `Horário: ${reservaFinal.horario}\n` +
                                `\nPara confirmar, digite *Continuar*`;
    await client.sendMessage(msg.from, mensagemConfirmacao);
}

else if (
    estadoUsuario[msg.from] &&
    estadoUsuario[msg.from].passo === 'aguardando_periodo_pagamento' && msg.body.toLowerCase() === 'continuar') {
    const chat = await msg.getChat();
    await client.sendMessage(msg.from, 'Para finalizar a reserva, realize o pagamento da taxa fixa de R$20,00.');

    const qrUrl = 'https://gerarqrcodepix.com.br/api/v1?nome=PatriciaMoon&cidade=SãoPaulo&saida=qr&chave=patriciamoon@gmail.com';
    const codigoPix = '00020126440014BR.GOV.BCB.PIX0122PATRICIAMOON@GMAIL.COM520400005303986540520.005802BR5913Patricia Moon6009Sao Paulo610801310-91362180514TokkiTokkiCafe6304803A';

    try {
        await delay(2000);
        await chat.sendStateTyping();
        await delay(1000);
        await enviarQrCodePixComoImagem(client, msg.from, qrUrl, 'Efetue o pagamento através desse QR Code:');
    } catch (err) {
        console.error('Erro ao enviar imagem do QR Code:', err);
        await client.sendMessage(msg.from, 'QRCODE:\n' + qrUrl);
    }

    await delay(2000);
    await chat.sendStateTyping();
    await delay(1000);
    await client.sendMessage(msg.from,'Código copia e cola:\n' + codigoPix + '\nApós o pagamento, digite *Pago* para confirmar a reserva ou *Cancelar* para cancelar.');

    // Passa para a fase de confirmação de pagamento
    estadoUsuario[msg.from].passo = 'aguardando_confirmacao_pagamento';
}

// Caso o cliente cancele a reserva
else if (
    estadoUsuario[msg.from] && estadoUsuario[msg.from].passo === 'aguardando_confirmacao_pagamento' && msg.body.toLowerCase() === 'cancelar') {
    
    const chat = await msg.getChat();
    await delay(2000);
    await chat.sendStateTyping();
    await delay(1000);
    await client.sendMessage(msg.from,'Sua reserva foi cancelada =(\nVamos aguardar outra oportunidade para você estar aqui na nossa toca.');

}

else if (
    estadoUsuario[msg.from] && estadoUsuario[msg.from].passo === 'aguardando_confirmacao_pagamento' && msg.body.toLowerCase() === 'pago') {
    
    // Assegura que o objeto de estado existe antes de usá-lo
    const reservaFinal = estadoUsuario[msg.from];

    // Se a reserva não estiver completa, você pode tratar isso aqui
    if (!reservaFinal || !reservaFinal.pessoas || !reservaFinal.data || !reservaFinal.horario) {
        await client.sendMessage(msg.from, 'Parece que houve um erro com sua reserva. Por favor, tente novamente digitando *5*.');
        delete estadoUsuario[msg.from];
        return;
    }

    const chat = await msg.getChat();
    await delay(2000);
    await chat.sendStateTyping();
    await delay(1000);
    await client.sendMessage(msg.from,'Reserva confirmada!\nEstaremos te aguardando aqui na nossa toca, agradecemos a sua preferência.');

    const contact = await msg.getContact();
    const nome = contact.pushname;
    
    // Chama a função para registrar a reserva no Make
    await registrarReserva(nome, reservaFinal.pessoas, reservaFinal.data, reservaFinal.horario);

    // Apaga os dados do usuário após a confirmação
    delete estadoUsuario[msg.from];
}

});