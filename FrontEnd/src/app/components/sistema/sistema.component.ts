import { Component, ElementRef, ViewChild } from '@angular/core';
import { SistemaService, SistemaRequest, SistemaResponse } from '../../service/sistema.service';
import { FormGroup, FormControl, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-sistema',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './sistema.component.html',
  styleUrl: './sistema.component.scss'
})
export class SistemaComponent {
  resultado: SistemaResponse | null = null;
  tamanho: number = 2;
  form: FormGroup  = new FormGroup({});

  @ViewChild ('resultadoContainer') resultadoRef!: ElementRef;

  constructor(private sistemaService: SistemaService) {
    this.iniciarForm(this.tamanho);
  }

  iniciarForm(tamanho: number) {
    this.form = new FormGroup({
      A: new FormArray(
        Array.from({ length: tamanho }, () => new FormArray(
          Array.from({ length: tamanho }, () => new FormControl(0, Validators.required))
        ))
      ),
      b: new FormArray(
        Array.from({ length: tamanho }, () => new FormControl(0, Validators.required))
      )
    });
  }

  get matrizA(): FormArray {
    return this.form.get('A') as FormArray;
  }

  get vetorB(): FormArray {
    return this.form.get('b') as FormArray;
  }

  getB(i: number): FormControl {
    return this.vetorB.at(i) as FormControl;
  }

  getLinhaA(i: number): FormArray {
    return this.matrizA.at(i) as FormArray;
  }

  getVariavel(index: number): string {
    const letras = ['a','b','c','d','e','f','g','h','i','j'];
    return letras[index] || `x${index+1}`;
  }

  alterarTamanho() {
    if (this.tamanho < 1) this.tamanho = 1;
    if (this.tamanho > 10) this.tamanho = 10;
    this.iniciarForm(this.tamanho);
    this.resultado = null;
  }

  resolver() {
    const payload: SistemaRequest = {
      A: this.matrizA.controls.map(row => (row as FormArray).controls.map(c => c.value)),
      b: this.vetorB.controls.map(c => c.value)
    };

    this.sistemaService.resolverSistema(payload).subscribe(res => {
      this.resultado = res;

      // Dispara confete baseado na classificação
      if (res.classificacao) {
        this.dispararConfete(res.classificacao);
      }

      // Rola até o resultado
      setTimeout(() => this.rolarParaResultado(), 100);
    
    });
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

  dispararConfete(classificacao: string) {
    switch (classificacao) {
      case 'SPD':
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00ff00', '#00cc00', '#009900'] // verde
        });
        break;
      case 'SPI':
        confetti({
          particleCount: 150,
          spread: 120,
          origin: { y: 0.6 },
          shapes: ['star', 'circle'],
          colors: ['#ff9900', '#ffcc00', '#ffaa00'] // laranja/dourado
        });
        break;
      case 'SI':
        confetti({
          particleCount: 80,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#ff0000', '#cc0000'], // vermelho
        });
        break;
    }
  }

  rolarParaResultado() {
    if (this.resultadoRef) {
      this.resultadoRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
