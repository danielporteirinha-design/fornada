const fs=require("fs");
const html=fs.readFileSync(process.argv[2]||"fornada_20260813.html","utf8");
const js=html.split("<script>")[1].split("</script>")[0];
const criados={};
// ESTRITO: espelha o navegador — id inexistente devolve null.
const corpo=html.split("</style>")[1].split("<script>")[0];
const existe=new Set([...corpo.matchAll(/id="([\w-]+)"/g)].map(m=>m[1]));

function elem(id){return {id,value:"",textContent:"",className:"",style:{},
  get innerHTML(){return this._h||""},
  set innerHTML(v){this._h=v;
    [...String(v).matchAll(/id="([\w-]+)"/g)].forEach(m=>existe.add(m[1]))},
  classList:{add(){},remove(){},toggle(){}},querySelector(){return elem("q")},
  querySelectorAll(){return []},replaceWith(){},dataset:{},onclick:null,onchange:null,oninput:null}}
const doc={getElementById(id){
    if(!existe.has(id)) return null;
    if(!criados[id]) criados[id]=elem(id);
    return criados[id]},
  createElement:()=>elem("t"),body:{appendChild(){}}};
const nav={}; const win={open(){}};
const FR=function(){this.readAsDataURL=function(){this.result="data:image/jpeg;base64,AAA";this.onload&&this.onload()}};
const api=new Function("document","navigator","localStorage","setTimeout","clearTimeout","win","FileReader","URL","confirm","fetch",
  js.replace(/window\.open/g,"win.open")+"\n;return{D,store,VOZ,botaoVoz,ditar,interpretar,norm,renderAssist,montarPromptCurto,planoMes,legenda,precoCombo,escolhidoBeb,produtosTodos,salvarProdutoLocal,acharProduto,embalado,escolhido,cache,modoDe,sujeitoEN,montarPromptCriar,travaBase,grupoDe,fundoTrocado,ornamentoEN,ornamentoDe,luzLivre,ornamentando,facaNaForma,recheioEN,coberturaEN,rotuloInsumo,caracteristicasDe,cfgDeCaracteristicas,cfgDoProduto,alternarCaracteristica,mudaForma,briefingHTML,requisitosDaFoto,pedeRecheio,pedeCobertura,cfgDoPreset,montarPrompt,comLuvas,transformando,comTalher,render,irPara,renderLote,itensDaSemana,setSlot:v=>{slot=v}};")
  (doc,nav,null,()=>0,()=>{},win,FR,{createObjectURL:()=>"blob:x",revokeObjectURL(){}},()=>true,()=>Promise.reject(new Error("Failed to fetch")));
const {D,store,VOZ,botaoVoz,ditar,interpretar,norm,renderAssist,montarPromptCurto,planoMes,legenda,precoCombo,escolhidoBeb,produtosTodos,salvarProdutoLocal,acharProduto,embalado,escolhido,cache,modoDe,sujeitoEN,montarPromptCriar,travaBase,grupoDe,fundoTrocado,ornamentoEN,ornamentoDe,luzLivre,ornamentando,facaNaForma,recheioEN,coberturaEN,rotuloInsumo,caracteristicasDe,cfgDeCaracteristicas,cfgDoProduto,alternarCaracteristica,mudaForma,briefingHTML,requisitosDaFoto,pedeRecheio,pedeCobertura,cfgDoPreset,montarPrompt,comLuvas,transformando,comTalher,render,irPara,renderLote,itensDaSemana,setSlot}=api;

let capt=null; nav.clipboard={writeText(t){capt=t;return Promise.resolve()}};
let falhas=0; const erro=(...a)=>{console.log("  FALHA:",...a);falhas++};

let n=0;
for(const [cat,lista] of Object.entries(D.matriz)){
  for(const k of lista){
    n++;
    const cfg=cfgDoPreset(k);
    const p=montarPrompt({cat,verdade:"",nome:"X",preco:"Y",sku:"1"},cfg);
    if(!p||p.length<200) erro("preset curto",cat,k);
    const luvas=comLuvas(cfg), tr=transformando(cfg), ut=comTalher(cfg);
    if(ut&&!p.includes("plain stainless steel")) erro("talher sem trava",k);
    if(ut&&p.includes("No knives, forks, spoons")) erro("conflito talher x sem-utensilio",k);
    if(!ut&&!p.includes("No knives, forks, spoons")) erro("falta trava sem-utensilio",k);
    if(ut&&p.includes("No people, no hands")) erro("conflito talher x sem-pessoas",k);
    if(luvas&&!p.includes("matte black")) erro("luva sem trava",k);
    if(luvas&&p.includes("no hands, no fingers")) erro("conflito luva x sem-pessoas",k);
    if(!luvas&&!tr&&!ut&&!p.includes("Do not cut")) erro("trava fiel ausente",k);
    if((tr||ut)&&p.includes("Do not cut, slice")) erro("trava fiel bloqueando acao pedida",k);
    // Sozinha diz "on its own"; com faca, quem age e a mao — a clausula seria contraditoria.
    const faca=/_faca$/.test(cfg.tr||"");
    if(tr&&!faca&&!p.includes("on its own")) erro("transformacao sem clausula sozinha",k);
    if(faca&&p.includes("on its own")) erro("corte com faca mantendo clausula sozinha",k);
  }
}
for(const s of [0,1]){
  setSlot(s); render();
  if(typeof criados["b1"].onclick!=="function") erro("b1 nao ligado slot",s);
  if(typeof criados["b2"].onclick!=="function") erro("b2 nao ligado slot",s);
  // Escopo enxuto: nada de geracao por API, foto ou chave dentro do app.
  ["bg","fp","vprev","stt","chave","modelo","gasto","b3"].forEach(function(id){
    if(criados[id]) erro("elemento removido reapareceu: "+id);
  });
  criados["b1"].onclick(); const p1=capt;
  criados["b2"].onclick(); const l1=capt;
  if(!p1||p1.length<200) erro("b1 slot",s);
  if(!l1) erro("b2 vazio slot",s);
  // Manha e Story: link vai no sticker, nao no texto. Tarde e feed: link em texto.
  else if(s===1 && !l1.includes("wa.me/5538991702459")) erro("b2 sem link slot",s);
  else if(s===0 && l1.includes("wa.me")) erro("manha nao deve ter link em texto");
  if(l1&&l1.includes("Montes Claros")) erro("cidade slot",s);
}
for(let i=0;i<40;i++){ irPara(1); render(); }
criados["b1"].onclick();
if(!capt||capt.length<200) erro("apos 40 dias de navegacao");

