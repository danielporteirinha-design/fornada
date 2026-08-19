const fs=require("fs");
const html=fs.readFileSync(process.argv[2],"utf8");
const js=html.split("<script>")[1].split("</script>")[0];
const ids=new Set([...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]));
const criados={};
function elem(id){return {id,style:{},dataset:{},value:"",_html:"",_txt:"",
  classList:{add(){},remove(){},toggle(){},contains:()=>false},
  addEventListener(){},focus(){},
  get innerHTML(){return this._html},
  set innerHTML(v){this._html=String(v);[...this._html.matchAll(/id="([^"]+)"/g)].forEach(m=>ids.add(m[1]))},
  get textContent(){return this._txt}, set textContent(v){this._txt=v},
  querySelectorAll(sel){const at=(sel.match(/\[([a-z-]+)\]/)||[])[1]; if(!at) return [];
    return [...this._html.matchAll(new RegExp(at+'="([^"]+)"','g'))].map(m=>{
      const b=elem("_"+m[1]); b.getAttribute=k=>k===at?m[1]:null; return b;});}};}
const doc={getElementById:id=>ids.has(id)?(criados[id]=criados[id]||elem(id)):null,
  querySelectorAll:()=>[],addEventListener(){},createElement:elem,body:elem("body")};
let capt="";
const A=new Function("document","navigator","localStorage","setTimeout","clearTimeout","win","FileReader","URL","confirm","fetch",
 js+"\n;return{D,store,VOZ,interpretar,reavaliar,montarAnalise,montarPrompt,montarPromptCurto,cfgDeCaracteristicas,renderAssist,travaBase,pedeRecheio,embalado,ornamentando,alternarCaracteristica,grupoDe,mudaForma,botaoVoz,ditar};")
 (doc,{clipboard:{writeText:t=>{capt=t;return Promise.resolve()}}},null,f=>{if(f)f();return 0},()=>{},
  {open(){}},function(){},{createObjectURL:()=>""},()=>true,()=>Promise.reject(new Error("x")));
let falhas=0; const erro=(...m)=>{falhas++;console.log("  FALHA:",m.join(" "))};
const {D,store,VOZ,interpretar,reavaliar,montarPrompt,montarPromptCurto,
       cfgDeCaracteristicas,renderAssist,travaBase,pedeRecheio,embalado,
       alternarCaracteristica,grupoDe,mudaForma,botaoVoz,ditar}=A;

// 1. calendario e telas antigas nao podem ter deixado vestigio
["planoMes","renderLote","irPara","aplicarModo","legenda","MATINAIS","SLOTS","GANCHO"]
 .forEach(n=>{ if(new RegExp("\\b"+n+"\\b").test(js)) erro("vestigio do calendario: "+n) });
["vDia","vSemana","vw","ticket","rail","dia"].forEach(id=>{
  if(html.indexOf('id="'+id+'"')>=0) erro("elemento removido ainda no HTML: "+id) });
["cfg","painel","vAssist","toast"].forEach(id=>{
  if(html.indexOf('id="'+id+'"')<0) erro("elemento essencial ausente: "+id) });
console.log("estrutura: só o assistente e os ajustes");

// 2. dicionario
let termos=0; ["lexico_car","lexico_in","lexico_or"].forEach(b=>{
  Object.keys(D[b]).forEach(k=>termos+=D[b][k].length)});
if(termos<300) erro("dicionario pobre: "+termos+" termos");
const inv={}; Object.keys(D.lexico_car).forEach(k=>D.lexico_car[k].forEach(t=>{
  (inv[t]=inv[t]||[]).push(k)}));
Object.keys(inv).forEach(t=>{ if(inv[t].length>1) erro("termo ambiguo: "+t) });
console.log("dicionario: "+termos+" termos, nenhum ambiguo");

// 3. interpretacao
const casos=[
 ["esfiha de carne, quero que abra ao meio com vapor",["car_recheio","car_quente"],"in_carne"],
 ["pote lacrado de doce de leite com fundo escuro",["car_embalado","car_fundo_escuro"],null],
 ["biscoito bem torradinho, solta farelinho",["car_crocante"],null],
 ["bolo com calda escorrendo por cima",["car_cobertura"],null],
 ["quero uma cena caprichada, macro, estilo comercial",["car_cinema"],null],
];
casos.forEach(([f,esp,rec])=>{
  const r=interpretar(f,f);
  esp.forEach(c=>{ if(r.cars.indexOf(c)<0) erro("nao reconheceu "+c+" em: "+f) });
  if(rec&&r.rec!==rec) erro("recheio errado em: "+f);
});
console.log("interpretacao: "+casos.length+" falas reconhecidas");

// 4. desmarcar recalcula a conferencia
const i=interpretar("salgado no prato, abrir ao meio mostrando o recheio de carne",
                    "salgado no prato, abrir ao meio mostrando o recheio de carne");
if(!i.entendido.every(x=>Array.isArray(x)&&x.length===3)) erro("entendido sem chave para desmarcar");
const semRec=reavaliar(i.cars,"",i.orn,i.foto);
if(!semRec.avisos.some(v=>v[0]==="!"&&/inventa/.test(v[1])))
  erro("remover o recheio nao gerou alerta");
const semForma=reavaliar(i.cars.filter(c=>!mudaForma(c)),i.rec,i.orn,i.foto);
if(semForma.avisos.some(v=>/inventa/.test(v[1])))
  erro("alerta de recheio persistiu sem a transformacao");
if(pedeRecheio(semForma.cfg)) erro("cfg nao acompanhou a remocao do chip");
console.log("desmarcar: conferencia recalculada sobre a lista nova");

// 5. as duas guias saem do mesmo cfg
store.set("rec:ASSIST",i.rec); store.set("mod:ASSIST","animar");
const prod={sku:"ASSIST",cat:"OUTROS",nome:"Produto",preco:"",verdade:""};
const flow=montarPrompt(prod,i.cfg), canva=montarPromptCurto(prod,i.cfg);
if(!/Animate this photograph/.test(flow)) erro("guia Flow sem cabecalho");
if(/Animate this photograph/.test(canva)) erro("guia Canva com cabecalho longo");
if(canva.length>=flow.length*0.6) erro("guia Canva nao encurtou");
if(!/seasoned ground beef/.test(canva)) erro("recheio ausente na guia Canva");
console.log("guias: Flow completo, Canva enxuto, mesmo cfg");

// 6. tela inicial
renderAssist();
const tela=criados["vAssist"].innerHTML;
if(tela.indexOf('id="tq"')<0) erro("campo de fala ausente");
if(tela.indexOf('id="pp"')>=0) erro("prompt exibido antes de falar");
if(VOZ!==null||botaoVoz("tq")!=="") erro("botao de voz sem suporte no ambiente");
ditar("tq",function(){});
console.log("tela: campo unico, sem botao morto");

// 7. ajustes gravam de verdade
["wpp","menu"].forEach(id=>{ if(!criados[id]) erro("campo de ajustes ausente: "+id) });
criados["wpp"].onchange({target:{value:"38999999999"}});
if(store.get("wpp")!=="38999999999") erro("ajustes nao gravaram o WhatsApp");
criados["menu"].onchange({target:{value:"https://exemplo"}});
if(store.get("menu")!=="https://exemplo") erro("ajustes nao gravaram o cardapio");
// Cadastro de produto saiu junto com o seletor: nao pode ter sobrado resto.
["salvarProdutoLocal","produtosTodos","acharProduto","CATS","novoAberto"].forEach(n=>{
  if(new RegExp("\\b"+n+"\\b").test(js)) erro("resto do cadastro local: "+n) });
console.log("ajustes: gravam; cadastro de produto removido sem resto");
console.log(falhas?falhas+" FALHAS":"TODOS OS TESTES PASSARAM");
process.exit(falhas?1:0);
