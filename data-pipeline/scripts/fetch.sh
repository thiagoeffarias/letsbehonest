#!/usr/bin/env bash
# Descarrega os indicadores do INE para raw/. A API falha de forma intermitente: repete até vir "Dados".
set -euo pipefail
cd "$(dirname "$0")/../raw"
get() { # $1 = código, $2 = parâmetros extra
  for i in 1 2 3 4 5 6; do
    curl -s -m 120 "https://www.ine.pt/ine/json_indicador/pindica.jsp?op=2&varcd=$1&lang=PT$2" -o "ine_$1.json" || true
    grep -q '"Dados"' "ine_$1.json" && { echo "ine_$1.json ok"; return; }
    sleep 3
  done
  echo "falhou: $1" >&2; exit 1
}
get 0012234 "&Dim1=T"   # mediana de venda por categoria, todos os períodos
get 0012749 ""          # rendimento mediano declarado (último ano)
get 0012600 "&Dim1=T"   # renda mediana de novos contratos
