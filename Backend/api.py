from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import string

app = FastAPI()

# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # libera todas as origens (pode restringir depois)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SistemaRequest(BaseModel):
    A: list[list[float]]
    b: list[float]

def escalonar(A, b):
    n = len(b)
    for i in range(n):
        if A[i][i] == 0:
            for k in range(i+1, n):
                if A[k][i] != 0:
                    A[i], A[k] = A[k], A[i]
                    b[i], b[k] = b[k], b[i]
                    break
        if A[i][i] == 0:
            continue
        for k in range(i+1, n):
            fator = A[k][i] / A[i][i]
            for j in range(i, n):
                A[k][j] -= fator * A[i][j]
            b[k] -= fator * b[i]
    return A, b

def retro_substituicao(A, b):
    n = len(b)
    x = [0] * n
    for i in range(n-1, -1, -1):
        if abs(A[i][i]) < 1e-9:
            return None
        soma = sum(A[i][j] * x[j] for j in range(i+1, n))
        x[i] = (b[i] - soma) / A[i][i]
    return x

def classificar(A, b):
    n = len(b)
    rank = 0
    for i in range(n):
        if any(abs(A[i][j]) > 1e-9 for j in range(n)):
            rank += 1
        elif abs(b[i]) > 1e-9:
            return "SI"
    if rank < n:
        return "SPI"
    return "SPD"

@app.post("/resolver")
def resolver_sistema(req: SistemaRequest):
    A = [linha[:] for linha in req.A]
    b = req.b[:]

    # Escalonar e classificar
    A, b = escalonar(A, b)
    tipo = classificar(A, b)

    # Arredondar sistema escalonado
    A_arredondado = [[round(valor, 1) for valor in linha] for linha in A]
    b_arredondado = [round(valor, 1) for valor in b]

    if tipo == "SPD":
        solucao = retro_substituicao(A, b)
        incognitas = list(string.ascii_lowercase)
        resultado = {incognitas[i]: round(solucao[i], 1) for i in range(len(solucao))}
    elif tipo == "SPI":
        resultado = "O sistema possui infinitas soluções (SPI)."
    else:
        resultado = "O sistema é impossível (SI)."

    return {
        "classificacao": tipo,
        "resultado": resultado,
        "escalonado": {"A": A_arredondado, "b": b_arredondado}  # ← adicionando sistema escalonado
    }