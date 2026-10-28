# Publicar no GitHub

## 1. Criar o repositório e enviar o código
```bash
gh repo create <dono>/preco-real --public --source . --remote origin --push   # ou crie no site e faça git push
```
O GitHub Pages só serve repositórios **privados** em planos pagos (Pro, Team, Enterprise); no plano gratuito o repositório tem de ser público.

## 2. Ativar o Pages
Settings → Pages → Source: **GitHub Actions**. O workflow `Deploy (GitHub Pages)` publica a cada push para `main`.

## 3. Proteger o `main`
```bash
scripts/protect-main.sh <dono>/preco-real          # PR e testes obrigatórios; sem force push
scripts/protect-main.sh <dono>/preco-real 1        # com 1 aprovação obrigatória (quando houver mais pessoas)
```
Em Settings → Actions → General: *Fork pull request workflows* → exigir aprovação para contribuidores externos.

## 4. URL
- Por defeito: `https://<dono>.github.io/<nome-do-repo>/` (o nome do repositório decide o caminho).
- Sem caminho: nomear o repositório `<dono>.github.io` (site de utilizador) e definir a variável de repositório `BASE_PATH` = `/`.
- Domínio próprio: Settings → Pages → Custom domain, e `BASE_PATH` = `/`.