setSlot(0); render();
criados["tm"].oninput({target:{value:"Muitos daqueles que te chamam de louca, sonham em ter a sua coragem!"}});
criados["tnum"].oninput({target:{value:"83"}});
const lm=criados["lg"].value;
if(!lm.includes("Pote da Gratidão")) erro("legenda manha sem cabecalho");
if(!lm.includes("coragem")) erro("mensagem transcrita nao entrou");
if(!lm.includes("Papel nº 83")) erro("numero do papel nao entrou");
console.log("\nLEGENDA MANHA:\n"+lm+"\n");
// Lote da semana
const semana=itensDaSemana();
if(semana.length!==14) erro("lote deveria ter 14 posts, veio "+semana.length);
if(semana.some(function(i){return !i.prompt||i.prompt.length<200})) erro("prompt vazio no lote");
if(new Set(semana.map(function(i){return i.dia})).size!==7) erro("lote nao cobre 7 dias");
const tardes=semana.filter(function(i){return i.modo!=="MENSAGEM"});
if(new Set(tardes.map(function(i){return i.nome})).size<6) erro("pouca variedade de produto na semana");
renderLote();
console.log("lote: "+semana.length+" posts, "+new Set(tardes.map(i=>i.nome)).size+" produtos distintos");

console.log(`${n} presets testados em ${Object.keys(D.matriz).length} categorias`);

// --- briefing da foto ---
const brNormal=briefingHTML({cam:"cam_aproxima",amb:"amb_vapor",hum:"hum_nenhum",
  ut:"ut_nenhum",tr:"tr_nenhuma"});
if(!/recém-saído do forno/.test(brNormal)) erro("briefing: requisito de vapor ausente");
if(/class="al"/.test(brNormal)) erro("briefing: alerta indevido em preset seguro");

const brCrit=briefingHTML({cam:"cam_aproxima",amb:"amb_nada",hum:"hum_nenhum",
  ut:"ut_nenhum",tr:"tr_abre"});
if(!/class="al"/.test(brCrit)) erro("briefing: transformacao sem alerta critico");
if(brCrit.indexOf("!O interior")>=0) erro("briefing: marcador ! vazou para a tela");

const brOrb=briefingHTML({cam:"cam_orbita",amb:"amb_nada",hum:"hum_nenhum",
  ut:"ut_nenhum",tr:"tr_nenhuma"});
if(!/órbita/.test(brOrb)) erro("briefing: alerta de orbita ausente");

// So estas expoem uma face que a foto nao mostra.
const REVELA=["tr_abre","tr_fatia","tr_quebra"];
Object.keys(D.presets).forEach(function(cod){
  const c=cfgDoPreset(cod), b=briefingHTML(c);
  if(REVELA.indexOf(c.tr)>=0 && !/class="al"/.test(b))
    erro("preset "+cod+" revela interior e nao alerta");
  if(c.tr&&c.tr!=="tr_nenhuma"&&REVELA.indexOf(c.tr)<0
     && b.indexOf("inteiro no prato")>=0)
    erro("preset "+cod+" transforma e nao lista pre-requisito");
});
if(!falhas) console.log("briefing: requisitos e alertas conferem");


// --- recheio e cobertura ---
const cfgAbre={cam:"cam_aproxima",amb:"amb_nada",hum:"hum_nenhum",ut:"ut_nenhum",tr:"tr_abre"};
const cfgSeco={cam:"cam_aproxima",amb:"amb_vapor",hum:"hum_nenhum",ut:"ut_nenhum",tr:"tr_nenhuma"};
const prodT={sku:"TESTE",cat:"SALGADOS",nome:"Esfiha",preco:"",verdade:""};

if(!pedeRecheio(cfgAbre)) erro("recheio: campo nao pedido em tr_abre");
if(pedeRecheio(cfgSeco))  erro("recheio: campo pedido sem necessidade");

// Sem recheio: alerta de invencao e prompt sem ancora
if(!/class="al"/.test(briefingHTML(cfgAbre,"TESTE"))) erro("recheio vazio: alerta ausente");
if(/The interior that becomes visible/.test(montarPrompt(prodT,cfgAbre)))
  erro("recheio vazio: ancora vazou para o prompt");

// Com recheio: ancora entra e alerta vira confirmacao
store.set("rec:TESTE","in_carne");
const pr=montarPrompt(prodT,cfgAbre);
if(!/seasoned ground beef, dark brown/.test(pr)) erro("recheio: ancora inglesa nao entrou");
if(!/do not invent a different ingredient/.test(pr)) erro("recheio: instrucao de fidelidade ausente");
const bf=briefingHTML(cfgAbre,"TESTE");
if(/class="al"/.test(bf)) erro("recheio preenchido: alerta deveria virar confirmacao");
if(!/Confira se bate/.test(bf)) erro("recheio preenchido: confirmacao ausente");

// Recheio nao deve vazar quando o comportamento nao expoe interior
if(/ground beef/.test(montarPrompt(prodT,cfgSeco))) erro("recheio vazou em preset sem exposicao");
store.set("rec:TESTE","");
if(!falhas) console.log("recheio e cobertura: ancoras e alertas conferem");


