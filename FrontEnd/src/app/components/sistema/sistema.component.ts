import { Component } from '@angular/core';
import { SistemaService, SistemaRequest, SistemaResponse } from '../../service/sistema.service';
import { FormGroup, FormControl, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sistema',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './sistema.component.html'
})
export class SistemaComponent {
  resultado: SistemaResponse | null = null;
  tamanho: number = 2;
  form: FormGroup  = new FormGroup({});

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
    });
  }
}
