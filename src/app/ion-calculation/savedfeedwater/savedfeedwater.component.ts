import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpServiceService } from './shared/http-service.service';
import { SavedApllication } from './shared/SavedApllicationInterface';


@Component({
  selector: 'app-savedfeedwater',
  templateUrl: './savedfeedwater.component.html',
  styleUrls: ['./savedfeedwater.component.css']
})
export class SavedfeedwaterComponent implements OnInit {
  savedApplciation: SavedApllication[] = [];
  constructor(private service: HttpServiceService<SavedApllication>,
    private router: Router) { }

  ngOnInit(): void {
    this.service.HttpGet('feedwater').subscribe(res => {
      this.savedApplciation = res;
    })
  }

  routeTo(id: string) {
    this.router.navigate(["home/feedwater/"], {
      queryParams: { id: id },
    });
  }

}