// --- eixo superficie x forma ---
// Nenhum rotulo pode se repetir entre as duas listas.
const rotAmb=D.bancos.ambiente.map(x=>x[1].toLowerCase());
D.bancos.transformacao.forEach(function(x){
  if(rotAmb.indexOf(x[1].toLowerCase())>=0) erro("rotulo duplicado nas duas listas: "+x[1]);
});
// Toda mudanca de forma expoe face nova -> alerta e campo de recheio.
D.bancos.transformacao.forEach(function(x){
  if(x[0]==="tr_nenhuma") return;
  const c={cam:"cam_fixa",amb:"amb_nada",hum:"hum_nenhum",ut:"ut_nenhum",tr:x[0]};
  if(!pedeRecheio(c)) erro("forma sem campo de recheio: "+x[0]);
  if(!/class="al"/.test(briefingHTML(c,"NOVO"))) erro("forma sem alerta: "+x[0]);
});
// Nenhum preset pode apontar para codigo que nao existe mais.
const validos={};
Object.keys(D.bancos).forEach(k=>D.bancos[k].forEach(x=>validos[x[0]]=1));
Object.keys(D.presets).forEach(function(cod){
  const c=cfgDoPreset(cod);
  ["cam","amb","hum","ut","tr","rit"].forEach(function(k){
    if(c[k]&&!validos[c[k]]) erro("preset "+cod+" aponta para codigo inexistente: "+c[k]);
  });
});
if(!falhas) console.log("eixo superficie/forma: sem sobreposicao");


// --- caracteristicas ---
// Padrao por categoria quando o SKU nunca foi configurado.
Object.keys(D.padrao_cat).forEach(function(cat){
  const l=caracteristicasDe("SEM_"+cat,cat);
  if(!l.length) erro("categoria sem padrao: "+cat);
  l.forEach(function(c){if(!D.caracteristicas[c]) erro("padrao invalido em "+cat+": "+c)});
});

// Toda caracteristica gera cfg valido em todas as dimensoes.
const dims={cam:"camera",amb:"ambiente",hum:"humano",ut:"utensilio",tr:"transformacao",rit:"ritmo"};
Object.keys(D.caracteristicas).forEach(function(k){
  const c=cfgDeCaracteristicas([k]);
  Object.keys(dims).forEach(function(dd){
    const ok=D.bancos[dims[dd]].some(function(x){return x[0]===c[dd]});
    if(!ok) erro("caracteristica "+k+" gera "+dd+" invalido: "+c[dd]);
  });
});

// So uma mudanca de forma por video.
const forma=Object.keys(D.caracteristicas).filter(mudaForma);
let lst=alternarCaracteristica([],forma[0]);
lst=alternarCaracteristica(lst,forma[1]);
if(lst.filter(mudaForma).length!==1) erro("duas mudancas de forma coexistiram");
if(lst.indexOf(forma[1])<0) erro("a nova mudanca de forma nao substituiu a anterior");

// Superficie acumula sem se expulsar.
let sup=alternarCaracteristica([],"car_quente");
sup=alternarCaracteristica(sup,"car_brilho");
if(sup.length!==2) erro("caracteristicas de superficie se expulsaram");
// Clique repetido desliga.
if(alternarCaracteristica(sup,"car_brilho").indexOf("car_brilho")>=0) erro("chip nao desliga");

// Mudanca de forma sempre pede recheio e alerta.
forma.forEach(function(k){
  const c=cfgDeCaracteristicas([k]);
  if(!pedeRecheio(c)) erro(k+" muda forma e nao pede recheio");
  if(!/class="al"/.test(briefingHTML(c,"NOVO"))) erro(k+" muda forma e nao alerta");
});

// Escolha do usuario vence o padrao da categoria e persiste.
store.set("car:ZZ","car_gelado");
const cz=cfgDoProduto({sku:"ZZ",cat:"PAES"});
if(cz.amb!=="amb_condensa") erro("escolha salva nao venceu o padrao da categoria");
store.set("car:ZZ","");
if(cfgDoProduto({sku:"ZZ",cat:"PAES"}).cars.length!==0) erro("lista vazia voltou ao padrao");
// String vazia e valor, nao ausencia.
store.set("vazio_teste","");
if(store.get("vazio_teste")!=="") erro("store: string vazia virou null");
if(store.get("nunca_definido")!==null) erro("store: chave inexistente deveria ser null");
if(!falhas) console.log("caracteristicas: mapeamento, exclusao e persistencia conferem");


// --- prompt visivel e editavel ---
setSlot(1); render();
if(!criados["pp"]) erro("campo do prompt ausente no turno de produto");
if(!/Animate this photograph/.test(criados["pp"].value)) erro("campo do prompt vazio");
// O botao copia o que esta na caixa, nao o prompt remontado.
criados["pp"].value="TEXTO EDITADO MANUALMENTE";
criados["b1"].onclick();
if(capt!=="TEXTO EDITADO MANUALMENTE") erro("botao ignorou a edicao manual do prompt");
render();
if(criados["pp"].value==="TEXTO EDITADO MANUALMENTE") erro("render nao reescreveu o prompt");
if(!falhas) console.log("prompt: visivel, editavel e copiado do campo");


// --- prompt sempre em ingles ---
// Todo item do banco tem descricao inglesa util (cor ou textura).
[["insumos",D.insumos],["coberturas",D.coberturas]].forEach(function(par){
  Object.keys(par[1]).forEach(function(k){
    const en=par[1][k][1];
    if(!en||en.length<10) erro(par[0]+"."+k+": descricao inglesa curta demais");
    if(/[áàâãéêíóôõúçÁÂÃÉÊÍÓÔÕÚÇ]/.test(en)) erro(par[0]+"."+k+": acento portugues na descricao inglesa");
  });
});
// O rotulo da tela e portugues; o prompt leva o ingles.
store.set("rec:PT","in_goiabada");
if(rotuloInsumo(store.get("rec:PT"),D.insumos)!=="Goiabada") erro("rotulo pt incorreto");
if(recheioEN("PT")!=="dark red guava paste") erro("traducao do recheio falhou");
// Texto livre de versoes antigas continua funcionando sem traducao.
store.set("rec:VELHO","recheio antigo digitado a mao");
if(recheioEN("VELHO")!=="recheio antigo digitado a mao") erro("texto livre antigo se perdeu");
if(!falhas) console.log("insumos: rotulo pt na tela, descricao en no prompt");


// --- faca: resultado explicito, sem ordem dupla ---
const prodF={sku:"F1",cat:"SALGADOS",nome:"Esfiha",preco:"",verdade:""};
// A faca sumiu da lista de talheres.
if(D.bancos.utensilio.some(function(x){return x[0]==="ut_faca"}))
  erro("ut_faca ainda existe como talher avulso");

