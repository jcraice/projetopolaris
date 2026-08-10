// Botão que abre e fecha uma lista: o menu da navegação no celular e a lista de
// mundos da home. Os dois têm o mesmo comportamento, então mora aqui em vez de
// ser copiado nos dois componentes.
//
// A decisão de estar aberto ou fechado vive num só lugar, o `aria-expanded` do
// botão — o CSS mostra e esconde a lista a partir dele, com um seletor de
// irmão. Assim não existe estado paralelo que possa divergir do que o leitor de
// tela anuncia.

export function proximoEstado(atual: string | null): 'true' | 'false' {
  return atual === 'true' ? 'false' : 'true';
}

// O menu "Mais" da navegação flutua por cima da página, e por isso precisa
// fechar sozinho — no Escape e no clique fora —, coisa que o menu do celular e
// a lista de mundos da home não precisam, porque empurram o conteúdo em vez de
// cobri-lo. A comparação da tecla mora aqui, e não no <script> do Nav, para
// poder ser testada: o "Esc" é o nome que o Internet Explorer e o Edge antigo
// mandavam em KeyboardEvent.key, e quem só compara com "Escape" deixa o menu
// preso aberto nesses navegadores.
export function ehTeclaDeFechar(tecla: string): boolean {
  return tecla === 'Escape' || tecla === 'Esc';
}

export function ligarExpansivel(botao: Element | null): void {
  if (!(botao instanceof HTMLButtonElement)) return;

  // O botão nasce com [hidden] no HTML e só aparece aqui. Sem JavaScript ele
  // nunca aparece, e o CSS deixa a lista sempre visível — o comportamento de
  // antes deste recurso, em vez de um menu que não abre.
  botao.hidden = false;

  botao.addEventListener('click', () => {
    botao.setAttribute('aria-expanded', proximoEstado(botao.getAttribute('aria-expanded')));
  });
}
