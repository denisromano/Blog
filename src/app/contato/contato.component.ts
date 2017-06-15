import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {



  constructor() { }

  mensagensErro = {
    'nome': { 'required': 'favor preencher o nome' }
    , 'email': {
      'required': 'favor preencher o email',
      'emailIsValid': 'o formato do email preenchido esta incorreto'
    }
    , 'texto': {
      'required': 'favor preencher o texto',
      'minlenght': 'você precisa informar um texto com no mínimo 5 caracteres',
      'maxlenght': 'o limite do texto é de 100 caracteres'
    }
  };


  ngOnInit() { this.buildForm(); }
  buildForm() {
    this.contatoForm = this.fb.group({
      'nome': ['', [Validators.required]],
      'email': ['', [Validators.required]],
      'texto': ['', [Validators.required,
      Validators.minLength(4), Validators.maxLength(100)]]
    });
    this.contatoForm.ValueChanges();    
  }
  onValueChanged(data?: any) {
    if (!this.contatoForm) return;
    this.listaErros =[];
    for (const field in this.contatoForm.controls) {
      var control = this.contatoForm.get(field);
      if (control && control.dirty && !control.valid) {
        for (const error in control.errors) {
          this.listaErros.push({sucesso:false,
            texto: this.mensagensErro[field][error]});
        }
      }
    }
  }
  onSubmit(){
    if (this.contatoForm.valid) {
      let headers = new Headers(
        {'Content-Type': 'application/json' });
      let options = new RequestOptions( {headers : headers} );
      this.http.post('api/contato',
        JSON.stringify(this.contatoForm.value), options)
        .map(this.mapeiaResultado)
        .subscribe(recent => {
          this.zone.run(() => {
            this.resultadoEnvioContato(recent);
          });
        });      
    }
  }
  mapeiaResultado(res: Response) {return res.json(); }

  resultadoEnvioContato(res: Resultado | any) {
    var sucesso = {sucesso: true,
      texto: "Contato enviado com sucesso!"};
    this.listaResultado = [];
    if (res.sucess){
      this.listaResultado.push(sucesso);
      this.contatoForm.markAsPristine();
      this.contatoForm.reset();
    }else{
      this.listaResultado.push(this.falha);
    }  
  }
}

export class Resultado {
  success: false
}