["tr_abre_faca","tr_fatia_faca"].forEach(function(k){
  const c={cam:"cam_aproxima",amb:"amb_nada",hum:"hum_nenhum",ut:"ut_nenhum",tr:k,rit:"rit_lento"};
  if(!facaNaForma(c)) erro(k+" nao foi reconhecida como corte com faca");
  if(!comTalher(c)) erro(k+": trava de utensilio nao aplicada");
  if(!comLuvas(c))  erro(k+": trava de luva nao aplicada");
  const pr=montarPrompt(prodF,c);
  // Nunca pode mandar cortar e dizer que acontece sozinho.
  if(/happens on its own/i.test(pr)) erro(k+": ordem dupla (faca + acontece sozinho)");
  // A faca precisa estar numa mao, nunca solta.
  if(!/gloved hand/i.test(pr)) erro(k+": faca sem mao que a segure");
  // O resultado do corte precisa estar dito.
  if(!/(in half|one single slice)/i.test(pr)) erro(k+": resultado do corte nao especificado");
  if(!pedeRecheio(c)) erro(k+" nao pede recheio");
});

// A versao sozinha continua proibindo talher.
const cSo={cam:"cam_aproxima",amb:"amb_nada",hum:"hum_nenhum",ut:"ut_nenhum",tr:"tr_abre",rit:"rit_lento"};
if(comTalher(cSo)) erro("tr_abre sozinho nao deveria acionar talher");
if(!/happens on its own/i.test(montarPrompt(prodF,cSo))) erro("tr_abre perdeu o 'acontece sozinho'");
if(!falhas) console.log("faca: corte explicito, uma ordem so");


// --- modo cinema: relaxa a luz, nunca o produto ---
const prodC={sku:"C1",cat:"SALGADOS",nome:"Esfiha",preco:"",verdade:""};
const cCin=cfgDeCaracteristicas(["car_cinema"]);
const cOrn=cfgDeCaracteristicas(["car_ornamento"]);
const cNor=cfgDeCaracteristicas(["car_quente"]);
const pCin=montarPrompt(prodC,cCin), pOrn=montarPrompt(prodC,cOrn), pNor=montarPrompt(prodC,cNor);

// Em todos os niveis a identidade do produto continua travada.
[["normal",pNor],["cinema",pCin],["ornamento",pOrn]].forEach(function(par){
  if(!/must remain recognisably the same item/.test(par[1]))
    erro("trava de identidade perdida no modo "+par[0]);
  if(!/Do not redraw, replace, restyle or beautify/.test(par[1]))
    erro("trava de redesenho perdida no modo "+par[0]);
  if(!/logos or branding/.test(par[1]))
    erro("trava de marca perdida no modo "+par[0]);
});
// Só o cinema libera a luz.
if(/The lighting stays exactly as photographed/.test(pCin)) erro("cinema nao liberou a luz");
if(!/The lighting stays exactly as photographed/.test(pNor)) erro("modo normal liberou a luz indevidamente");
// Só o ornamento libera objetos, e mesmo assim proibe maos e talheres.
if(/Do not add objects/.test(pOrn)) erro("ornamento nao liberou objetos");
if(!/Do not add objects/.test(pCin)) erro("cinema liberou objetos indevidamente");
if(/Do not add objects/.test(pOrn)) erro("ornamento nao liberou objetos");
if(!/rest on the rustic surface around it/.test(pOrn)) erro("bloco de ornamento ausente");
if(/rest on the rustic surface/.test(pCin)) erro("ornamento vazou para o cinema");
// O ornamento precisa avisar que os ingredientes sao inventados.
if(!/class="al"/.test(briefingHTML(cOrn,"C1"))) erro("ornamento sem alerta de invencao");
if(!/rústica/.test(briefingHTML(cCin,"C1"))) erro("cinema sem orientacao de cenario");

// A ordem de clique nao pode mudar o resultado.
const ordA=cfgDeCaracteristicas(["car_cinema","car_quente","car_recheio"]);
const ordB=cfgDeCaracteristicas(["car_recheio","car_quente","car_cinema"]);
if(JSON.stringify(ordA)!==JSON.stringify(ordB)) erro("ordem de clique mudou o cfg");
if(ordA.cam!=="cam_cinema") erro("cinema perdeu a camera para outra caracteristica");
if(ordA.amb!=="amb_vapor") erro("cinema apagou o vapor");
if(ordA.tr!=="tr_abre") erro("cinema apagou a mudanca de forma");
if(!falhas) console.log("cinema: luz liberada, produto travado nos tres niveis");



// --- ornamento nomeado por produto ---
Object.keys(D.ornamentos).forEach(function(k){
  const en=D.ornamentos[k][1];
  if(/[áàâãéêíóôõúçÁÉÍÓÚÇ]/.test(en)) erro("ornamento "+k+": acento portugues no ingles");
  if(en.length<12) erro("ornamento "+k+": descricao curta demais");
});
const prodM={sku:"M1",cat:"BISCOITOS",nome:"Biscoito de Mandioca",preco:"",verdade:""};
const cO=cfgDeCaracteristicas(["car_ornamento"]);
// Sem escolher: bloco generico e alerta de invencao.
if(!/loose raw ingredients/.test(montarPrompt(prodM,cO))) erro("bloco generico ausente");
if(!/class="al"/.test(briefingHTML(cO,"M1"))) erro("ornamento vazio sem alerta");
// Escolhido: nome em ingles entra e o generico sai.
store.set("orn:M1","or_mandioca");
const pM=montarPrompt(prodM,cO);
if(!/boiled cassava pieces/.test(pM)) erro("ornamento nomeado nao entrou no prompt");
if(/loose raw ingredients/.test(pM)) erro("bloco generico nao foi substituido");
if(!/never touches or overlaps/.test(pM)) erro("ornamento sem trava de sobreposicao");
if(!/must remain recognisably the same item/.test(pM)) erro("ornamento derrubou a trava de identidade");
const bM=briefingHTML(cO,"M1");
if(/class="al"/.test(bM)) erro("ornamento nomeado deveria virar conferencia");
if(!/Mandioca cozida/.test(bM)) erro("briefing nao mostra o rotulo em portugues");
// Sem o modo ligado, o ornamento nao vaza.
if(/cassava/.test(montarPrompt(prodM,cfgDeCaracteristicas(["car_quente"]))))
  erro("ornamento vazou com o modo desligado");

