# Portfólio Gabriel Rangel

Next.js (App Router) + Tailwind 4, pronto para a Vercel. Requisitos e decisões em [`docs/PRD.md`](docs/PRD.md); tokens visuais em [`DESIGN.md`](DESIGN.md).

## Desenvolvimento

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build
npm run contrast   # confere os pares de cor do DESIGN.md
```

## Deploy na Vercel

1. Crie um repositório vazio no GitHub e envie este projeto:
   ```bash
   git remote add origin https://github.com/<usuario>/<repositorio>.git
   git push -u origin main
   ```
2. Na Vercel: **Add New > Project**, importe o repositório. O framework (Next.js) é detectado sozinho; não mude build nem output.
3. Variáveis de ambiente: veja `.env.example`. Sem nenhuma delas o site sobe normalmente e fica **fora dos buscadores** (`noindex` e `robots.txt` bloqueando tudo).
4. No lançamento: defina `NEXT_PUBLIC_INDEXABLE=true` e `NEXT_PUBLIC_SITE_URL` com o domínio final, e faça um novo deploy.

Cada branch e pull request gera uma URL de preview.
