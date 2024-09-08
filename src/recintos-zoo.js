class RecintosZoo {
  constructor() {
    this.recintos = [
      { numero: 1, biomas: ['savana'], tamanhoTotal: 10, especiesExistentes: [{ especie: 'MACACO', tamanho: 1 }, { especie: 'MACACO', tamanho: 1 }, { especie: 'MACACO', tamanho: 1 }] },
      { numero: 2, biomas: ['floresta'], tamanhoTotal: 5, especiesExistentes: [] },
      { numero: 3, biomas: ['savana','rio'], tamanhoTotal: 7, especiesExistentes: [{ especie: 'GAZELA', tamanho: 2 }] },
      { numero: 4, biomas: ['rio'], tamanhoTotal: 8, especiesExistentes: [] },
      { numero: 5, biomas: ['savana'], tamanhoTotal: 9, especiesExistentes: [{ especie: 'LEAO', tamanho: 3 }] },
    ];

    this.especies = [
      { nome:'LEAO', tamanho: 3, biomas: ['savana'] },
      { nome:'LEOPARDO', tamanho: 2, biomas: ['savana'] },
      { nome:'CROCODILO', tamanho: 3, biomas: ['rio'] },
      { nome:'MACACO', tamanho: 1, biomas: ['savana', 'floresta'] },
      { nome:'GAZELA', tamanho: 2, biomas: ['savana'] },
      { nome:'HIPOPOTAMO', tamanho: 4, biomas: ['savana', 'rio'] },
    ];
  }

  analisaRecintos(animal, quantidade) {
    const infoEspecie = this.especies.find((especie) => especie.nome === animal);

    if (!infoEspecie)
      return { erro: "Animal inválido" };
    if (quantidade <= 0)
      return { erro: "Quantidade inválida" };

    const recintosViaveis = this.recintos
    .filter((recinto) => this.podeAdicionar(recinto, infoEspecie, quantidade))
    .map((recinto) => {
        const novoEspacoLivre = this.espacoLivre(recinto) - this.calculaEspacoNecessario(recinto, infoEspecie, quantidade)
        return `Recinto ${recinto.numero} (espaço livre: ${novoEspacoLivre} total: ${recinto.tamanhoTotal})`;
    })
    .sort((a, b) => a.numero - b.numero);

    if (!recintosViaveis.length)
      return { erro: "Não há recinto viável" };

    return {recintosViaveis: recintosViaveis};
  }

  podeAdicionar(recinto, infoEspecie, quantidade) {
    if (!this.verificaRestricaoBioma(recinto, infoEspecie))
      return false;

    if (!this.verificaRestricaoEspacoLivre(recinto, infoEspecie, quantidade))
      return false;

    if (!this.verificaRestricaoCarnivoro(recinto, infoEspecie))
      return false;

    if (!this.verificaRestricaoHipopotamo(recinto))
      return false;

    if (!this.verificaRestricaoMacaco(recinto, infoEspecie, quantidade))
      return false;

    return true;
  }

  espacoLivre(recinto) {
    return recinto.tamanhoTotal - recinto.especiesExistentes.reduce((total, animal) => total + animal.tamanho, 0);
  }

  calculaEspacoNecessario(recinto, infoEspecie, quantidade) {
    const espacoNecessario = quantidade * infoEspecie.tamanho;

    let espacoExtra = 0
    if (recinto.especiesExistentes.some((item) => item.especie != infoEspecie.nome)) espacoExtra = 1;

    return espacoNecessario + espacoExtra
  }

  verificaRestricaoEspacoLivre(recinto, infoEspecie, quantidade) {
    return this.espacoLivre(recinto) > this.calculaEspacoNecessario(recinto, infoEspecie, quantidade);
  }

  verificaRestricaoBioma(recinto, infoEspecie) {
    return recinto.biomas.some((bioma) => infoEspecie.biomas.includes(bioma))
  }

  verificaRestricaoCarnivoro(recinto, infoEspecie) {
    const carnivoros = ['LEAO', 'LEOPARDO', 'CROCODILO'];
    const carnivoroExistente = recinto.especiesExistentes.find((item) => carnivoros.includes(item.especie));

    if (!recinto.especiesExistentes.length)
      return true;

    if (!carnivoroExistente && !carnivoros.includes(infoEspecie.nome))
      return true;

    if (carnivoroExistente === infoEspecie.nome)
      return true;

    return false;
  }

  verificaRestricaoHipopotamo(recinto) {
    if (!recinto.especiesExistentes.find((item) => item.especie === 'HIPOPOTAMO'))
      return true;

    if (['savana', 'rio'].every((bioma) => recinto.biomas.includes(bioma)))
      return true;

    return false
  }

  verificaRestricaoMacaco(recinto, infoEspecie, quantidade) {
    if (infoEspecie.nome != 'MACACO')
      return true;

    if (quantidade || recinto.especiesExistentes.length)
      return true;

    return false;
  }
}

export { RecintosZoo as RecintosZoo };