// Nenhum banco pode trazer o prefixo que o montador ja adiciona.
["camera","ambiente","humano","utensilio","transformacao","ritmo"].forEach(function(dim){
  D.bancos[dim].forEach(function(x){
    if(dim!=="transformacao"&&/^MOTION:/.test(x[2]||"")) erro(dim+"."+x[0]+": prefixo MOTION duplicado");
  });
});
Object.keys(D.presets).forEach(function(cod){
  const p=montarPrompt({sku:"1",cat:"OUTROS",nome:"X",preco:"",verdade:""},cfgDoPreset(cod));
  if(/MOTION:\s*MOTION:/.test(p)) erro("prefixo MOTION duplicado em "+cod);
});
Object.keys(D.caracteristicas).forEach(function(k){
  const p=montarPrompt({sku:"1",cat:"OUTROS",nome:"X",preco:"",verdade:""},cfgDeCaracteristicas([k]));
  if(/MOTION:\s*MOTION:/.test(p)) erro("prefixo MOTION duplicado na caracteristica "+k);
});
if(!falhas) console.log("ornamento: nomeado por produto, pt na tela e en no prompt");



// --- fundo: real, escurecido ou substituido ---
const prodB={sku:"B1",cat:"BISCOITOS",nome:"Biscoito",preco:"",verdade:""};
const pReal =montarPrompt(prodB,cfgDeCaracteristicas(["car_crocante"]));
const pEsc  =montarPrompt(prodB,cfgDeCaracteristicas(["car_fundo_escuro"]));
const pCham =montarPrompt(prodB,cfgDeCaracteristicas(["car_chama"]));

// Prato, superficie e identidade sobrevivem em todos os fundos.
[["real",pReal],["escuro",pEsc],["chama",pCham]].forEach(function(par){
  if(!/The plate and the surface it rests on stay exactly as photographed/.test(par[1]))
    erro("suporte perdido no fundo "+par[0]);
  if(!/must remain recognisably the same item/.test(par[1]))
    erro("identidade perdida no fundo "+par[0]);
  if(!/Do not add text, captions, logos or branding/.test(par[1]))
    erro("trava de marca perdida no fundo "+par[0]);
});
// So o fundo trocado libera a clausula de fundo.
if(!/The background and the framing stay exactly as photographed/.test(pReal))
  erro("fundo real deveria estar travado");
if(/The background and the framing stay exactly as photographed/.test(pCham))
  erro("chama nao liberou o fundo");
if(!/one soft warm flame/.test(pCham)) erro("bloco da chama ausente");
if(/flame/.test(pEsc)) erro("chama vazou para o fundo escurecido");
if(/flame/.test(pReal)) erro("chama vazou para o fundo real");
if(!/falls softly into darkness/.test(pEsc)) erro("bloco do fundo escurecido ausente");
// A chama precisa avisar que o cenario e inventado.
if(!/class="al"/.test(briefingHTML(cfgDeCaracteristicas(["car_chama"]),"B1")))
  erro("chama sem alerta de cenario inventado");

// Um fundo por vez.
let lf=alternarCaracteristica([],"car_fundo_escuro");
lf=alternarCaracteristica(lf,"car_chama");
if(lf.filter(function(x){return grupoDe(x)==="fundo"}).length!==1) erro("dois fundos coexistiram");
// Grupos diferentes nao se expulsam.
let lgf=alternarCaracteristica(alternarCaracteristica([],"car_chama"),"car_recheio");
if(lgf.length!==2) erro("fundo e forma se expulsaram");
// Nenhuma clausula da trava pode ficar orfa.
Object.keys(D.trava_partes).forEach(function(k){
  const usada=[cfgDeCaracteristicas([]),cfgDeCaracteristicas(["car_chama"]),
               cfgDeCaracteristicas(["car_ornamento"]),cfgDeCaracteristicas(["car_embalado"]),cfgDeCaracteristicas(["car_embalado","car_chama"])]
    .some(function(c){return travaBase(c).indexOf(D.trava_partes[k])>=0})
    || travaBase(Object.assign({combo:true},cfgDeCaracteristicas([]))).indexOf(D.trava_partes[k])>=0;
  if(!usada) erro("clausula da trava nunca usada: "+k);
});
if(!falhas) console.log("fundo: real, escurecido e chama, com suporte sempre travado");


// --- modo criar ---
const prodK={sku:"K1",cat:"BOLOS",nome:"Bolo de Morango",preco:"",verdade:""};
store.set("rec:K1","in_morango");
const cK=cfgDeCaracteristicas(["car_chama","car_fatia"]);

// Enquanto o modo for animar, nada do modo criar aparece.
if(modoDe("K1")!=="animar") erro("modo padrao deveria ser animar");
const pAnim=montarPrompt(prodK,cK);
if(/attached photograph as the visual reference/.test(pAnim)) erro("modo comercial vazou para o animar");
if(!/Animate this photograph/.test(pAnim)) erro("modo animar perdeu o cabecalho");

