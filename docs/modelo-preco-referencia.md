# Modelo de Preço de Referência por Acessibilidade (PRA) — v0.2

Data de referência dos factos: **28 de outubro de 2026**. Estado: proposta com decisões já tomadas (secção 2), a rever por alguém de avaliação imobiliária ou economia antes do lançamento. Números marcados *(a confirmar)* não foram verificados em fonte primária nesta sessão.

## 1. Posicionamento

O site não diz "este é o valor de mercado". Diz algo honesto e defensável:

> **Este é o preço que o rendimento local consegue suportar, corrigido pelo estado e pelas condições do imóvel, comparado com o que está a ser pedido.**

- O modelo **ignora de propósito a procura**: mede o que é *suportável*, não o que o mercado *aceita*. A página diz isto com todas as letras.
- Mostra sempre dois números lado a lado: a mediana de mercado (INE, factual) e o preço de referência corrigido (modelo, normativo), com a decomposição do que os separa.
- Duas camadas: (1) **Esforço**, aritmética sobre dados oficiais, sem coeficientes nossos; (2) **Referência corrigida**, o modelo.
- Linguagem: "acima da referência", "desproporcionado". Nunca "ilegal" como veredicto, nunca nomes de vendedores ou agências.

## 2. Decisões (com os factos de outubro de 2026 que as sustentam)

| # | Decisão | Fundamento |
|---|---|---|
| 1 | **Nome:** "Preço de Referência" (PR), subtítulo "por acessibilidade". Não usar "justo". | É normativo, e o próprio vocabulário institucional usa "acessibilidade" (Plano Europeu de Habitação Acessível, dez. 2025). |
| 2a | **Esforço de referência `e` = 30%** na compra e na renda. Mostrar sempre ao lado o **teto do Banco de Portugal: 45%** com juro +1,5 p.p. | O BdP baixou o limite de 50% para 45% a 1/8/2026; a taxa de esforço média dos novos créditos em 2025 foi 29,6%. Ou seja, 30% é o que as famílias já pagam em média e 45% é o máximo tolerado, não o razoável. |
| 2b | **Taxa `r` = 3,0%, prazo 30 anos, LTV 90%.** Teste de stress a 4,5%. Opção de 40 anos para ≤35 anos. | Taxa média dos novos créditos à habitação ≈ 3,0% (BdP, set. 2026); Euribor 12 meses 3,22–3,26% (21–27/10/2026) e a subir; maturidade máxima 40 anos (≤35 anos) e 35 (>35). |
| 2c | **Correção de mercado `σ` = 0,30** (intervalo de sensibilidade 0,20–0,35). | Estimativas: Comissão Europeia ~35% (out. 2025) e ~25% (dez. 2025); FMI ~20%; BdP: rácio preço/renda 33% acima da média de longo prazo (fim de 2024). Desde então os preços subiram +16,8% (2025) e +18,4% homólogo no 2.º trim. 2026 contra salários nominais ~+5,6%, pelo que o hiato terá aumentado. Mantemos 0,30 como valor conservador e revemos quando saírem estimativas novas. |
| 3 | **Arrendamento: incluir renda de referência** e compará-la com o **teto oficial do Arrendamento Acessível** do concelho. | A **Portaria 454/2026/1** (13/10/2026) fixa rendas máximas por tipologia e concelho (Lisboa: T0 785 € a T5 2 066 €; Porto: T0 652 € a T5 1 715 €, com majorações de 10%). É uma referência pública, não nossa. Rendas medianas em novos contratos: 10,17 €/m² (+10,2% homólogo), muito acima dos salários (+5,6%). |
| 4a | **Coeficiente "sem iluminação/ventilação natural" = 0,50**, marcado como hipótese do projeto. | É o degrau mais baixo da escala legal de conservação (péssimo = 0,5): sem janela não pode valer mais do que "péssimo". O RGEU foi declarado revogado mas **continua em vigor até haver novo regulamento técnico** (DL 10/2024, alterado pelo DL 108/2026; novo RJUE em vigor desde 1/10/2026), por isso a página diz "pode não cumprir as regras de iluminação e ventilação", não "é ilegal". |
| 4b | **Ruína:** `C_c = max(0,15; 1 − 1,15 × capex / B)`, com `capex` = **1 000 €/m²** por defeito (sensibilidade 750–1 400), marcado como hipótese. | Não há custo oficial de reabilitação por m² encontrado; a referência fiscal é o valor médio de construção de 570 €/m² (Portaria 471/2025/1, +7%), que é piso e não preço de obra de reabilitação; fontes de mercado indicam 750–2 000 €/m² (baixa confiança). |
| 5 | **Rendimento por concelho:** mediana do rendimento bruto declarado por sujeito passivo (INE, "Estatísticas do Rendimento ao Nível Local"), **atualizada** com o crescimento da remuneração média até ao trimestre do preço. Perfil de compra por defeito: **casal com dois rendimentos medianos**; alternativa "uma pessoa". | É a única série oficial por município com mediana. Última edição encontrada: referência 2023 (nacional 11 446 €; Lisboa 14 282 €; Oeiras 15 862 €), e uma notícia sobre 2024 (nacional 12 316 €) ainda por confirmar município a município. Usar mediana e não média evita inflacionar o rendimento por causa de salários altos. |
| 6 | **Peso das âncoras 50/50**, a mostrar sempre uma faixa (30/70 a 70/30). | Sem evidência que justifique outro peso; a faixa torna a incerteza visível. |

