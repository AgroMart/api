# Política de Branch

Para garantir um fluxo de trabalho contínuo e de forma padronizada possibilitando o rastreamento das funcionalidades desenvolvidas e facilitando, será utilizada a estratégia de Gitflow.

Os conceitos chaves para implementação da estratégia de Gitflow:

- master: contém o nosso código de produção, todo o código que estamos desenvolvendo, em algum momento será “juntado” com essa branch
- develop: contém o código do nosso próximo deploy, isso significa que conforme as features vão sendo finalizadas elas vão sendo juntadas nessa branch para posteriormente serem juntadas com a master
- feature/\*: são branches para o desenvolvimento de uma funcionalidade específica, por convenção elas tem o nome iniciado por feature/, por exemplo: feature/cadastro-usuarios. - - Importante ressaltar que essas branches são criadas sempre à partir da branch develop
- hotfix/\*: são branches responsáveis pela realização de alguma correção crítica encontrada em produção e por isso são criadas à partir da master. Importante ressaltar que essa branch deve ser juntada tanto com a master quanto com a develop

> Obs: - doc/\*: são branches realacionadas a documentação. Essa branch não é contemplada no Gitflow, mas é importante para o projeto.

Exemplo do fluxo de branches:

![Gitflow](./img/git-flow.png)

# Nomenclatura

Toda branch criada deve estar relacionada a uma funcionalidade ou correção, logo necessariamente deverá estar atrelada a uma Issue. Terão como padrão de nomenclatura: </p>
  

``` <Identificador da atividade>-<Nome issue associada a atividade>```

**Exemplos:**

```feature/TS03-Configurar-Ambientes```

```hotfix/BUG-Duplicação-no-Banco```

```feature/US01-Implementar-Login```

```doc/doc-arquitetura```


# Referências

- A successful Git branching model. Vincent Driessen. Disponível em: <https://nvie.com/posts/a-successful-git-branching-model/>.

- FeatureBranch. Martin Fowler. Disponível em: <https://martinfowler.com/bliki/FeatureBranch.html>.

- Git Feature Branch Workflow. Atlassian. Disponível em: <https://br.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow>.