store.set("mod:K1","criar");
const pCriar=montarPrompt(prodK,cK);
// A troca precisa valer para toda chamada, nao so para o botao.
if(!/attached photograph as the visual reference/.test(pCriar)) erro("roteador nao trocou o modo");
if(/Animate this photograph/.test(pCriar)) erro("modo criar manteve o cabecalho de animacao");
// Sem foto, a trava de identidade nao faz sentido e nao pode sobrar.
if(/stays exactly as photographed/.test(pCriar)) erro("contrato de foto sobrou no comercial");
if(!/attached photograph as the visual reference/.test(pCriar)) erro("comercial nao cita a foto");
if(!/6-second/.test(pCriar)) erro("comercial nao pede 6 segundos");
if(!/3 to 4 shots/.test(pCriar)) erro("estrutura de planos ausente");
if(!/macro push across the filling/.test(pCriar)) erro("plano do recheio ausente");
// O recheio real precisa descrever o sujeito.
if(!/fresh strawberry slices/.test(pCriar)) erro("recheio nao entrou na descricao do sujeito");
if(!/layered sponge cake/.test(pCriar)) erro("base da categoria ausente");
// Proibicoes que valem nos dois modos.
if(!/logos, brand marks/.test(pCriar)) erro("trava de marca ausente no modo criar");
if(!/No faces/.test(pCriar)) erro("modo criar nao proibiu rostos");
// Nenhuma frase de animacao pode sobrar num modo que nao tem foto.
["stay exactly as photographed","No cuts, no scene changes","Animate this photograph"].forEach(function(f){
  if(pCriar.indexOf(f)>=0) erro("regra de animacao vazou para o comercial: "+f);
});
// O animar continua proibindo corte; o comercial precisa permitir.
if(!/No cuts, no scene changes/.test(pAnim)) erro("modo animar perdeu a proibicao de corte");
if(/\.\./.test(pCriar)) erro("ponto duplicado no prompt do modo criar");
// O prefixo MOTION nao pode vazar para o bloco ACTION.
if(/MOTION:/.test(pCriar)) erro("prefixo MOTION vazou para o modo criar");
// O aviso legal e obrigatorio e precisa ser critico.
const bK=briefingHTML(cK,"K1");


if(!/referência/.test(bK)) erro("briefing nao explica o papel da foto");
// Toda categoria precisa de descricao base.
Object.keys(D.matriz).forEach(function(cat){
  if(!D.base_cat[cat]&&cat!=="OUTROS") erro("categoria sem descricao base: "+cat);
});
store.set("mod:K1","animar");
if(!falhas) console.log("modo comercial: foto como referencia, 6s e estrutura de planos");


// --- ingredientes so no plano final ---
store.set("mod:K1","criar"); store.set("orn:K1","or_morango");
const pOrnF=montarPrompt(prodK,cfgDeCaracteristicas(["car_ornamento","car_fatia"]));
if(!/ONLY in this final shot/.test(pOrnF)) erro("ingredientes nao restritos ao plano final");
if(/Beside it,/.test(pOrnF)) erro("bloco solto de ornamento sobrou na cena");
if(!/whole fresh strawberries/.test(pOrnF)) erro("ornamento nomeado ausente do plano final");
if(!/pulls slowly back and away/.test(pOrnF)) erro("afastamento final ausente");
if(!/stay completely still/.test(pOrnF)) erro("plano final nao e estatico");
if(!/ends holding on this wide frame/.test(pOrnF)) erro("video nao termina no plano aberto");
// Sem ornamento o afastamento continua, mas nenhum ingrediente e citado.
const pSemOrn=montarPrompt(prodK,cfgDeCaracteristicas(["car_fatia"]));
if(!/pulls slowly back and away/.test(pSemOrn)) erro("afastamento sumiu sem ornamento");
if(/strawberries resting/.test(pSemOrn)) erro("ingrediente vazou sem o modo ligado");
if(/%s/.test(pOrnF)||/%s/.test(pSemOrn)) erro("placeholder %s nao substituido");
store.set("mod:K1","animar");
if(!falhas) console.log("plano final: afastamento estatico com os ingredientes so no fim");


// --- escolha manual de produto sobrevive ao clique no chip ---
// O select lista todos os produtos: o que vale e qual opcao esta marcada.
function skuNaTela(){
  const m=/value="([^"]+)" selected/.exec(criados["ticket"].innerHTML);
  return m?m[1]:null;
}
setSlot(1); render();
const agendado=skuNaTela();
if(!agendado) erro("nao consegui ler o produto na tela");
const alvo=D.produtos.filter(function(x){return x.sku!==agendado})[0];
criados["sp"].onchange({target:{value:alvo.sku}});
if(skuNaTela()!==alvo.sku) erro("troca manual de produto nao apareceu na tela");

// Efeito exato do clique num chip: grava a caracteristica e limpa o cache do plano.
store.set("car:"+alvo.sku,"car_cinema");
Object.keys(cache).forEach(function(k){delete cache[k]});
render();
// O bug: aqui o calendario reassumia e o produto voltava ao agendado.
if(skuNaTela()===agendado) erro("produto voltou ao do calendario ao limpar o cache");
if(skuNaTela()!==alvo.sku) erro("produto escolhido a mao se perdeu");
if(cfgDoProduto(alvo).cam!=="cam_cinema") erro("caracteristica nao aplicada ao escolhido");

// A escolha vale por dia e turno, nao vaza para o dia seguinte.
irPara(1); setSlot(1); render();
const outroDia=skuNaTela();
irPara(-1); setSlot(1); render();
if(skuNaTela()!==alvo.sku) erro("escolha se perdeu ao voltar para o dia");
if(outroDia===alvo.sku && D.produtos.length>2) erro("escolha manual vazou para outro dia");
if(!falhas) console.log("escolha manual: sobrevive a limpeza do cache");


// --- produto de revenda: o rotulo precisa sobreviver ---
const prodR={sku:"R1",cat:"LATICINIOS",nome:"Doce de Leite em Pote",preco:"",verdade:""};
const cE=cfgDeCaracteristicas(["car_embalado"]);
if(!embalado(cE)) erro("caracteristica embalado nao marcou o cfg");
const pE=montarPrompt(prodR,cE);
if(!/every word, logo and barcode/.test(pE)) erro("trava de rotulo ausente");
if(!/Do not redraw, re-letter, translate, invent or replace/.test(pE)) erro("rotulo sem protecao de texto");
if(!/nothing melts, steams, opens, pours/.test(pE)) erro("produto embalado sem trava de imobilidade");
// A proibicao de texto muda de sentido: o rotulo do produto e legitimo.
if(!/not already printed on the product itself/.test(pE)) erro("trava de marca nao acomodou o rotulo");
if(/Do not add text, captions, logos or branding\./.test(pE)) erro("trava de marca antiga sobrou");

