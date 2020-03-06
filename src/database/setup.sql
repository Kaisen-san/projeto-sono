CREATE TABLE IF NOT EXISTS forms (
  id SERIAL PRIMARY KEY NOT NULL,
  password CHAR(60) NOT NULL,
  year SMALLINT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY NOT NULL,
  type SMALLINT NOT NULL,
  headers TEXT NOT NULL,
  answers TEXT NOT NULL,
  triggers TEXT,
  report TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS form_questions (
  id_form SERIAL NOT NULL REFERENCES forms(id) ON DELETE RESTRICT,
  id_question SERIAL NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
  PRIMARY KEY (id_form, id_question)
);

CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY NOT NULL,
  id_form SERIAL NOT NULL REFERENCES forms(id) on DELETE RESTRICT,
  accept_terms BOOLEAN NOT NULL,
  year SMALLINT NOT NULL,
  state CHAR(2) NOT NULL,
  report TEXT NOT NULL,
  CONSTRAINT state_check CHECK (state IN ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO')) 
);

CREATE TABLE IF NOT EXISTS results_users (
  id SERIAL PRIMARY KEY NOT NULL,
  password CHAR(60) NOT NULL
);

INSERT INTO forms (year, password) VALUES (2020, '$2b$10$ZD2sDuvM3fr2HlWgMu8Ml.zwApf4S2/LMlkSV2wWfkVPCRcr0ITzy');

INSERT INTO results_users (password) VALUES ('$2b$10$aO.ESDdlZWzhxDUxaCyvcuGDsV3e6KlU5TwI7dy5/WVv14yf/f2rK');

INSERT INTO questions (type, headers, answers, triggers, report) VALUES
(0, 'Cidade:|Estado:|Local de resposta:|Idade:|Peso (kg):|Altura (cm):|Sexo:', 'text;AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO;text;numeric;numeric;numeric;Masculino|Feminino', NULL, 'Cidade;Estado;LocalQuestionario;Idade;Peso;Altura;Sexo'),
(9, 'Você tem filhos?|Quantos filhos:|Qual a idade deles:', 'Sim|Não;numeric;numeric', '1|0', 'Filhos;QuantosFilhos;IdadeFilhos'),
(2, 'Qual a sua ocupação atual?|Se empregado, qual sua profissão?', 'Estudante|Empregado(a)|Aposentado(a)|Desempregado(a)|Não quero informar;text', '0|1|0|0|0', 'Ocupação;Profissão'),
(3, 'Quantas horas você dorme por noite?|Nos dias da semana (trabalho/estudo):|Nos dias do final de semana (folga):', 'numeric;numeric', NULL, 'SonoSemana;SonoFDS'),
(2, 'Você está satisfeito com a duração do seu sono durante a semana ou dias de trabalho ou estudo?|Se não, quantas horas gostaria de dormir?', 'Sim|Não|Eu não sei;numeric', '0|1|0', 'SatisfeitoSemana;GostariaSemana'),
(2, 'Você está satisfeito com a duração do seu sono durante o final de semana ou dias de folga?|Se não, quantas horas gostaria de dormir?', 'Sim|Não|Eu não sei;numeric', '0|1|0', 'SatisfeitoFDS;GostariaFDS'),
(1, 'Com qual frequência você acorda muito cedo e não consegue voltar a dormir?', 'Nunca|Raramente|Às vezes|Sempre|Eu não sei', NULL, 'FreqAcorda'),
(1, 'Com qual frequência você acorda a noite para ir ao banheiro?', 'Nunca|Raramente|Às vezes|Sempre|Eu não sei', NULL, 'FreqBanheiro'),
(1, 'Como você classifica a qualidade do seu sono?', 'Muito ruim|Ruim|Boa|Muito boa|Eu não sei', NULL, 'QualidadeSono'),
(1, 'Como está o seu nível de desempenho cognitivo (memória, concentração e capacidade de aprender)?', 'Muito ruim|Ruim|Boa|Muito boa|Eu não sei', NULL, 'Cognição'),
(7, 'Você realiza cochilos durante o dia?|Qual a frequência por semana com que você realiza os cochilos?|Quantas vezes por dia você cochila?', 'Sim|Não|Eu não sei;Menos de uma vez|Uma ou duas vezes|Três ou mais vezes|Eu não sei;Uma vez|Duas vezes|Três ou mais vezes|Eu não sei', '1|0|0', 'Cochilo;FreqCochilo;VezesCochilo'),
(6, 'Você tem problemas de sono?|Quais:|Outro(s):|Qual a frequência que esse(s) problema(s) acontece(m)?', 'Sim|Não|Eu não sei;Ronco|Sonolência excessiva diurna|Acordar com dor de cabeça|Acordar sentindo-se cansado|Dificuldade para iniciar o sono|Acordar durante a noite|Apneia do sono|Pesadelos|Sonâmbulismo|Desconforto nas pernas|Acordar e não voltar a dormir|Ranger os dentes durante o sono;Menos de uma vez na semana|Uma ou duas vezes na semana|Três ou mais vezes na semana|Eu não sei', '1|0|0', 'ProblemasSono;Ronco;SED;DorCabeca;Cansaço;IniciarSono;AcordarNoite;Apneia;Pesadelos;Sonambulismo;SPI;Insonia;Bruxismo;Outros;FreqProblemasSono'),
(8, 'Você ronca?|Com qual frequência na semana?', 'Sim|Não|Eu não sei;Raro (até 1 vez)|Eventual (de 2 a 3 vezes)|Frequente (mais de 3 vezes)', '1|0|0', 'Ronca;FreqRonca'),
(1, 'Considerando que você tem que trabalhar/estudar por 8 horas seguidas e está totalmente livre para organizar o seu tempo, que horário você preferiria se levantar?', 'Antes das 6:30 da manhã|6:30 - 7:29|7:30 - 8:29|8:30 ou mais', NULL, 'PrefereLevantar'),
(1, 'Considerando que você tem que trabalhar/estudar por 8 horas seguidas e está totalmente livre para organizar o seu tempo, que horário você preferiria ir para a cama?', 'Antes das 21:00|21:00 - 21:59|22:00 - 22:59|23:00 ou mais', NULL, 'PrefereCama'),
(1, 'Qual seria a dificuldade caso tivesse que ir para a cama às 21:00?', 'Muito difícil - ficaria acordado por um longo tempo|Pouco difícil - ficaria acordado por algum tempo|Pouco fácil - ficaria acordado por pouco tempo|Fácil - adormeceria praticamente no mesmo instante', NULL, 'Cama21h'),
(1, 'Se você sempre tivesse que levantar às 06:00, como você acha que seria?', 'Muito difícil e desagradável|Pouco difícil e desagradável|Um pouco desagradável, mas não um grande problema|Fácil - nenhum problema', NULL, 'Levantar6h'),
(1, 'Quando você começa a sentir os primeiros sinais de cansaço e necessidade de dormir?', 'Antes das 21:00|21:00 - 21:59|22:00 - 22:59|23:00 ou mais', NULL, 'SinaisCansaço'),
(1, 'Quanto tempo você costuma levar para "recuperar suas energias" de manhã após levantar de uma noite de sono?', '0 - 10 min|10 - 20 min|20 - 40 min|Mais de 40 min', NULL, 'EnergiaManhã'),
(1, 'Indique até que ponto você se considera um indivíduo ativamente matutino ou vespertino.', 'Definitivamente ativo de manhã (alerta de manhã e cansado a tarde)|Um pouco ativo de manhã|Um pouco ativo à noite (manhã cansado e alerta à tarde)|Definitivamente ativo a noite (cansado pela manhã e alerta a tarde)', NULL, 'MatVesp'),
(1, 'Caso tenha mais de 50 anos, por favor, indique se houve alteração em ser matutino ou vespertino.', 'Era definitivamente ativo de manhã (alerta de manhã e cansado a tarde)|Era um pouco ativo de manhã|Era um pouco ativo à noite (manhã cansado e alerta à tarde)|Era definitivamente ativo a noite (cansado pela manhã e alerta a tarde)|Não houve alteração|Não tenho mais de 50 anos', NULL, 'AltMatVesp'),
(5, 'O que você costuma fazer antes de dormir (cerca de 1 hora antes)?', 'Utilizar aparelhos eletrônicos (celular, computador, tablet, e-reader)|Assistir TV|Praticar atividades físicas relaxantes (yoga, meditação)|Consome bebidas alcoólicas (vinho, cerveja, licor, etc)|Praticar exercícios físicos extenuantes (musculação, corrida)|Ficar na cama pensando em questões não resolvidas|Realiza refeições pesadas|Lê um livro na cama (não inclui livros digitais: e-books)|Consumir cafeína ou nicotina|Realizar caminhada|Jogos físicos (cartas, tabuleiro, etc)', NULL, 'ApEletrônicos;TV;AtivRelaxantes;Álcool;ExercExtenuantes;FicarCama;RefPesadas;LivroCama;CafeinaNicotina;Caminhada;Jogos'),
(5, 'Assinale abaixo quais atividades você concorda que podem prejudicar o seu sono:', 'Utilizar aparelhos eletrônicos (celular, computador, tablet, e-reader)|Assistir TV|Praticar atividades físicas relaxantes (yoga, meditação)|Consome bebidas alcoólicas (vinho, cerveja, licor, etc)|Praticar exercícios físicos extenuantes (musculação, corrida)|Ficar na cama pensando em questões não resolvidas|Realiza refeições pesadas|Lê um livro na cama (não inclui livros digitais: e-books)|Consumir cafeína ou nicotina|Realizar caminhada|Uso de determinados medicamentos|Jogos físicos (cartas, tabuleiro, etc)|Levantar para ir ao banheiro|Cochilar durante o dia', NULL, 'PrejudicaApEletrônicos;PrejudicaTV;PrejudicaAtivRelaxantes;PrejudicaÁlcool;PrejudicaExercExtenuantes;PrejudicaFicarCama;PrejudicaRefPesadas;PrejudicaLivroCama;PrejudicaCafeinaNicotina;PrejudicaCaminhada;PrejudicaMedicamentos;PrejudicaJogos;PrejudicaBanheiro;PrejudicaCochilar'),
(1, 'Você tem dificuldades para iniciar o sono, manter o sono ou despertar antes do horário programado sem conseguir retomar o sono?', 'Sim|Não|Eu não sei', NULL, 'DificuldadesSono'),
(1, 'Você participou ou está participando de algum evento da Semana do Sono 2020?', 'Sim|Não|Eu não sei', NULL, 'ParticipaSemanaSono');

SELECT id FROM forms;
SELECT id from questions;

INSERT INTO form_questions (id_form, id_question) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(1, 21),
(1, 22),
(1, 23),
(1, 24),
(1, 25);
