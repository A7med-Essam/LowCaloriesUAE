import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { IBoot,  } from 'src/app/shared/interfaces/boot';
import { IBootResponse } from 'src/app/shared/interfaces/HttpResponse';
import { BotService } from 'src/app/shared/services/profile/bot.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-ask-us',
  templateUrl: './ask-us.component.html',
  styleUrls: ['./ask-us.component.scss']
})
export class AskUsComponent implements OnInit {
  Questions:IBoot[][] = [];
  Answers!:IBoot[];
  CurrentQuestions:number[] = [];
  CurrentSelectedAnswers:{id:number, SelectedAnswer:string}[] = [];
  constructor(
    private _BotService:BotService,
    private _SharedService:SharedService,
    private _ToastrService: ToastrService,
    private translate:TranslateService
  ) { }

  ngOnInit(): void {
    this.getQuestion()

  }

  getQuestion(){
    this._BotService.getQuestions().subscribe(
      (res:IBootResponse)=>{
        if (this.translate.currentLang == 'ar') {
          res.data.map(e=>{
            e.question = e.question_ar
          })
          this.Questions = [res.data];
        }
        else{
          this.Questions = [res.data];
        }
      })
  }

  getMoreQuestions(question_id:number){
    if (!this.CurrentQuestions.includes(question_id)) {
      let id: number = this._SharedService.getFormData({
        question_id: question_id,
      }) as any as number;
      this._BotService.getAnswers(id).subscribe(
      (res:IBootResponse)=>{
        if (this.translate.currentLang == 'ar') {
          res.data.map(e=>{
            e.question = e.question_ar
          })
          this.Questions = [...this.Questions,res.data];
        }
        else{
          this.Questions = [...this.Questions,res.data];
        }
      })
    }
    this.CurrentQuestions.push(question_id);
  }

  getSelectedQuestion(Question:string,id:number){
    if(!this.CurrentSelectedAnswers.find( q => q.id == id)){
      this.CurrentSelectedAnswers.push({id:id,SelectedAnswer:Question});
    }else{
      if (this.translate.currentLang == 'ar') {
        this._ToastrService.warning(
          "لقد طرحت هذا السؤال بالفعل",'Notification',
          {
            timeOut: 3000,
          }
        );
      }
      else{
        this._ToastrService.warning(
          "You already asked this question",'Notification',
          {
            timeOut: 3000,
          }
        );
      }
    }
  }



}