// Nenhuma acao de padaria pode escapar num produto lacrado.
const cSujo=cfgDeCaracteristicas(["car_embalado","car_quente","car_recheio","car_ornamento"]);
const pSujo=montarPrompt(prodR,cSujo);
["Hot steam","separates into two halves","resting on the surface around"].forEach(function(f){
  if(pSujo.indexOf(f)>=0) erro("acao incompativel sobreviveu no embalado: "+f);
});
// O alerta do rotulo precisa aparecer.
if(!/class="al"/.test(briefingHTML(cE,"R1"))) erro("embalado sem alerta de rotulo");
if(!/embaralhado/.test(briefingHTML(cE,"R1"))) erro("briefing nao avisa do texto embaralhado");
// Produto normal nao ganha trava de rotulo.
if(/every word, logo and barcode/.test(montarPrompt(prodR,cfgDeCaracteristicas(["car_quente"]))))
  erro("trava de rotulo vazou para produto sem embalagem");
// Vocabulario de padaria nao cabe em pote lacrado.
if(/same recipe, same crust/.test(pE)) erro("embalado usando vocabulario de panificacao");
if(!/same packaging, same shape/.test(pE)) erro("embalado sem clausula de identidade propria");
// Nenhuma clausula pode sair duas vezes.
[["suporte",pE],["suporte no fundo",montarPrompt(prodR,cfgDeCaracteristicas(["car_fundo_escuro"]))]]
 .forEach(function(par){
  const n=par[1].split("The plate and the surface it rests on stay exactly as photographed").length-1;
  if(n>1) erro("clausula duplicada ("+par[0]+"): "+n+" ocorrencias");
});
if(!falhas) console.log("revenda: rotulo travado e produto imovel");


// --- produtos fora do catalogo do ERP ---
const antes=produtosTodos().length;
if(antes!==D.produtos.length) erro("lista local deveria comecar vazia");
const nv=salvarProdutoLocal("Doce de Leite em Pote","REVENDA");
if(!nv) erro("produto local nao foi criado");
if(produtosTodos().length!==antes+1) erro("produto local nao entrou na lista");
if(!acharProduto(nv.sku)) erro("produto local nao e encontrado por sku");
if(acharProduto("INEXISTENTE")) erro("busca deveria devolver null");
// Nome vazio nao cria registro.
if(salvarProdutoLocal("   ","REVENDA")) erro("nome vazio criou produto");
if(produtosTodos().length!==antes+1) erro("registro invalido entrou na lista");
// Revenda nasce com a trava de rotulo pelo padrao da categoria.
const cNv=cfgDoProduto(nv);
if(!embalado(cNv)) erro("REVENDA nao nasceu com a trava de rotulo");
const pNv=montarPrompt(nv,cNv);
if(!/every word, logo and barcode/.test(pNv)) erro("produto local sem trava de rotulo");
if(!/same packaging, same shape/.test(pNv)) erro("produto local sem identidade de embalagem");
// Sobrevive a nova leitura do armazenamento.
if(produtosTodos().filter(function(x){return x.sku===nv.sku}).length!==1)
  erro("produto local duplicado ou perdido");
// Toda categoria oferecida na tela precisa ter padrao e descricao base.
["BISCOITOS","SALGADOS","PAES","BOLOS","BEBIDAS","LATICINIOS","REVENDA","OUTROS"].forEach(function(c){
  if(!D.padrao_cat[c]) erro("categoria sem padrao de caracteristicas: "+c);
  if(!D.base_cat[c])   erro("categoria sem descricao base: "+c);
});
store.set("novos","[]");
if(!falhas) console.log("produtos locais: cadastro, busca e padrao de revenda");


// --- quinta do combo ---
const pl=planoMes(2026,7);   // agosto/2026
let quintas=0, combos=0, semBebida=0, foraDaRegra=0;
Object.keys(pl).forEach(function(d){
  const ds=(new Date(2026,7,+d).getDay()+6)%7;
  pl[d].forEach(function(s){
    if(s.modo==="MENSAGEM") return;
    if(ds===3){
      quintas++;
      if(s.modo!=="COMBO") erro("quinta sem combo no dia "+d);
      else{
        combos++;
        if(!s.bebida) semBebida++;
        else if(s.bebida.cat!=="BEBIDAS") erro("bebida do combo fora da categoria: "+s.bebida.cat);
        if(["SALGADOS","BISCOITOS"].indexOf(s.prod.cat)<0)
          erro("comida do combo fora da regra: "+s.prod.cat);
      }
    }else if(s.modo==="COMBO") foraDaRegra++;
  });
});
if(!quintas) erro("nenhuma quinta encontrada no mes de teste");
if(combos!==quintas) erro("nem toda quinta virou combo");
if(semBebida) erro(semBebida+" combos sem bebida");
if(foraDaRegra) erro("combo apareceu fora de quinta: "+foraDaRegra);

// A bebida precisa variar entre as quintas.
const bebs={};
Object.keys(pl).forEach(function(d){
  const ds=(new Date(2026,7,+d).getDay()+6)%7;
  if(ds===3) pl[d].forEach(function(s){ if(s.bebida) bebs[s.bebida.sku]=1 });
});
if(Object.keys(bebs).length<2) erro("a mesma bebida em todas as quintas");
// A comida precisa alternar entre salgado e biscoito ao longo do mes.
const catsQ={};
Object.keys(pl).forEach(function(d){
  const ds=(new Date(2026,7,+d).getDay()+6)%7;
  if(ds===3) pl[d].forEach(function(s){ if(s.modo==="COMBO") catsQ[s.prod.cat]=1 });
});
if(Object.keys(catsQ).length<2) erro("combo so oferece uma categoria de comida no mes");

// Trava dos dois itens so no combo.
const prodCb={sku:"C9",cat:"SALGADOS",nome:"Coxinha",preco:"",verdade:""};
const cCb=cfgDeCaracteristicas(["car_quente"]);
if(!/Two items are shown together/.test(montarPrompt(prodCb,cCb,true)))
  erro("combo sem trava de dois itens");
