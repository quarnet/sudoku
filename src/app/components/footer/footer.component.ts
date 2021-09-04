import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor() {}

  links = [
    {
      title: 'instagram',
      url: 'https://www.instagram.com/itsaxaypatel/',
      icon: 'bi-instagram',
    },
    {
      title: 'github',
      url: 'https://github.com/quarnet',
      icon: 'bi-github',
    },
    {
      title: 'google',
      url: 'mailto:patelaxay47@gmail.com',
      icon: 'bi-google',
    },
    {
      title: 'linkedin',
      url: 'https://www.linkedin.com/in/-akshay-patel-/',
      icon: 'bi-linkedin',
    },
  ];
  ngOnInit(): void {}
}
