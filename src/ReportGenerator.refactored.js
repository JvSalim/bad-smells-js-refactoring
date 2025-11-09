export class ReportGenerator {
  constructor(database) {
    this.db = database; // mantido para compatibilidade
  }

  generateReport(reportType, user, items) {
    const visibleItems = this.filterItemsByRole(user, items);
    const header = this.buildHeader(reportType, user);
    const body = visibleItems.map((item) => this.buildRow(reportType, user, item)).join('');
    const total = this.sumValues(visibleItems);
    const footer = this.buildFooter(reportType, total);
    return (header + body + footer).trim();
  }

  // Regras de visibilidade
  filterItemsByRole(user, items) {
    if (user.role === 'ADMIN') return items;
    if (user.role === 'USER') return items.filter((i) => i.value <= 500);
    return [];
  }

  // Prioridade (somente ADMIN com item > 1000)
  isPriority(user, item) {
    return user.role === 'ADMIN' && item.value > 1000;
  }

  // Cabeçalhos
  buildHeader(reportType, user) {
    if (reportType === 'CSV') {
      return 'ID,NOME,VALOR,USUARIO\n';
    }
    if (reportType === 'HTML') {
      return (
        '<html><body>\n' +
        '<h1>Relatório</h1>\n' +
        `<h2>Usuário: ${user.name}</h2>\n` +
        '<table>\n' +
        '<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n'
      );
    }
    return '';
  }

  // Linhas
  buildRow(reportType, user, item) {
    if (reportType === 'CSV') {
      return `${item.id},${item.name},${item.value},${user.name}\n`;
    }
    if (reportType === 'HTML') {
      const style = this.isPriority(user, item) ? ' style="font-weight:bold;"' : '';
      return `<tr${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
    }
    return '';
  }

  // Rodapé
  buildFooter(reportType, total) {
    if (reportType === 'CSV') {
      return `\nTotal,,\n${total},,\n`;
    }
    if (reportType === 'HTML') {
      return `</table>\n<h3>Total: ${total}</h3>\n</body></html>\n`;
    }
    return '';
  }

  // Soma
  sumValues(items) {
    return items.reduce((acc, it) => acc + it.value, 0);
  }
}