if(/Two items are shown together/.test(montarPrompt(prodCb,cCb,false)))
  erro("trava de combo vazou para post normal");
if(!falhas) console.log("quinta do combo: comida + bebida, com trava dos dois itens");


// --- versao curta para o Canva ---
const prodQ={sku:"Q1",cat:"SALGADOS",nome:"Esfiha",preco:"",verdade:""};
store.set("rec:Q1","in_carne"); store.set("mod:Q1","animar");
const cQ=cfgDeCaracteristicas(["car_quente","car_recheio"]);
const curto=montarPromptCurto(prodQ,cQ), longo=montarPrompt(prodQ,cQ);
// Precisa ser bem menor que o do Flow: o campo do Canva e curto.
if(curto.length>=longo.length*0.55) erro("versao curta nao encurtou o bastante");
if(curto.split(" ").length>90) erro("versao curta longa demais: "+curto.split(" ").length+" palavras");
// Cabecalhos e rotulos internos nao podem aparecer.
["Animate this photograph","MOTION:","TRANSFORMATION:","No cuts, no scene changes"].forEach(function(f){
  if(curto.indexOf(f)>=0) erro("rotulo interno vazou na versao curta: "+f);
});
// O que importa precisa sobreviver: movimento, transformacao e recheio.
if(!/steam/i.test(curto)) erro("versao curta perdeu o movimento de ambiente");
if(!/separates into two halves/.test(curto)) erro("versao curta perdeu a transformacao");
if(!/seasoned ground beef/.test(curto)) erro("versao curta perdeu o recheio");
if(!/Add nothing, remove nothing/.test(curto)) erro("versao curta sem guarda de fidelidade");
if(/\s{2,}/.test(curto)) erro("espacos duplicados na versao curta");
// Produto embalado troca a guarda pela do rotulo.
const curtoP=montarPromptCurto({sku:"Q2",cat:"REVENDA",nome:"Pote",preco:"",verdade:""},
                               cfgDeCaracteristicas(["car_embalado"]));
if(!/every printed word/.test(curtoP)) erro("versao curta sem guarda de rotulo no embalado");
if(/plate and background/.test(curtoP)) erro("guarda errada no produto embalado");
if(!falhas) console.log("versao curta: enxuta, sem rotulos internos, guarda preservada");


// --- assistente por texto livre ---
// Reconhece efeito, recheio e ornamento a partir da descricao.
const i1=interpretar("duas esfihas de carne no prato","abrir ao meio mostrando o recheio, com vapor");
if(i1.cars.indexOf("car_recheio")<0) erro("assistente nao reconheceu a abertura");
if(i1.cars.indexOf("car_quente")<0) erro("assistente nao reconheceu o vapor");
if(i1.rec!=="in_carne") erro("assistente nao reconheceu o recheio: "+i1.rec);
if(!i1.entendido.length) erro("assistente nao listou o que entendeu");

// Acentos e maiusculas nao podem atrapalhar.
const i2=interpretar("ESFIHA DE CARNE","Quero que ABRA ao meio com VAPOR");
if(i2.cars.indexOf("car_recheio")<0||i2.cars.indexOf("car_quente")<0)
  erro("assistente falhou com maiusculas e acentos");

// Pedido vazio de efeito precisa avisar, nao gerar prompt em silencio.
const i3=interpretar("pao de queijo","que fique bonito");
if(!i3.avisos.some(function(v){return v[0]==="!"})) erro("pedido vago sem alerta");
if(i3.cars.length) erro("pedido vago nao deveria gerar efeito");

// Conflito frio x vapor precisa ser apontado.
const i4=interpretar("refrigerante gelado","quero vapor saindo");
if(!i4.avisos.some(function(v){return /gelado/.test(v[1])})) erro("conflito frio x vapor nao detectado");

// Interior pedido sem dizer o recheio: alerta critico.
const i5=interpretar("um salgado no prato","abrir ao meio mostrando o interior");
if(!i5.avisos.some(function(v){return v[0]==="!"&&/inventa/.test(v[1])}))
  erro("interior sem recheio nao alertou");

// Embalagem vem da foto, mesmo sem ser pedida.
const i6=interpretar("um pote lacrado de doce de leite","clima de comercial");
if(i6.cars.indexOf("car_embalado")<0) erro("embalagem da foto nao foi reconhecida");

// O cfg gerado precisa produzir prompt valido nos dois formatos.
const prodA={sku:"ASSIST",cat:"OUTROS",nome:"Produto",preco:"",verdade:""};
store.set("rec:ASSIST",i1.rec); store.set("mod:ASSIST","animar");
const pfl=montarPrompt(prodA,i1.cfg), pca=montarPromptCurto(prodA,i1.cfg);
if(!/Animate this photograph/.test(pfl)) erro("assistente nao gerou prompt do Flow");
if(!/seasoned ground beef/.test(pca)) erro("recheio do assistente nao chegou na versao curta");
if(pca.length>=pfl.length) erro("versao curta do assistente nao encurtou");
store.set("rec:ASSIST","");
// A tela precisa sobreviver ao estado inicial, sem analise nenhuma.
renderAssist();
if(criados["vAssist"].innerHTML.indexOf("O que aparece na foto")<0)
  erro("tela do assistente vazia no estado inicial");
if(criados["vAssist"].innerHTML.indexOf("id=\"pf\"")>=0)
  erro("prompt exibido antes de analisar");
// Sem a API de voz o app nao pode quebrar nem mostrar botao morto.
if(VOZ!==null) erro("VOZ deveria ser null sem suporte no ambiente");
if(botaoVoz("tf")!=="") erro("botao de microfone exibido sem suporte");
renderAssist();
if(criados["vAssist"].innerHTML.indexOf("data-mic")>=0)
  erro("microfone renderizado em ambiente sem suporte");
ditar("tf",function(){});   // nao pode lancar excecao
if(!falhas) console.log("assistente: interpreta, alerta conflitos e gera os dois prompts");
if(!falhas) console.log("voz: degrada sem suporte, sem botao morto");

console.log(falhas===0?"TODOS OS TESTES PASSARAM":`${falhas} FALHAS`);
process.exit(falhas?1:0);