## 3. Evidência de partida (data de verificação: 28/10/2026)

| Facto | Valor | Fonte | Confiança |
|---|---|---|---|
| Preço mediano de venda, 2.º trim. 2026 | **2 445 €/m²** (+18,4% homólogo; +4,6% em cadeia); transações −9% | INE via [Observador](https://observador.pt/2026/10/23/precos-das-casas-subiram-184-no-segundo-trimestre-acelerando-em-10-dos-24-maiores-municipios-segundo-o-ine/), [Diário de Leiria](https://www.diarioleiria.pt/2026/10/23/preco-mediano-das-casas-sobe-184-para-2-445-euros-por-metro-quadrado/) | Alta |
| Lisboa e Grande Lisboa | Lisboa 5 192–5 299 €/m²; Grande Lisboa 4 030 €/m² | [ECO](https://eco.sapo.pt/2026/10/24/preco-das-casas-em-lisboa-e-cascais-acima-de-5-000-euros-m2/) | Média (duas versões) |
| Compradores estrangeiros vs residentes | 3 182 vs 2 421 €/m² | [DN](https://www.dn.pt/economia/preos-das-habitaes-subiram-184-em-um-ano-mas-desaceleram-em-lisboa-e-no-porto) | Média |
| Preço mediano 2025 | 2 076 €/m² (+16,8%) | [Dinheiro Vivo](https://dinheirovivo.dn.pt/economia/preos-das-casas-sobem-168-em-2025-para-2076-eurosm2) | Alta |
| Renda mediana novos contratos, 2.º trim. 2026 | **10,17 €/m²** (+10,2%); Lisboa 17,79; Grande Lisboa 15,24; AM Porto 10,83 | INE via [Renascença](https://rr.pt/noticia/economia/2026/09/29/renda-mediana-de-novos-contratos-sobe-102-para-1017-eurosm2/487213/), [Observador](https://observador.pt/2026/09/29/rendas-medianas-em-portugal-aceleram-para-subida-de-102-em-termos-homologos-diz-ine/) | Alta |
| Salário mínimo 2026 | 920 € brutos × 14 (≈ 955 €/mês líquidos equivalentes, a confirmar) | [Montepio](https://www.montepio.org/ei/pessoal/emprego-e-formacao/salario-medio-em-portugal-qual-o-valor/) | Alta |
| Remuneração bruta média | 1 694 € (2025); 1 835 € (2.º trim. 2026, provisório, fonte secundária) | INE via Montepio, [Simula](https://simula.pt/simuladores/simulador_salario_medio) | Média |
| Rendimento mediano declarado (INE) | 2023: nacional 11 446 €, Lisboa 14 282 €, Oeiras 15 862 €; 2024: nacional 12 316 € | [Observador](https://observador.pt/2025/07/25/oeiras-mantem-se-como-o-municipio-com-valor-de-rendimentos-mais-elevado/), [Dinheiro Vivo](https://dinheirovivo.dn.pt/economia/rendimento-mediano-superou-mdia-nacional-em-74-municpios-em-2024) | Média |
| Limite de esforço BdP | 45% desde 1/8/2026, com juro +1,5 p.p.; até 10% do crédito semestral pode exceder | [ECO](https://eco.sapo.pt/2026/07/02/banco-de-portugal-aperta-regras-do-credito-a-partir-de-agosto/), [Millennium](https://www.millenniumbcp.pt/afinal-contas/banco-portugal-reforca-regras-credito-habitacao) | Alta (confirmar exceções) |
| Euribor | 12 meses 3,22–3,26% (out. 2026) | [ECO](https://eco.sapo.pt/2026/10/21/euribor-continua-a-subir-a-tres-a-seis-e-a-12-meses/), [ComparaJá](https://www.comparaja.pt/credito-habitacao/euribor-hoje) | Alta |
| Sobrevalorização | CE 35% (out. 2025), ~25% (dez. 2025); FMI ~20%; BdP preço/renda +33% | [Econews](https://econews.pt/2025/10/16/houses-in-portugal-are-overvalued-by-35-warns-european-commission/), [Idealista](https://www.idealista.pt/news/node/59876), [BdP](https://www.bportugal.pt/en/publicacao/financial-stability-report-may-2025) | Média |
| Esforço excessivo (≥40%) em arrendatários a preço de mercado | 30,3% (2024) | Eurostat via [Trading Economics](https://tradingeconomics.com/european-union/housing-cost-overburden-rate-tenant-rent-at-market-price-eurostat-data.html) | Média |
| Rendas máximas do Arrendamento Acessível | Portaria 454/2026/1, atualizadas a 1/1 pelo coeficiente do NRAU | [Doutor Finanças](https://www.doutorfinancas.pt/?p=216245), [Sábado](https://www.sabado.pt/dinheiro/detalhe/renda-acessivel-para-um-t0-em-lisboa-sera-de-785-euros-um-t5-pode-ir-ate-aos-2-066) | Média (tabela completa a extrair do [Diário da República](https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/legislacao/diplomas_legislativos/Documents/portaria-454-2026-1.pdf)) |
| Limite de 2% em novos contratos de imóveis arrendados nos últimos 5 anos | Mais Habitação; até fim de 2029 (a confirmar se ainda em vigor) | [DECO Proteste](https://www.deco.proteste.pt/dinheiro/arrendamento/noticias/mais-habitacao-rendas-de-novos-contratos-limitadas) | Baixa |
| Escala Demographia | ≤3,0 acessível; 3,1–4,0; 4,1–5,0; ≥5,1 severamente inacessível | [Median multiple](https://en.wikipedia.org/wiki/Median_multiple) | Alta |
| Conservação (NRAU) | 1,2 / 1,0 / 0,9 / 0,7 / 0,5 | [DL 156/2006](https://diariodarepublica.pt/dr/detalhe/decreto-lei/156-2006-538618) (mantida pelo DL 266-B/2012) | Alta |
| Vetustez (CIMI art. 44) | <2 anos 1,00; 2–8 0,90; 9–15 0,85; 16–25 0,80; 26–40 0,75; 41–50 0,65; 51–60 0,55; >60 0,40 | [Portal das Finanças](https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cimi/Pages/cimi44.aspx) | Alta |
| Valor médio de construção (IMI) | 570 €/m² em 2026; Vc = 570 × 1,25 (terreno) = 712,50 €/m² | [Observador](https://observador.pt/2025/12/26/imi-das-casas-novas-ou-reconstruidas-e-das-reavaliacoes-vai-aumentar-em-2026-preco-medio-de-construcao-sobe-7/) | Média |
| RGEU | declarado revogado, em vigor até novo regulamento técnico; RJUE novo desde 1/10/2026 | [AC Arquitetos](https://www.ac-arquitetos.com/post/rgeu-foi-revogado-ou-nao-esclarecimento-sobre-o-que-esta-em-vigor), [Idealista](https://www.idealista.pt/news/node/76837) | Média |
| Referências internacionais | Alemanha: renda ≤ referência +10% (travão), >+20% contraordenação, >+50% crime; Países Baixos: renda máxima por pontos (área, energia, qualidade) | [Berlin.de](https://www.berlin.de/ba-mitte/politik-und-verwaltung/aemter/amt-fuer-buergerdienste/buergeraemter/bereich-wohnen/artikel.1451257.php), [WWS](https://findify.nl/articles/wws-points-explained-netherlands-rent-system/) | Média |

Lacunas: série municipal de rendimento mediano mais recente (2024) a extrair do INE; custo real de reabilitação por m²; tabela completa da Portaria 454/2026/1 (T1 a T4 por concelho); versão final das exceções do limite de 45%; `oecd.org` e `growinportugal.com` não são acessíveis a partir desta sessão (precisam de ser autorizados nas definições de rede para ler a OCDE de 2026).

## 4. Camada 1 — Indicadores de esforço (sem coeficientes nossos)

**Compra** (taxa `r`, prazo `n`, LTV):
- `prestação = P × LTV × a(r, n)`, `a = r_m / (1 − (1 + r_m)^−n)`.
- `% do rendimento líquido do agregado = prestação / Y_hh`; comparar com 30% (referência) e 45% (teto do BdP).
- `prestação em stress` com `r + 1,5 p.p.`.
- `múltiplo preço/rendimento = P / (n_rend × rendimento anual mediano)`, na escala Demographia.

**Renda:**
- `rendimento líquido necessário = renda / 0,30`, em euros e em múltiplos do salário mínimo líquido.
- Comparação com o teto do Arrendamento Acessível do concelho e tipologia.

Exemplo: um T0 por 800 € exige 2 667 €/mês líquidos, ≈ 2,8 salários mínimos líquidos. O teto acessível de um T0 em Lisboa é 785 €.

## 5. Camada 2 — Preço de Referência (PR)

### 5.1 Base por m² (duas âncoras)

```
S1 = m_z / (1 + σ)                      m_z = mediana INE da zona/tipologia, σ = 0,30
Y_hh = n_rend × g_z × f_SS × u_z / 12   g_z = rendimento mediano declarado do município
                                        f_SS ≈ 0,89, n_rend = 2 (casal) ou 1
                                        u_z = atualização (crescimento da remuneração média
                                        desde o ano de g_z até ao trimestre do preço)
L  = e × Y_hh / a(r, n)                 e = 0,30, r = 3,0%, n = 360
S2 = (L / LTV) / A_tipo
B_z = min( m_z , 0,5·S1 + 0,5·S2 )      faixa: 0,3/0,7 e 0,7/0,3 (também limitada a m_z)
```

**Como ler os números.** A *mediana de mercado* (€/m², INE) é o que se pede e paga hoje. O *preço de referência* (€/m²) é a média de S1 (mediana ÷ (1+σ)) e S2 (o que o rendimento local paga). O *excesso* = mediana ÷ referência − 1 no mapa, e preço do anúncio ÷ referência do imóvel − 1 na calculadora: nunca se compara diretamente com o salário, que só entra em S2. O σ não mede especulação: é uma correção estatística nacional (hipótese do projeto, intervalo de sensibilidade 0,20 a 0,35, mostrado ao lado de cada resultado).

### 5.2 Coeficientes do imóvel (relativos a "bom estado, 9–15 anos")

`PR = B_z × A × C_c × C_v × C_luz × C_q × s(A)`

| Coeficiente | Valores | Origem |
|---|---|---|
| `C_c` conservação | 1,2 / 1,0 / 0,9 / 0,7 / 0,5 | Lei (NRAU) |
| `C_c` ruína | `max(0,15; 1 − 1,15 × capex / B_z)`, capex 1 000 €/m² | **Hipótese do projeto** |
| `C_v` vetustez | tabela CIMI normalizada a 0,85 = 1,00 | CIMI art. 44 |
| `C_luz` iluminação/ventilação | sem janela ou vão < 1/10 da área: 0,50 | RGEU art. 71 (em vigor até novo regulamento) + **hipótese** |
| `C_q` qualidade e conforto | ±0,05–0,10 por item (elevador, exterior, garagem, classe energética), limite 0,85–1,20 | **Hipótese**, a calibrar com CIMI art. 43 e pontos holandeses |
| `s(A)` tamanho | `(A / A_ref,tipo)^(−0,10)`, limitado a [0,90; 1,25] | **Hipótese** |

### 5.3 Renda de referência

```
R_ref = A × min( ρ_mercado,z ,  ρ_acess,z ) × C_c × C_v × C_luz × s(A)
ρ_acess,z = e × Y_hh,z(perfil) / A_tipo      perfil = casal (por defeito) ou uma pessoa; e = 30%
Comparar também com o teto RSAA (Portaria 454/2026/1)
```
**Faixa de esforço (v0.2.2).** O resultado mostra a renda de referência com esforço de 30% (referência) e de 50% (o que muitos agregados já pagam), e o excesso em cada extremo. Ao contrário da v0.2, a renda usa o perfil do agregado (casal por defeito, interruptor no formulário) e a vetustez do edifício: com o rendimento de uma só pessoa um T3 ficava com uma referência irrealista (T3 de 90 m² em Matosinhos: 249 €/mês contra 563 € com o casal). O limite de 50% não é um teto legal: é o limiar a partir do qual a renda deixa de ser comportável para a maioria.

**Piso do senhorio (v0.2.3).** Informação de contexto, fora do veredicto: a renda mínima para cobrir o crédito do imóvel e o imposto, `piso = prestação ÷ (1 − imposto)`, com a prestação calculada sobre `mediana de venda × área` (financiamento 90%, juro e prazo da compra) e imposto de 25% (taxa autónoma sobre rendas; editável). Assume compra a preço de mercado de hoje, por isso é um teto superior do piso para casas compradas há mais tempo; não inclui IMI, condomínio, seguro nem manutenção.

`ρ_mercado,z`: renda mediana INE (10,17 €/m² a nível nacional no 2.º trim. 2026).

### 5.4 Resultado

```
X = P_pedido / PR − 1
Margem acima da faixa defensável = max(0, P_pedido − 1,10 × PR) / P_pedido
```

| X | Leitura |
|---|---|
| ≤ +10% | Dentro da tolerância |
| +10% a +20% | Acima do razoável |
| +20% a +50% | Inflacionado |
| > +50% | Desproporcionado |

Limiares inspirados na Alemanha (10/20/50%). Em Portugal não são limites legais; a página diz isso.

**Limite pela mediana (v0.2.1, 28/10/2026).** Ao correr o modelo com os dados reais do INE, concelhos de preços muito baixos (ex.: Vinhais, 325 €/m²) davam uma referência acima do mercado (≈ 940 €/m²), porque o rendimento local suportaria mais do que ali se pede. Como o objetivo é detetar preços acima do que é razoável, e não sugerir que se peça mais, a base é limitada à mediana do mercado (`min`). Efeito: em zonas baratas a referência é a própria mediana; nas restantes nada muda.

**Nota sobre as medianas.** O INE publica a mediana do trimestre (nacional 2 445 €/m² no 2.º trim. 2026) e a mediana dos últimos 12 meses (nacional 2 264 €/m²; Lisboa 5 192 €/m²). O site usa a série dos 12 meses, a única disponível por concelho e menos sensível a trimestres atípicos. O exemplo abaixo mistura as duas (nacional trimestral, Lisboa 12 meses); os valores do site usam sempre a de 12 meses. O INE **não publica mediana por tipologia** ao nível local: T0 a T4+ partilham a mediana da zona e diferem só na área de referência do S2.

## 6. Exemplo com dados de outubro de 2026

Entradas: T2 de 80 m² em bom estado, pedido = mediana municipal do 2.º trim. 2026 × 80 m²; rendimentos de 2023 atualizados 3 anos a +5,5%/ano (×1,174); e = 30%, r = 3,0%, 30 anos, LTV 90%, casal com dois rendimentos medianos; σ = 0,30.

| | Portugal | Lisboa |
|---|---|---|
| Mediana de mercado | 2 445 €/m² | 5 192 €/m² |
| Pedido (80 m²) | 195 600 € | 415 360 € |
| Rendimento líquido do casal (2023) | 1 698 €/mês | 2 118 €/mês |
| Rendimento atualizado (×1,174) | 1 993 €/mês | 2 486 €/mês |
| Preço acessível S2 | ≈ 1 970 €/m² | ≈ 2 460 €/m² |
| S1 (mediana / 1,30) | 1 881 €/m² | 3 994 €/m² |
| Base B (50/50) | ≈ 1 925 €/m² | ≈ 3 226 €/m² |
| **Preço de referência** | **≈ 154 000 €** | **≈ 258 000 €** |
| **Excesso X** | **≈ +27%** → inflacionado | **≈ +61%** → desproporcionado |
| Prestação do pedido | ≈ 742 €/mês (≈ 37% do rendimento) | ≈ 1 576 €/mês (≈ 63%) |
| Prestação em stress (4,5%) | | ≈ 1 894 €/mês |
| Múltiplo preço/rendimento (bruto, 2023) | 8,5 | 14,5 |

Valores indicativos: os rendimentos de 2023 são usados com atualização aproximada; a versão final usa a série municipal mais recente e o índice real de remunerações do INE. A **faixa** (pesos 30/70 a 70/30) dá, para Lisboa, 234 000 a 283 000 € (corrigido: a versão anterior indicava 213 000 a 274 000 €, que não resultava da fórmula; verificado em `packages/model`).

Ruína na mesma zona (Lisboa, B ≈ 3 226): `C_c = max(0,15; 1 − 1,15 × 1 000 / 3 226) ≈ 0,64`, referência ≈ 165 000 €.

## 7. Salvaguardas de honestidade

1. A Metodologia mostra fórmulas, parâmetros e fontes e diz que o modelo ignora a procura.
2. Parâmetros editáveis (esforço, σ, taxa, prazo, perfil 1 ou 2 rendimentos); o resultado recalcula e mostra "com os seus parâmetros".
3. Cada resultado mostra a decomposição (mercado → correção → rendimento → estado → tamanho) e a confiança dos dados.
4. Hipóteses próprias levam selo "hipótese do projeto".
5. Registo público de versões (`CHANGELOG`) e dados abertos.
6. Linguagem prudente; sem nomes de vendedores ou imobiliárias; sem guardar anúncios.
7. Revisão externa antes de lançar.

## 8. Validação

- Sanidade em 20 concelhos: PR entre S2 e a mediana para imóveis em bom estado.
- Sensibilidade: σ 0,20–0,35, e 0,25–0,40, r 2–5%, pesos 0–1; publicar a faixa.
- Casos reais anonimizados (ruínas, micro-T0, T0 sem janela) comparados com um avaliador.
- Reavaliar o modelo quando saírem: INE rendimento 2024/2025 por município; relatórios de estabilidade financeira do BdP (novembro); nova estimativa da Comissão.

## 9. Pontos ainda em aberto (menores)

1. Extrair a tabela completa da Portaria 454/2026/1 (T1 a T4) e a série municipal de rendimento de 2024.
2. Confirmar se o limite de 2% em novos contratos continua em vigor.
3. Fonte para o custo de reabilitação por m².
4. Calibrar `C_q` e `s(A)` com dados reais.
