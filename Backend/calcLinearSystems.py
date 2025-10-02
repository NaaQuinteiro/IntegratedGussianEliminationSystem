
import string


def imprimir_sistema(A, b):
    n = len(b)
    incognitas = list(string.ascii_lowercase)  # ['a', 'b', 'c', ..., 'z']
    
    for i in range(n):
        linha = " + ".join(f"{A[i][j]:.0f}{incognitas[j]}" for j in range(n))
        print(f"{linha} = {b[i]:.0f}")
    print()


def escalonar(A, b):
    n = len(b)
    for i in range(n):
        # Pivotamento simples (troca se pivô = 0)
        if A[i][i] == 0:
            for k in range(i+1, n):
                if A[k][i] != 0:
                    A[i], A[k] = A[k], A[i]
                    b[i], b[k] = b[k], b[i]
                    break
        if A[i][i] == 0:  # ainda zero -> segue
            continue

        # Eliminação abaixo do pivô
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
        if abs(A[i][i]) < 1e-9:  # pivô nulo
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
            return "SI"  # 0 = c, impossível

    if rank < n:
        return "SPI"  # menos equações independentes
    return "SPD"  # solução única


def main():
    n = int(input("Digite o tamanho do sistema (até 10): "))
    if n > 10 or n < 1:
        print("Tamanho inválido!")
        return

    # Entrada dos coeficientes
    A = []
    b = []
    print("Digite os coeficientes da matriz A e o termo independente b:")
    for i in range(n):
        linha = []
        for j in range(n):
            linha.append(float(input(f"A[{i+1},{j+1}]: ")))
        A.append(linha)
        b.append(float(input(f"b[{i+1}]: ")))

    print("\nSistema original:")
    imprimir_sistema([row[:] for row in A], b[:])

    # Escalonamento
    A, b = escalonar(A, b)
    print("Sistema escalonado:")
    imprimir_sistema(A, b)

    # Classificação final
    tipo = classificar(A, b)
    print(f"\nClassificação: {tipo}")

    if tipo == "SPD":
        x = retro_substituicao(A, b)
        print("Solução:")
        incognitas = list(string.ascii_lowercase)
        for i, valor in enumerate(x):
            print(f"{incognitas[i]} = {valor:.0f}")
    elif tipo == "SPI":
        print("O sistema possui infinitas soluções (SPI).")
    else:
        print("O sistema é impossível (SI).")


if __name__ == "__main__":
    main()